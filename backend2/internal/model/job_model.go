package model

import (
	"time"
	"uitjobs-backend/internal/schema"
)

type Job struct {
	Id              int                          `db:"id" json:"id"`
	Title           string                       `db:"title" json:"title"`
	Type            string                       `db:"type" json:"type"`
	Location        *string                      `db:"location" json:"location"`
	PositionId      int                          `db:"position_id" json:"position_id"`
	Descriptions    *schema.MixedJSONStringArray `db:"descriptions" json:"descriptions"`
	Quantity        int                          `db:"quantity" json:"quantity"`
	Degree          string                       `db:"degree" json:"degree"`
	Deadline        time.Time                    `db:"deadline" json:"deadline"`
	Requirements    *schema.MixedJSONStringArray `db:"requirements" json:"requirements"`
	Benefits        *schema.MixedJSONStringArray `db:"benefits" json:"benefits"`
	SubDepartmentId int                          `db:"sub_department_id" json:"sub_department_id"`
	SalaryMin       *string                      `db:"salary_min" json:"salary_min"`
	SalaryMax       *string                      `db:"salary_max" json:"salary_max"`
	SalaryType      string                       `db:"salary_type" json:"salary_type"`
}

type JobResponse struct {
	Job
	PositionName      string    `db:"position_name" json:"position_name"`
	EmployerName      string    `db:"employer_name" json:"employer_name"`
	DepartmentName    string    `db:"department_name" json:"department_name"`
	SubDepartmentName string    `db:"sub_department_name" json:"sub_department_name"`
	CreatedAt         time.Time `db:"created_at" json:"created_at"`
	UpdatedAt         time.Time `db:"updated_at" json:"updated_at"`
}
