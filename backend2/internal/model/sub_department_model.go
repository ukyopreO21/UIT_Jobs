package model

type SubDepartment struct {
	Id           int    `db:"id" json:"id"`
	Name         string `db:"name" json:"name"`
	DepartmentId int    `db:"department_id" json:"department_id"`
	IsGeneral    bool   `db:"is_general" json:"is_general"`
}

type SubDepartmentResponse struct {
	SubDepartment
	DepartmentName string `db:"department_name" json:"department_name"`
}
