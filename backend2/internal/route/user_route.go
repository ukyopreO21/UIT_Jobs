package route

import (
	"uitjobs-backend/internal/controller"

	"github.com/gin-gonic/gin"
)

func UserRoutes(router *gin.RouterGroup) {

	router.GET("/test", controller.Test)
}
