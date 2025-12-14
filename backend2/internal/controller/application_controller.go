package controller

import (
	"database/sql"
	"errors"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"strconv"
	"time"

	"uitjobs-backend/internal/model"
	"uitjobs-backend/internal/repository"
	"uitjobs-backend/internal/util"

	"github.com/gin-gonic/gin"
)

type ApplicationController struct{}

func (ctrl *ApplicationController) generateId() string {
	now := time.Now()
	datePart := fmt.Sprintf("%04d%02d%02d", now.Year(), now.Month(), now.Day())
	randomPart := fmt.Sprintf("%06d", rand.Intn(1000000))
	log.Println("Generated ID parts:", datePart+randomPart)
	return datePart + randomPart
}

func (ctrl *ApplicationController) checkAppIdExists(repo *repository.ApplicationRepository, appId string) (bool, error) {
	app, err := repo.FindById(appId)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return false, nil
		}
		return false, err
	}
	return app != nil, nil
}

func (ctrl *ApplicationController) generateUniqueAppId(repo *repository.ApplicationRepository) (string, error) {
	for {
		id := ctrl.generateId()
		exists, err := ctrl.checkAppIdExists(repo, id)
		if err != nil {
			return "", err
		}
		if !exists {
			return id, nil
		}
	}
}

func (ctrl *ApplicationController) Create(c *gin.Context) {
	var application model.Application

	if err := c.ShouldBindJSON(&application); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Vui lòng kiểm tra lại thông tin đã nhập."})
		return
	}

	job, err := repository.Repos.JobRepo.FindById(application.JobId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không tìm thấy việc làm đã chọn."})
		return
	}
	if job == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Việc làm không tồn tại"})
		return
	}

	now := time.Now().UTC()
	if now.After(job.Deadline) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Không thể ứng tuyển vào việc làm đã quá hạn"})
		return
	}

	uniqueId, err := ctrl.generateUniqueAppId(repository.Repos.ApplicationRepo)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể tạo mã hồ sơ"})
		return
	}
	application.Id = uniqueId
	result, err := repository.Repos.ApplicationRepo.Create(&application)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể tạo hồ sơ"})
		return
	}
	c.JSON(http.StatusCreated, result)
}

func (ctrl *ApplicationController) FindById(c *gin.Context) {
	id := c.Param("id")
	application, err := repository.Repos.ApplicationRepo.FindById(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if application == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Hồ sơ không tồn tại"})
		return
	}
	c.JSON(http.StatusOK, application)
}

func (ctrl *ApplicationController) FindByFields(c *gin.Context) {
	page, err := strconv.Atoi(c.DefaultQuery("page", "1"))
	if err != nil {
		page = 1
	}
	resultPerPage, err := strconv.Atoi(c.DefaultQuery("resultPerPage", "10"))
	if err != nil {
		resultPerPage = 10
	}
	searchValue := c.DefaultQuery("searchValue", "")

	user, err := util.GetUserTokenPayload(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Không đủ quyền truy cập"})
		return
	}

	var fields = util.GetFields(c, "page", "resultPerPage", "searchValue")
	data, pagination, quantityPerStatus, positions, subDepartments, err := repository.Repos.ApplicationRepo.FindByFields(user.EmployerId, fields, searchValue, page, resultPerPage)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Đã có lỗi xảy ra. Vui lòng thử lại."})
		return
	}

	paginationResponse := gin.H{
		"currentPage":   pagination["currentPage"],
		"resultPerPage": pagination["resultPerPage"],
		"totalRecords":  pagination["totalRecords"],
		"totalPages":    pagination["totalPages"],
	}
	c.JSON(http.StatusOK, gin.H{
		"data":              data,
		"pagination":        paginationResponse,
		"quantityPerStatus": quantityPerStatus,
		"positions":         positions,
		"subDepartments":    subDepartments,
	})
}

func (ctrl *ApplicationController) UpdateById(c *gin.Context) {
	var application struct {
		Id     string `json:"id" db:"id"`
		Status string `json:"status" db:"status"`
	}
	if err := c.ShouldBindJSON(&application); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Vui lòng kiểm tra lại thông tin đã nhập."})
		return
	}
	var fields = util.StructToMap(application, "id")
	result, err := repository.Repos.ApplicationRepo.UpdateById(application.Id, fields)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Đã có lỗi xảy ra. Vui lòng thử lại."})
		return
	}
	c.JSON(http.StatusOK, result)
}

func (ctrl *ApplicationController) DeleteById(c *gin.Context) {
	var body struct {
		Id string `json:"id"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Vui lòng kiểm tra lại thông tin đã nhập."})
		return
	}

	result, err := repository.Repos.ApplicationRepo.DeleteById(body.Id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Đã có lỗi xảy ra. Vui lòng thử lại."})
		return
	}
	c.JSON(http.StatusOK, result)
}
