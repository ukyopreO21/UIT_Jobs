package repository

import (
	"database/sql"
	"uitjobs-backend/internal/model"

	"github.com/jmoiron/sqlx"
)

type DepartmentRepository struct {
	DB *sqlx.DB
}

func NewDepartmentRepository(db *sqlx.DB) *DepartmentRepository {
	return &DepartmentRepository{DB: db}
}

func (r *DepartmentRepository) Create(department *model.Department) (sql.Result, error) {
	query := `
		INSERT INTO departments (name, employer_id)
		VALUES (?, ?)
	`
	return r.DB.Exec(query,
		department.Name,
		department.EmployerId,
	)
}

func (r *DepartmentRepository) GetAll(employer_id string) ([]*model.Department, error) {
	query := `SELECT * FROM departments WHERE employer_id = ?`
	rows, err := r.DB.Queryx(query, employer_id)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var departments []*model.Department
	for rows.Next() {
		var department model.Department
		if err := rows.StructScan(&department); err != nil {
			return nil, err
		}
		departments = append(departments, &department)
	}
	return departments, nil
}

func (r *DepartmentRepository) Update(department *model.Department) (sql.Result, error) {
	query := `
		UPDATE departments
		SET name = ?, employer_id = ?
		WHERE id = ?
	`
	return r.DB.Exec(query,
		department.Name,
		department.EmployerId,
		department.Id,
	)
}

func (r *DepartmentRepository) Delete(id string) (sql.Result, error) {
	query := `DELETE FROM departments WHERE id = ?`
	return r.DB.Exec(query, id)
}
