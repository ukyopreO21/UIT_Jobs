package model

type Employer struct {
	Id       int    `db:"id" json:"id"`
	Name     string `db:"name" json:"name"`
	Location string `db:"location" json:"location"`
}
