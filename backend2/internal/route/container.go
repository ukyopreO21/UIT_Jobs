package route

import (
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.Engine) {
	api := r.Group("/api")

	UserRoutes(api.Group("/user"))
	JobRoutes(api.Group("/job"))
	ApplicationRoutes(api.Group("/application"))
}
