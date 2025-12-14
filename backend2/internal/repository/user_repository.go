package repository

import (
	"database/sql"
	"uitjobs-backend/internal/model"

	"github.com/jmoiron/sqlx"
)

type UserRepository struct {
	DB *sqlx.DB
}

func NewUserRepository(db *sqlx.DB) *UserRepository {
	return &UserRepository{DB: db}
}

func (r *UserRepository) Create(user *model.User) (sql.Result, error) {
	query := `
        INSERT INTO users (username, email, phone, password, full_name, employer_id)
        VALUES (?, ?, ?, ?, ?, ?)
    `
	return r.DB.Exec(query,
		user.Username,
		user.Email,
		user.Phone,
		user.Password,
		user.FullName,
		user.EmployerId,
	)
}

func (r *UserRepository) FindByUsername(username string) (*model.User, error) {
	query := `
        SELECT *
        FROM users
        WHERE username = ?
    `
	var user model.User
	err := r.DB.Get(&user, query, username)

	if err != nil {
		return nil, err
	}

	return &user, err
}

func (r *UserRepository) UpdateInfo(user *model.User) (sql.Result, error) {
	query := `
        UPDATE users
        SET email = ?, phone = ?, full_name = ?, employer_id = ?
        WHERE username = ?
    `
	return r.DB.Exec(query,
		user.Email,
		user.Phone,
		user.FullName,
		user.EmployerId,
		user.Username,
	)
}

func (r *UserRepository) UpdatePassword(username, hashedPassword string) (sql.Result, error) {
	query := `
        UPDATE users
        SET password = ?
        WHERE username = ?
    `
	return r.DB.Exec(query,
		hashedPassword,
		username,
	)
}
