package repository

import (
	"database/sql"
	"uitjobs-backend/internal/model"
)

type UserRepository struct {
	DB *sql.DB
}

func NewUserRepository(db *sql.DB) *UserRepository {
	return &UserRepository{DB: db}
}

// CREATE
func (r *UserRepository) Create(user *model.User) (sql.Result, error) {
	query := `
        INSERT INTO users (username, email, phone, password, full_name)
        VALUES (?, ?, ?, ?, ?)
    `
	return r.DB.Exec(query,
		user.Username,
		user.Email,
		user.Phone,
		user.Password,
		user.FullName,
	)
}

// FIND BY USERNAME
func (r *UserRepository) FindByUsername(username string) (*model.User, error) {
	query := `
        SELECT username, email, phone, password, full_name
        FROM users
        WHERE username = ?
    `
	row := r.DB.QueryRow(query, username)

	var user model.User
	err := row.Scan(
		&user.Username,
		&user.Email,
		&user.Phone,
		&user.Password,
		&user.FullName,
	)

	if err == sql.ErrNoRows {
		return nil, nil
	}

	return &user, err
}

// UPDATE INFO
func (r *UserRepository) UpdateInfo(user *model.User) (sql.Result, error) {
	query := `
        UPDATE users
        SET email = ?, phone = ?, full_name = ?
        WHERE username = ?
    `
	return r.DB.Exec(query,
		user.Email,
		user.Phone,
		user.FullName,
		user.Username,
	)
}

// UPDATE PASSWORD
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
