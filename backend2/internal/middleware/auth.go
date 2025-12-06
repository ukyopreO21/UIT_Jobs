package middleware

import (
	"net/http"
	"uitjobs-backend/internal/util" // Import package util

	"github.com/gin-gonic/gin"
)

func AdminAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		// 1. Lấy token từ Cookie
		tokenString, err := c.Cookie("accessToken")

		if err != nil || tokenString == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Không tìm thấy token truy cập."})
			c.Abort() // Dừng request, không đi tiếp (tương tự không gọi next())
			return
		}

		// 2. Verify token
		claims, err := util.VerifyToken(tokenString)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Token không hợp lệ hoặc đã hết hạn."})
			c.Abort()
			return
		}

		// 3. Logic check quyền (403)
		// Nếu bạn muốn check role admin cụ thể:
		/*
		   if role, ok := claims["role"]; !ok || role != "admin" {
		        c.JSON(http.StatusForbidden, gin.H{"error": "Bạn không có quyền truy cập tính năng này."})
		        c.Abort()
		        return
		   }
		*/

		// 4. Lưu thông tin user vào context của Gin (tương tự req.user = decoded)
		c.Set("user", claims)

		// 5. Next
		c.Next()
	}
}
