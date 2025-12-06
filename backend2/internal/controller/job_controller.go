package controller

import (
	"net/http"
	"uitjobs-backend/internal/model"
	"uitjobs-backend/internal/repository"

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

	c.JSON(http.StatusCreated, gin.H{"result": result})
}
