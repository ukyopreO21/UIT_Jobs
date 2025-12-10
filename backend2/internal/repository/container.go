// internal/repository/container.go
package repository

import "github.com/jmoiron/sqlx"

var Repos *Repositories

type Repositories struct {
	UserRepo        *UserRepository
	JobRepo         *JobRepository
	ApplicationRepo *ApplicationRepository
}

func InitRepositories(db *sqlx.DB) {
	Repos = &Repositories{
		UserRepo:        NewUserRepository(db),
		JobRepo:         NewJobRepository(db),
		ApplicationRepo: NewApplicationRepository(db),
	}
}
