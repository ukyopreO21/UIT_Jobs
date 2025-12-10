package model

import "uitjobs-backend/internal/util"

type Job struct {
	Id           int                        `db:"id" json:"id"`
	Title        string                     `db:"title" json:"title"`
	Location     *string                    `db:"location" json:"location"`
	Faculty      string                     `db:"faculty" json:"faculty"`
	Discipline   *string                    `db:"discipline" json:"discipline"`
	Position     string                     `db:"position" json:"position"`
	Descriptions *util.MixedJSONStringArray `db:"descriptions" json:"descriptions"`
	Quantity     int                        `db:"quantity" json:"quantity"`
	Salary       *string                    `db:"salary" json:"salary"`
	Degree       string                     `db:"degree" json:"degree"`
	Deadline     string                     `db:"deadline" json:"deadline"`
	CreatedAt    string                     `db:"created_at" json:"created_at"`
	UpdatedAt    string                     `db:"updated_at" json:"updated_at"`
	Requirements *util.MixedJSONStringArray `db:"requirements" json:"requirements"`
	Benefits     *util.MixedJSONStringArray `db:"benefits" json:"benefits"`
}
