package route

import (
	"uitjobs-backend/internal/controller"
	"uitjobs-backend/internal/middleware"

	"github.com/gin-gonic/gin"
)

var applicationController = controller.ApplicationController{}

func ApplicationRoutes(router *gin.RouterGroup) {
	router.POST("", applicationController.Create)
	router.GET("/:id", applicationController.FindById)
	router.GET("", middleware.RequireAuth(), applicationController.FindByFields)
	router.PUT("/:id", middleware.RequireAuth(), applicationController.UpdateById)
	router.DELETE("/:id", middleware.RequireAuth(), applicationController.DeleteById)
}
