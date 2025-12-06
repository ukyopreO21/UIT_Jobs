package route

import (
	"uitjobs-backend/internal/controller"
	"uitjobs-backend/internal/middleware"

	"github.com/gin-gonic/gin"
)

func JobRoutes(router *gin.RouterGroup) {

	router.POST("/create", middleware.AdminAuth(), controller.CreateJob)
}
