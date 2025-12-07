package model

type Job struct {
	Id          int     `db:"id" json:"id"`
	Title       string  `db:"title" json:"title"`
	Location    *string `db:"location" json:"location,omitempty"`
	Faculty     string  `db:"faculty" json:"faculty"`
	Discipline  *string `db:"discipline" json:"discipline,omitempty"`
	Position    string  `db:"position" json:"position"`
	Description *string `db:"description" json:"description,omitempty"`
	Quantity    int     `db:"quantity" json:"quantity"`
	Salary      *string `db:"salary" json:"salary,omitempty"`
	Degree      string  `db:"degree" json:"degree"`
	Deadline    string  `db:"deadline" json:"deadline"`
	CreatedAt   string  `db:"created_at" json:"created_at,omitempty"`
	UpdatedAt   string  `db:"updated_at" json:"updated_at,omitempty"`
}
