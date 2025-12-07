package controller

import (
	"net/http"
	"uitjobs-backend/internal/model"
	"uitjobs-backend/internal/repository"
	"uitjobs-backend/internal/util"

	"github.com/gin-gonic/gin"
)

func Register(c *gin.Context) {
	var user model.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	hashed, err := util.HashPassword(user.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}
	user.Password = hashed

	result, err := repository.Repos.UserRepo.Create(&user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, result)

}

func Login(c *gin.Context) {
	var body struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(400, gin.H{"error": "Invalid body"})
		return
	}

	username := body.Username
	password := body.Password

	user, err := repository.Repos.UserRepo.FindByUsername(username)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	if !util.ComparePassword(password, user.Password) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	accessToken, err := util.CreateAccessToken(map[string]any{"username": user.Username, "password": user.Password})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create access token"})
		return
	}
	refreshToken, err := util.CreateRefreshToken(map[string]any{"username": user.Username, "password": user.Password})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create refresh token"})
		return
	}

	c.SetCookie("accessToken", accessToken, 7*24*60*60, "/", "", false, true)
	c.SetCookie("refreshToken", refreshToken, 30*24*60*60, "/", "", false, true)

	user.Password = ""

	c.JSON(http.StatusOK, gin.H{"message": "Login successful", "data": user})

}

func RenewAccessToken(c *gin.Context) {
	refreshToken, err := c.Cookie("refreshToken")
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "No refresh token provided"})
		return
	}
	claims, err := util.VerifyToken(refreshToken)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid refresh token"})
		return
	}

	username := claims["username"].(string)
	password := claims["password"].(string)

	newAccessToken, err := util.CreateAccessToken(map[string]any{"username": username, "password": password})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Cannot create access token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"accessToken": newAccessToken,
	})
}

func UpdateInfo(c *gin.Context) {
	var user model.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result, err := repository.Repos.UserRepo.UpdateInfo(&user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, result)
}

func ChangePassword(c *gin.Context) {
	var body struct {
		Username    string `json:"username"`
		Password    string `json:"password"`
		NewPassword string `json:"new_password"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	username := body.Username
	password := body.Password

	user, err := repository.Repos.UserRepo.FindByUsername(username)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	if !util.ComparePassword(password, user.Password) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	hashed, err := util.HashPassword(body.NewPassword)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}
	result, err := repository.Repos.UserRepo.UpdatePassword(username, hashed)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, result)
}

func Logout(c *gin.Context) {
	c.SetCookie("accessToken", "", -1, "/", "", false, true)

	c.SetCookie("refreshToken", "", -1, "/", "", false, true)

	c.JSON(http.StatusOK, gin.H{
		"message": "Đăng xuất thành công",
	})
}
