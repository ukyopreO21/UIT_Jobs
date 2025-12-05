package util

import (
	"maps"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var (
	accessTokenExpires  = time.Hour * 24 * 7  // 7d
	refreshTokenExpires = time.Hour * 24 * 30 // 30d
	secretKey           = []byte(os.Getenv("JWT_SECRET"))
)

// Tạo access token
func CreateAccessToken(payload map[string]any) (string, error) {
	claims := jwt.MapClaims{
		"exp": time.Now().Add(accessTokenExpires).Unix(),
	}

	// copy payload vào claims
	maps.Copy(claims, payload)

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(secretKey)
}

// Tạo refresh token
func CreateRefreshToken(payload map[string]any) (string, error) {
	claims := jwt.MapClaims{
		"exp": time.Now().Add(refreshTokenExpires).Unix(),
	}

	maps.Copy(claims, payload)

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(secretKey)
}

// Verify token
func VerifyToken(tokenStr string) (jwt.MapClaims, error) {
	token, err := jwt.Parse(tokenStr, func(t *jwt.Token) (any, error) {
		return secretKey, nil
	})

	if err != nil {
		return nil, err
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || !token.Valid {
		return nil, jwt.ErrSignatureInvalid
	}

	return claims, nil
}
