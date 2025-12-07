package route

import (
	"uitjobs-backend/internal/controller"

	"github.com/gin-gonic/gin"
)

func UserRoutes(router *gin.RouterGroup) {
	router.POST("/register", controller.Register)
	router.POST("/login", controller.Login)
	router.POST("/renew-access-token", controller.RenewAccessToken)
	router.POST("/update-info", controller.UpdateInfo)
	router.POST("/change-password", controller.ChangePassword)
	router.POST("/logout", controller.Logout)
}
