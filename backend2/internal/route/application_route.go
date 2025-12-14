package route

import (
	"uitjobs-backend/internal/controller"
	"uitjobs-backend/internal/middleware"

	"github.com/gin-gonic/gin"
)

var applicationController = controller.ApplicationController{}

func ApplicationRoutes(router *gin.RouterGroup) {
	router.POST("/create", applicationController.Create)
	router.GET("/find-by-id/:id", applicationController.FindById)
	router.GET("/find-by-fields", middleware.RequireAuth(), applicationController.FindByFields)
	router.PUT("/update-by-id", middleware.RequireAuth(), applicationController.UpdateById)
	router.DELETE("/delete-by-id", middleware.RequireAuth(), applicationController.DeleteById)
}
