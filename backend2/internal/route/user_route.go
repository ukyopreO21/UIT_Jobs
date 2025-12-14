package route

import (
	"uitjobs-backend/internal/controller"
	"uitjobs-backend/internal/middleware"

	"github.com/gin-gonic/gin"
)

var userController = controller.UserController{}

func UserRoutes(router *gin.RouterGroup) {
	router.POST("/register", userController.Register)
	router.POST("/login", userController.Login)
	router.POST("/renew-access-token", userController.RenewAccessToken)
	router.POST("/update-info", middleware.RequireAuth(), userController.UpdateInfo)
	router.POST("/change-password", userController.ChangePassword)
	router.POST("/logout", middleware.RequireAuth(), userController.Logout)
}
