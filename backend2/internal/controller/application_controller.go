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
	log.Println("Checking if application ID exists:", appId)
	app, err := repo.FindById(appId)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return false, nil
		}

		// Các lỗi khác → lỗi
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
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	log.Println("Creating application:", application)

	uniqueId, err := ctrl.generateUniqueAppId(repository.Repos.ApplicationRepo)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate unique application ID"})
		return
	}
	application.Id = uniqueId
	log.Println("Generated unique application ID:", application.Id)
	result, err := repository.Repos.ApplicationRepo.Create(&application)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
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
		c.JSON(http.StatusNotFound, gin.H{"error": "Application not found"})
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

	var fields = util.GetFields(c, "page", "resultPerPage", "searchValue")
	data, pagination, quantityPerStatus, positions, faculties, err := repository.Repos.ApplicationRepo.FindByFields(fields, searchValue, page, resultPerPage)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"data":              data,
		"pagination":        pagination,
		"quantityPerStatus": quantityPerStatus,
		"positions":         positions,
		"faculties":         faculties,
	})
}

func (ctrl *ApplicationController) UpdateById(c *gin.Context) {
	var application struct {
		Id     string `json:"id" db:"id"`
		Status string `json:"status" db:"status"`
	}
	if err := c.ShouldBindJSON(&application); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	log.Println("Update application:", application)
	var fields = util.StructToMap(application, "id")
	log.Println("fields: ", fields)
	result, err := repository.Repos.ApplicationRepo.UpdateById(application.Id, fields)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, result)
}

func (ctrl *ApplicationController) DeleteById(c *gin.Context) {
	var body struct {
		Id string `json:"id"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result, err := repository.Repos.ApplicationRepo.DeleteById(body.Id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, result)
}
