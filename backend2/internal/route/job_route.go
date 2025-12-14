package route

import (
	"uitjobs-backend/internal/controller"
	"uitjobs-backend/internal/middleware"

	"github.com/gin-gonic/gin"
)

var jobController = controller.JobController{}

func JobRoutes(router *gin.RouterGroup) {
	router.POST("/create", middleware.RequireAuth(), jobController.Create)
	router.GET("/find-by-id/:id", jobController.FindById)
	router.GET("/find-by-fields", jobController.FindByFields)
	router.PUT("/update-by-id", middleware.RequireAuth(), jobController.UpdateById)
	router.DELETE("/delete-by-id", middleware.RequireAuth(), jobController.DeleteById)
}
