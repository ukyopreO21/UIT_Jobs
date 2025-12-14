// internal/repository/container.go
package repository

import "github.com/jmoiron/sqlx"

var Repos *Repositories

type Repositories struct {
	UserRepo          *UserRepository
	JobRepo           *JobRepository
	ApplicationRepo   *ApplicationRepository
	DepartmentRepo    *DepartmentRepository
	EmployerRepo      *EmployerRepository
	SubDepartmentRepo *SubDepartmentRepository
	PositionRepo      *PositionRepository
}

func InitRepositories(db *sqlx.DB) {
	Repos = &Repositories{
		UserRepo:          NewUserRepository(db),
		JobRepo:           NewJobRepository(db),
		ApplicationRepo:   NewApplicationRepository(db),
		DepartmentRepo:    NewDepartmentRepository(db),
		EmployerRepo:      NewEmployerRepository(db),
		SubDepartmentRepo: NewSubDepartmentRepository(db),
		PositionRepo:      NewPositionRepository(db),
	}
}
