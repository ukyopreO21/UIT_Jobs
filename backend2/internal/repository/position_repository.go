package repository

import (
	"database/sql"
	"uitjobs-backend/internal/model"

	"github.com/jmoiron/sqlx"
)

type PositionRepository struct {
	DB *sqlx.DB
}

func NewPositionRepository(db *sqlx.DB) *PositionRepository {
	return &PositionRepository{DB: db}
}

func (r *PositionRepository) Create(position *model.Position) (sql.Result, error) {
	query := `
		INSERT INTO positions (name, employer_id)
		VALUES (?, ?)
	`
	return r.DB.Exec(query,
		position.Name,
		position.EmployerId,
	)
}

func (r *PositionRepository) GetAll(employer_id string) ([]*model.Position, error) {
	query := `SELECT * FROM positions WHERE employer_id = ?`
	rows, err := r.DB.Queryx(query, employer_id)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var positions []*model.Position
	for rows.Next() {
		var position model.Position
		if err := rows.StructScan(&position); err != nil {
			return nil, err
		}
		positions = append(positions, &position)
	}
	return positions, nil
}

func (r *PositionRepository) Update(position *model.Position) (sql.Result, error) {
	query := `
		UPDATE positions
		SET name = ?, employer_id = ?
		WHERE id = ?
	`
	return r.DB.Exec(query,
		position.Name,
		position.EmployerId,
		position.Id,
	)
}

func (r *PositionRepository) Delete(id string) (sql.Result, error) {
	query := `DELETE FROM positions WHERE id = ?`
	return r.DB.Exec(query, id)
}
