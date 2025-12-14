package controller

import (
	"net/http"
	"uitjobs-backend/internal/model"
	"uitjobs-backend/internal/repository"
	"uitjobs-backend/internal/util"

	"github.com/gin-gonic/gin"
)

type UserController struct{}

func (ctrl *UserController) Register(c *gin.Context) {
	var user model.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Vui lòng kiểm tra lại thông tin đã nhập."})
		return
	}

	hashed, err := util.HashPassword(user.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể mã hóa mật khẩu"})
		return
	}
	user.Password = hashed

	result, err := repository.Repos.UserRepo.Create(&user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Đã có lỗi xảy ra. Vui lòng thử lại."})
		return
	}
	c.JSON(http.StatusCreated, result)

}

func (ctrl *UserController) Login(c *gin.Context) {
	var body struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(400, gin.H{"error": "Vui lòng kiểm tra lại thông tin đã nhập."})
		return
	}

	username := body.Username
	password := body.Password

	user, err := repository.Repos.UserRepo.FindByUsername(username)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Người dùng không tồn tại"})
		return
	}

	if !util.ComparePassword(password, user.Password) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Sai mật khẩu"})
		return
	}

	payload := &model.UserPayload{
		Username:   user.Username,
		Email:      user.Email,
		EmployerId: user.EmployerId,
	}

	accessToken, err := util.CreateAccessToken(payload)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể tạo access token"})
		return
	}
	refreshToken, err := util.CreateRefreshToken(payload)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể tạo refresh token"})
		return
	}

	c.SetCookie("accessToken", accessToken, 7*24*60*60, "/", "", false, true)
	c.SetCookie("refreshToken", refreshToken, 30*24*60*60, "/", "", false, true)

	user.Password = ""

	c.JSON(http.StatusOK, user)

}

func (ctrl *UserController) RenewAccessToken(c *gin.Context) {
	refreshToken, err := c.Cookie("refreshToken")
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Không có refresh token"})
		return
	}
	claims, err := util.VerifyToken(refreshToken)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Refresh token không hợp lệ"})
		return
	}

	payload := &model.UserPayload{
		Username:   claims.Username,
		Email:      claims.Email,
		EmployerId: claims.EmployerId,
	}

	newAccessToken, err := util.CreateAccessToken(payload)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể tạo access token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"accessToken": newAccessToken,
	})
}

func (ctrl *UserController) UpdateInfo(c *gin.Context) {
	var user model.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Vui lòng kiểm tra lại thông tin đã nhập."})
		return
	}

	result, err := repository.Repos.UserRepo.UpdateInfo(&user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Đã có lỗi xảy ra. Vui lòng thử lại."})
		return
	}
	c.JSON(http.StatusOK, result)
}

func (ctrl *UserController) ChangePassword(c *gin.Context) {
	var body struct {
		Username    string `json:"username"`
		Password    string `json:"password"`
		NewPassword string `json:"new_password"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Vui lòng kiểm tra lại thông tin đã nhập."})
		return
	}

	username := body.Username
	password := body.Password

	user, err := repository.Repos.UserRepo.FindByUsername(username)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Người dùng không tồn tại"})
		return
	}

	if !util.ComparePassword(password, user.Password) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Sai mật khẩu"})
		return
	}

	hashed, err := util.HashPassword(body.NewPassword)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể mã hóa mật khẩu mới"})
		return
	}
	result, err := repository.Repos.UserRepo.UpdatePassword(username, hashed)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Đã có lỗi xảy ra. Vui lòng thử lại."})
		return
	}

	c.JSON(http.StatusOK, result)
}

func (ctrl *UserController) Logout(c *gin.Context) {
	c.SetCookie("accessToken", "", -1, "/", "", false, true)

	c.SetCookie("refreshToken", "", -1, "/", "", false, true)

	c.JSON(http.StatusOK, gin.H{
		"message": "Đăng xuất thành công",
	})
}
