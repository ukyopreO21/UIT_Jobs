// internal/repository/container.go
package repository

import "database/sql"

var Repos *Repositories

type Repositories struct {
	UserRepo *UserRepository
	// JobRepo  *JobRepository
	// add more repos here
}

func InitRepositories(db *sql.DB) {
	Repos = &Repositories{
		UserRepo: NewUserRepository(db),
		// JobRepo:  NewJobRepository(db),
	}
}
