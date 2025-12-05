package model

type User struct {
	Username string `db:"username"`
	Email    string `db:"email"`
	Phone    string `db:"phone"`
	Password string `db:"password"`
	FullName string `db:"full_name"`
}
