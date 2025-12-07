package route

import (
	"uitjobs-backend/internal/controller"
	// "uitjobs-backend/internal/middleware"

	"github.com/gin-gonic/gin"
)

func JobRoutes(router *gin.RouterGroup) {
	router.POST("/create", controller.CreateJob)
	router.GET("/find-by-id/:id", controller.FindById)
	router.GET("/find-by-fields", controller.FindByFields)
	router.PUT("/update-by-id", controller.UpdateById)
	router.DELETE("/delete-by-id", controller.DeleteById)
}
