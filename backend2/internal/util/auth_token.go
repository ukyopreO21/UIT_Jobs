package util

import (
	"errors"
	"fmt"
	"os"
	"time"
	"uitjobs-backend/internal/model"

	"github.com/golang-jwt/jwt/v5"
)

var (
	accessTokenExpires  = time.Hour * 24 * 1  // 1d
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
		switch {
		case errors.Is(err, jwt.ErrTokenExpired):
			return nil, fmt.Errorf("token_expired")
		case errors.Is(err, jwt.ErrTokenSignatureInvalid):
			return nil, fmt.Errorf("invalid_signature")
		default:
			return nil, fmt.Errorf("invalid_token")
		}
	}

	claims, ok := token.Claims.(*model.UserClaims)
	if !ok || !token.Valid {
		return nil, errors.New("invalid_token")
	}

	return claims, nil
}
