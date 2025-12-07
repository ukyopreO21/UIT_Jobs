// internal/repository/container.go
package repository

import "github.com/jmoiron/sqlx"

var Repos *Repositories

type Repositories struct {
	UserRepo *UserRepository
	JobRepo  *JobRepository
	// add more repos here
}

func InitRepositories(db *sqlx.DB) {
	Repos = &Repositories{
		UserRepo: NewUserRepository(db),
		JobRepo:  NewJobRepository(db),
	}
}
