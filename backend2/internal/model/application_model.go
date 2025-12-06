package model

type Application struct {
	Id                        int    `db:"id"`
	JobId                     int    `db:"job_id"`
	ApplicantId               int    `db:"applicant_id"`
	ApplicantName             string `db:"applicant_name"`
	ApplicantDob              string `db:"applicant_dob"`
	ApplicantGender           string `db:"applicant_gender"`
	ApplicantPermanentAddress string `db:"applicant_permanent_address"`
	ApplicantContactAddress   string `db:"applicant_contact_address"`
	ApplicantPhone            string `db:"applicant_phone"`
	ApplicantEmail            string `db:"applicant_email"`
	SecondChoicePosition      string `db:"second_choice_position"`
	SecondChoiceFaculty       string `db:"second_choice_faculty"`
	SecondChoiceDiscipline    string `db:"second_choice_discipline"`
	ApplicantDegree           string `db:"applicant_degree"`
	ApplicantInstName         string `db:"applicant_inst_name"`
	ApplicantMajor            string `db:"applicant_major"`
	ApplicantGradYear         string `db:"applicant_grad_year"`
	ApplicantGradGrade        string `db:"applicant_grad_grade"`
	ApplicantLangLvl          string `db:"applicant_lang_lvl"`
	ApplicantITProfLvl        string `db:"applicant_it_prof_lvl"`
	ApplicantCV               string `db:"applicant_cv"`
	Status                    string `db:"status"`
	CreatedAt                 string `db:"created_at"`
	UpdatedAt                 string `db:"updated_at"`
}
