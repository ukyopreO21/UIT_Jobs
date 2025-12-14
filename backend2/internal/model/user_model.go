package model

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type User struct {
	Username   string    `db:"username" json:"username"`
	Email      string    `db:"email" json:"email"`
	Phone      *string   `db:"phone" json:"phone"`
	Password   string    `db:"password" json:"password"`
	FullName   *string   `db:"full_name" json:"full_name"`
	EmployerId string    `db:"employer_id" json:"employer_id"`
	CreatedAt  time.Time `db:"created_at" json:"created_at"`
	UpdatedAt  time.Time `db:"updated_at" json:"updated_at"`
}

type UserPayload struct {
	Username   string `json:"username"`
	Email      string `json:"email"`
	EmployerId string `json:"employerId"`
}

type UserClaims struct {
	UserPayload
	jwt.RegisteredClaims
}
