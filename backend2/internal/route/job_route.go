package route

import (
	"uitjobs-backend/internal/controller"
	"uitjobs-backend/internal/middleware"

	"github.com/gin-gonic/gin"
)

var jobController = controller.JobController{}

func JobRoutes(router *gin.RouterGroup) {
	router.POST("", middleware.RequireAuth(), jobController.Create)
	router.GET("/:id", jobController.FindById)
	router.GET("", middleware.OptionalAuth(), jobController.FindByFields)
	router.PUT("/:id", middleware.RequireAuth(), jobController.UpdateById)
	router.DELETE("/:id", middleware.RequireAuth(), jobController.DeleteById)
}
