package util

import (
	"errors"
	"uitjobs-backend/internal/model"

	"github.com/gin-gonic/gin"
)

func GetUserTokenPayload(c *gin.Context) (*model.UserClaims, error) {
	userAny, exists := c.Get("user")
	if !exists {
		return nil, errors.New("không tìm thấy auth user")
	}

	user, ok := userAny.(*model.UserClaims)
	if !ok {
		return nil, errors.New("sai kiểu auth user")
	}

	return user, nil
}
