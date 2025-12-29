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
	router.POST("/refresh", userController.RenewAccessToken)
	router.PUT("", middleware.RequireAuth(), userController.UpdateInfo)
	router.PUT("/password", middleware.RequireAuth(), userController.ChangePassword)
	router.POST("/logout", userController.Logout)
}
