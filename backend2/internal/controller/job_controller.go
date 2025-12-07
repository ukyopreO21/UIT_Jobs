package controller

import (
	"net/http"
	"strconv"
	"uitjobs-backend/internal/model"
	"uitjobs-backend/internal/repository"
	"uitjobs-backend/internal/util"

	"github.com/gin-gonic/gin"
)

// func generateID() string {
// 	now := time.Now()
// 	datePart := fmt.Sprintf("%04d%02d%02d", now.Year(), now.Month(), now.Day())
// 	randomPart := fmt.Sprintf("%06d", rand.Intn(1000000))
// 	return datePart + randomPart
// }

// func checkAppIDExists(repo *ApplicationRepository, appID string) (bool, error) {
// 	app, err := repo.FindByID(appID)
// 	if err != nil {
// 		return false, err
// 	}
// 	return app != nil, nil
// }

// GenerateUniqueAppID tạo ID duy nhất, đảm bảo chưa tồn tại trong DB
// func GenerateUniqueAppID(repo *repository.ApplicationRepository) (string, error) {
//

// 	for {
// 		id := generateID()
// 		exists, err := checkAppIDExists(repo, id)
// 		if err != nil {
// 			return "", err
// 		}
// 		if !exists {
// 			return id, nil
// 		}
// 	}
// }

func CreateJob(c *gin.Context) {
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

func FindById(c *gin.Context) {
	id := c.Param("id")
	job, err := repository.Repos.JobRepo.FindByID(id)
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

func FindByFields(c *gin.Context) {
	page, err := strconv.Atoi(c.DefaultQuery("page", "1"))
	if err != nil {
		page = 1
	}
	resultPerPage, err := strconv.Atoi(c.DefaultQuery("resultPerPage", "10"))
	if err != nil {
		resultPerPage = 10
	}
	searchValue := c.DefaultQuery("searchValue", "")

	fields := util.GetFields(c, "page", "resultPerPage", "searchValue")

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

func UpdateById(c *gin.Context) {
	id, err := strconv.Atoi(c.DefaultQuery("id", "0"))
	if err != nil || id == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID không hợp lệ"})
		return
	}

	fields := util.GetFields(c, "id")

	result, err := repository.Repos.JobRepo.UpdateById(id, fields)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, result)
}

func DeleteById(c *gin.Context) {
	id, err := strconv.Atoi(c.DefaultQuery("id", "0"))
	if err != nil || id == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID không hợp lệ"})
		return
	}
	result, err := repository.Repos.JobRepo.DeleteById(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, result)
}
