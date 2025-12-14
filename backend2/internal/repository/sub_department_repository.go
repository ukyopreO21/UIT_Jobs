package repository

import (
	"database/sql"
	"uitjobs-backend/internal/model"

	"github.com/jmoiron/sqlx"
)

type SubDepartmentRepository struct {
	DB *sqlx.DB
}

func NewSubDepartmentRepository(db *sqlx.DB) *SubDepartmentRepository {
	return &SubDepartmentRepository{DB: db}
}

func (r *SubDepartmentRepository) Create(subDepartment *model.SubDepartment) (sql.Result, error) {
	query := `
		INSERT INTO sub_departments (name, department_id, is_general)
		VALUES (?, ?, ?)
	`
	return r.DB.Exec(query,
		subDepartment.Name,
		subDepartment.DepartmentId,
		subDepartment.IsGeneral,
	)
}

func (r *SubDepartmentRepository) GetAll(employer_id string) ([]*model.SubDepartmentResponse, error) {
	query := `
		SELECT sub_departments.id, sub_departments.name, department_id, is_general, departments.name as department_name FROM sub_departments
		INNER JOIN departments ON sub_departments.department_id = departments.id
	 	WHERE employer_id = ?
		ORDER BY departments.id, sub_departments.id`
	rows, err := r.DB.Queryx(query, employer_id)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var subDepartments []*model.SubDepartmentResponse
	for rows.Next() {
		var subDepartment model.SubDepartmentResponse
		if err := rows.StructScan(&subDepartment); err != nil {
			return nil, err
		}
		subDepartments = append(subDepartments, &subDepartment)
	}
	return subDepartments, nil
}

func (r *SubDepartmentRepository) Update(subDepartment *model.SubDepartment) (sql.Result, error) {
	query := `
		UPDATE sub_departments
		SET name = ?, department_id = ?, is_general = ?
		WHERE id = ?
	`
	return r.DB.Exec(query,
		subDepartment.Name,
		subDepartment.DepartmentId,
		subDepartment.IsGeneral,
		subDepartment.Id,
	)
}

func (r *SubDepartmentRepository) Delete(id string) (sql.Result, error) {
	query := `DELETE FROM sub_departments WHERE id = ?`
	return r.DB.Exec(query, id)
}
