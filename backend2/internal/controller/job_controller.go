package controller

import (
	"log"
	"net/http"
	"strconv"
	"uitjobs-backend/internal/model"
	"uitjobs-backend/internal/repository"
	"uitjobs-backend/internal/util"

	"github.com/gin-gonic/gin"
)

type JobController struct{}

func (ctrl *JobController) Create(c *gin.Context) {
	var job model.Job
	if err := c.ShouldBindJSON(&job); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result, err := repository.Repos.JobRepo.Create(&job)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, result)
}

func (ctrl *JobController) FindById(c *gin.Context) {
	id := c.Param("id")
	job, err := repository.Repos.JobRepo.FindById(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if job == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Việc làm không tồn tại"})
		return
	}

	c.JSON(http.StatusOK, job)
}

func (ctrl *JobController) FindByFields(c *gin.Context) {
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
	log.Println("params:", c.Request.URL.Query())
	log.Println("fields from controller:", fields)

	data, pagination, positions, faculties, err := repository.Repos.JobRepo.FindByFields(fields, searchValue, page, resultPerPage)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	paginationResponse := gin.H{
		"currentPage":   pagination["currentPage"],
		"resultPerPage": pagination["resultPerPage"],
		"totalRecords":  pagination["totalRecords"],
		"totalPages":    pagination["totalPages"],
	}
	c.JSON(http.StatusOK, gin.H{
		"data":       data,
		"pagination": paginationResponse,
		"positions":  positions,
		"faculties":  faculties,
	})
}

func (ctrl *JobController) UpdateById(c *gin.Context) {
	var job model.Job
	if err := c.ShouldBindJSON(&job); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	log.Println("Update job with ID:", job.Id)
	log.Println("Update job data:", job)
	var fields = util.StructToMap(job, "id", "created_at", "updated_at")
	log.Println("các fields: ", fields)

	result, err := repository.Repos.JobRepo.UpdateById(job.Id, fields)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, result)
}

func (ctrl *JobController) DeleteById(c *gin.Context) {
	var body struct {
		Id int `json:"id"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID không hợp lệ"})
		return
	}

	if body.Id <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID không hợp lệ"})
		return
	}

	result, err := repository.Repos.JobRepo.DeleteById(body.Id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, result)
}
