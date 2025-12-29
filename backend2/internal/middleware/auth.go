package middleware

import (
	"net/http"
	"uitjobs-backend/internal/util"

	"github.com/gin-gonic/gin"
)

func RequireAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString, err := c.Cookie("accessToken")
		if err != nil || tokenString == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"error": "access_token_missing",
			})
			return
		}

		claims, err := util.VerifyToken(tokenString)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"error": err.Error(),
			})
			return
		}

		c.Set("user", claims)
		c.Next()
	}
}

func OptionalAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		accessToken, err := c.Cookie("accessToken")
		if err != nil || accessToken == "" {
			_, refreshErr := c.Cookie("refreshToken")
			if refreshErr == nil {
				c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
					"error": "access_token_missing",
				})
				return
			}

			c.Next()
			return
		}

		claims, err := util.VerifyToken(accessToken)
		if err != nil {
			if err.Error() == "token_expired" {
				c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "token_expired"})
				return
			}
			c.Next()
			return
		}

		c.Set("user", claims)
		c.Next()
	}
}
