package repository

import (
	"database/sql"
	"uitjobs-backend/internal/model"

	"github.com/jmoiron/sqlx"
)

type EmployerRepository struct {
	DB *sqlx.DB
}

func NewEmployerRepository(db *sqlx.DB) *EmployerRepository {
	return &EmployerRepository{DB: db}
}

func (r *EmployerRepository) Create(employer *model.Employer) (sql.Result, error) {
	query := `
		INSERT INTO employers (id, name, location)
		VALUES (?, ?, ?)
	`
	return r.DB.Exec(query,
		employer.Id,
		employer.Name,
		employer.Location,
	)
}

func (r *EmployerRepository) FindById(id string) (*model.Employer, error) {
	query := `SELECT * FROM employers WHERE id = ?`
	var employer model.Employer
	err := r.DB.QueryRowx(query, id).StructScan(&employer)
	if err != nil {
		return nil, err
	}
	return &employer, nil
}

func (r *EmployerRepository) GetAll() ([]*model.Employer, error) {
	query := `SELECT * FROM employers`
	rows, err := r.DB.Queryx(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var employers []*model.Employer
	for rows.Next() {
		var employer model.Employer
		if err := rows.StructScan(&employer); err != nil {
			return nil, err
		}
		employers = append(employers, &employer)
	}
	return employers, nil
}

func (r *EmployerRepository) Update(id *model.Employer) (sql.Result, error) {
	query := `
		UPDATE employers
		SET name = ?, location = ?
		WHERE id = ?
	`
	return r.DB.Exec(query,
		id.Name,
		id.Location,
		id.Id,
	)
}

func (r *EmployerRepository) Delete(id string) (sql.Result, error) {
	query := `DELETE FROM employers WHERE id = ?`
	return r.DB.Exec(query, id)
}
