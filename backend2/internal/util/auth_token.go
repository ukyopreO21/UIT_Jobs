package util

import (
	"errors"
	"os"
	"time"
	"uitjobs-backend/internal/model"

	"github.com/golang-jwt/jwt/v5"
)

var (
	accessTokenExpires  = time.Hour * 24 * 7  // 7d
	refreshTokenExpires = time.Hour * 24 * 30 // 30d
	secretKey           = []byte(os.Getenv("JWT_SECRET"))
)

func CreateAccessToken(payload *model.UserPayload) (string, error) {
	claims := &model.UserClaims{
		UserPayload: *payload,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(accessTokenExpires)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(secretKey)
}

func CreateRefreshToken(payload *model.UserPayload) (string, error) {
	claims := &model.UserClaims{
		UserPayload: *payload,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(refreshTokenExpires)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(secretKey)
}

func VerifyToken(tokenString string) (*model.UserClaims, error) {
	token, err := jwt.ParseWithClaims(
		tokenString,
		&model.UserClaims{},
		func(token *jwt.Token) (any, error) {
			return secretKey, nil
		},
	)

	if err != nil {
		return nil, err
	}

	claims, ok := token.Claims.(*model.UserClaims)
	if !ok || !token.Valid {
		return nil, errors.New("invalid token")
	}

	return claims, nil
}
