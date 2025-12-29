package model

import "time"

type Application struct {
	Id                        string  `db:"id" json:"id"`
	JobId                     int     `db:"job_id" json:"job_id" form:"job_id"`
	ApplicantId               string  `db:"applicant_id" json:"applicant_id" form:"applicant_id"`
	ApplicantName             string  `db:"applicant_name" json:"applicant_name" form:"applicant_name"`
	ApplicantDob              string  `db:"applicant_dob" json:"applicant_dob" form:"applicant_dob"`
	ApplicantGender           string  `db:"applicant_gender" json:"applicant_gender" form:"applicant_gender"`
	ApplicantPermanentAddress string  `db:"applicant_permanent_address" json:"applicant_permanent_address" form:"applicant_permanent_address"`
	ApplicantContactAddress   string  `db:"applicant_contact_address" json:"applicant_contact_address" form:"applicant_contact_address"`
	ApplicantPhone            string  `db:"applicant_phone" json:"applicant_phone" form:"applicant_phone"`
	ApplicantEmail            string  `db:"applicant_email" json:"applicant_email" form:"applicant_email"`
	SecondChoicePosition      *string `db:"second_choice_position" json:"second_choice_position" form:"second_choice_position"`
	SecondChoiceFaculty       *string `db:"second_choice_faculty" json:"second_choice_faculty" form:"second_choice_faculty"`
	SecondChoiceDiscipline    *string `db:"second_choice_discipline" json:"second_choice_discipline" form:"second_choice_discipline"`
	ApplicantDegree           string  `db:"applicant_degree" json:"applicant_degree" form:"applicant_degree"`
	ApplicantInstName         string  `db:"applicant_inst_name" json:"applicant_inst_name" form:"applicant_inst_name"`
	ApplicantMajor            string  `db:"applicant_major" json:"applicant_major" form:"applicant_major"`
	ApplicantGradYear         string  `db:"applicant_grad_year" json:"applicant_grad_year" form:"applicant_grad_year"`
	ApplicantGradGrade        string  `db:"applicant_grad_grade" json:"applicant_grad_grade" form:"applicant_grad_grade"`
	ApplicantLangLvl          string  `db:"applicant_lang_lvl" json:"applicant_lang_lvl" form:"applicant_lang_lvl"`
	ApplicantITProfLvl        string  `db:"applicant_it_prof_lvl" json:"applicant_it_prof_lvl" form:"applicant_it_prof_lvl"`
	ApplicantCV               string  `db:"applicant_cv" json:"applicant_cv" form:"-"`
	ApplicantNote             *string `db:"applicant_note" json:"applicant_note" form:"applicant_note"`
	Status                    string  `db:"status" json:"status" form:"status"`
}

type ApplicantionResponse struct {
	Application
	PositionName      string    `db:"position_name" json:"position_name"`
	DepartmentName    string    `db:"department_name" json:"department_name"`
	SubDepartmentName string    `db:"sub_department_name" json:"sub_department_name"`
	SalaryType        string    `db:"salary_type" json:"salary_type"`
	SalaryMin         *int      `db:"salary_min" json:"salary_min"`
	SalaryMax         *int      `db:"salary_max" json:"salary_max"`
	CreatedAt         time.Time `db:"created_at" json:"created_at"`
	UpdatedAt         time.Time `db:"updated_at" json:"updated_at"`
}
