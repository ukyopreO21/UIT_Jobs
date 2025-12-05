package controller

import (
	"net/http"
	"uitjobs-backend/internal/repository"

	"github.com/gin-gonic/gin"
)

func Test(c *gin.Context) {
	result, _ := repository.Repos.UserRepo.FindByUsername("leviettan000")
	c.JSON(http.StatusOK, gin.H{
		"message": "User controller is working!",
		"result":  result,
	})
}
