package model

type Job struct {
	Id          int     `db:"id" json:"id"`
	Title       string  `db:"title" json:"title"`
	Location    *string `db:"location" json:"location"`
	Faculty     string  `db:"faculty" json:"faculty"`
	Discipline  *string `db:"discipline" json:"discipline"`
	Position    string  `db:"position" json:"position"`
	Description *string `db:"description" json:"description"`
	Quantity    int     `db:"quantity" json:"quantity"`
	Salary      *string `db:"salary" json:"salary"`
	Degree      string  `db:"degree" json:"degree"`
	Deadline    string  `db:"deadline" json:"deadline"`
	CreatedAt   string  `db:"created_at" json:"created_at"`
	UpdatedAt   string  `db:"updated_at" json:"updated_at"`
}
