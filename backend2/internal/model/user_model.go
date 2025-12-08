package model

type User struct {
	Username  string  `db:"username" json:"username"`
	Email     string  `db:"email" json:"email"`
	Phone     *string `db:"phone" json:"phone"`
	Password  string  `db:"password" json:"password"`
	FullName  *string `db:"full_name" json:"full_name"`
	CreatedAt string  `db:"created_at" json:"created_at"`
	UpdatedAt string  `db:"updated_at" json:"updated_at"`
}
