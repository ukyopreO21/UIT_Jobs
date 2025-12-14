package util

import (
	"errors"
	"log"
	"uitjobs-backend/internal/model"

	"github.com/gin-gonic/gin"
)

func GetUserTokenPayload(c *gin.Context) (*model.UserClaims, error) {
	userAny, exists := c.Get("user")
	if !exists {
		log.Println("Auth user not found in context")
		return nil, errors.New("không tìm thấy auth user")
	}

	user, ok := userAny.(*model.UserClaims)
	if !ok {
		log.Println("Auth user has invalid type")
		return nil, errors.New("sai kiểu auth user")
	}

	return user, nil
}
