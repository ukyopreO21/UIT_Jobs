package model

type Department struct {
	Id         int    `db:"id" json:"id"`
	Name       string `db:"name" json:"name"`
	EmployerId string `db:"employer_id" json:"employer_id"`
}
