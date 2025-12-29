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
		log.Println("err1", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Vui lòng kiểm tra lại thông tin đã nhập."})
		return
	}

	job.Deadline = job.Deadline.UTC()

	result, err := repository.Repos.JobRepo.Create(&job)
	if err != nil {
		log.Println("err2", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Đã có lỗi xảy ra. Vui lòng thử lại."})
		return
	}

	c.JSON(http.StatusCreated, result)
}

func (ctrl *JobController) FindById(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID không hợp lệ"})
		return
	}
	job, err := repository.Repos.JobRepo.FindById(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Đã có lỗi xảy ra. Vui lòng thử lại."})
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
	user, err := util.GetUserTokenPayload(c)

	var employer_id = ""
	if user != nil {
		employer_id = user.EmployerId
	}

	var fields = util.GetFields(c, "page", "resultPerPage", "searchValue")

	data, pagination, positions, subDepartments, err := repository.Repos.JobRepo.FindByFields(employer_id, fields, searchValue, page, resultPerPage)
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
		"data":           data,
		"pagination":     paginationResponse,
		"positions":      positions,
		"subDepartments": subDepartments,
	})
}

func (ctrl *JobController) UpdateById(c *gin.Context) {
	var job model.Job
	if err := c.ShouldBindJSON(&job); err != nil {
		log.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Vui lòng kiểm tra lại thông tin đã nhập."})
		return
	}
	var fields = util.StructToMap(job, "id", "created_at", "updated_at")

	result, err := repository.Repos.JobRepo.UpdateById(job.Id, fields)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Đã có lỗi xảy ra. Vui lòng thử lại."})
		return
	}
	c.JSON(http.StatusOK, result)
}

func (ctrl *JobController) DeleteById(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID không hợp lệ"})
		return
	}

	if id <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID không hợp lệ"})
		return
	}

	result, err := repository.Repos.JobRepo.DeleteById(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Đã có lỗi xảy ra. Vui lòng thử lại."})
		return
	}
	c.JSON(http.StatusOK, result)
}
