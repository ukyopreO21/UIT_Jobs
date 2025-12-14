package repository

import (
	"database/sql"
	"fmt"
	"log"
	"math"
	"strconv"
	"strings"
	"uitjobs-backend/internal/model"
	"uitjobs-backend/internal/util"

	"github.com/jmoiron/sqlx"
)

type JobRepository struct {
	DB *sqlx.DB
}

func NewJobRepository(db *sqlx.DB) *JobRepository {
	return &JobRepository{DB: db}
}

func (r *JobRepository) Create(job *model.Job) (sql.Result, error) {
	query := util.InsertStruct(r.DB, "jobs", job, []string{"id"})
	result, err := r.DB.NamedExec(query, job)
	if err != nil {
		log.Println(err)
		return nil, err
	}
	return result, nil
}

func (r *JobRepository) FindById(id int) (*model.JobResponse, error) {
	query := fmt.Sprintf(`%s %s WHERE jobs.id = ?`, r.buildSelectClause(), r.buildFromJoinClause())
	var job model.JobResponse
	err := r.DB.QueryRowx(query, id).StructScan(&job)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	return &job, err
}

func (r *JobRepository) GetPagination(whereClause string, val []any, resultPerPage int) (totalRecords int, totalPages int, err error) {
	query := fmt.Sprintf("SELECT COUNT(*) AS total %s %s", r.buildFromJoinClause(), whereClause)

	var total int
	err = r.DB.QueryRow(query, val...).Scan(&total)
	if err != nil {
		return 0, 0, err
	}

	totalRecords = total
	totalPages = int(math.Ceil(float64(totalRecords) / float64(resultPerPage)))
	return totalRecords, totalPages, nil
}

func (r *JobRepository) FindByFields(employer_id string, fields map[string]any, searchValue string, page int, resultPerPage int) (data []model.JobResponse, pagination map[string]int, positions []*model.Position, subDepartments []*model.SubDepartmentResponse, err error) {
	if page <= 0 {
		page = 1
	}
	if resultPerPage <= 0 {
		resultPerPage = 10
	}
	offset := (page - 1) * resultPerPage

	whereClause, values := r.buildWhereClause(employer_id, fields, searchValue)

	query := fmt.Sprintf(`%s %s %s ORDER BY jobs.id DESC LIMIT ? OFFSET ?`, r.buildSelectClause(), r.buildFromJoinClause(), whereClause)

	valuesWithLimit := append(values, resultPerPage, offset)

	rows, err := r.DB.Queryx(query, valuesWithLimit...)

	if err != nil {
		return nil, nil, nil, nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var job model.JobResponse
		rows.StructScan(&job)
		data = append(data, job)
	}

	total, totalPages, err := r.GetPagination(whereClause, values, resultPerPage)
	if err != nil {
		return nil, nil, nil, nil, err
	}

	if employer_id != "" {
		positions, err = Repos.PositionRepo.GetAll(employer_id)
		if err != nil {
			return nil, nil, nil, nil, err
		}
		subDepartments, err = Repos.SubDepartmentRepo.GetAll(employer_id)
		if err != nil {
			return nil, nil, nil, nil, err
		}
	}

	pagination = map[string]int{
		"currentPage":   page,
		"resultPerPage": resultPerPage,
		"totalRecords":  total,
		"totalPages":    totalPages,
	}

	return data, pagination, positions, subDepartments, nil
}

func (r *JobRepository) UpdateById(id int, fields map[string]any) (sql.Result, error) {
	if id == 0 {
		log.Println("ID là bắt buộc cho lệnh cập nhật")
		return nil, fmt.Errorf("ID là bắt buộc cho lệnh cập nhật")
	}
	if len(fields) == 0 {
		log.Println("Không có trường nào để cập nhật")
		return nil, fmt.Errorf("không có trường nào để cập nhật")
	}

	setParts := []string{}
	vals := []any{}
	for col, v := range fields {
		setParts = append(setParts, fmt.Sprintf("%s = ?", col))
		vals = append(vals, v)
	}

	setClause := strings.Join(setParts, ", ")
	query := fmt.Sprintf("UPDATE jobs SET %s WHERE id = ?", setClause)
	vals = append(vals, id)

	return r.DB.Exec(query, vals...)
}

func (r *JobRepository) DeleteById(id int) (sql.Result, error) {
	if id == 0 {
		return nil, fmt.Errorf("ID là bắt buộc cho lệnh xóa")
	}
	query := "DELETE FROM jobs WHERE id = ?"
	return r.DB.Exec(query, id)
}

func (r *JobRepository) buildWhereClause(employer_id any, fields map[string]any, searchValue string) (string, []any) {
	conditions := []string{}
	args := []any{}

	if employer_id != "" {
		conditions = append(conditions, "employers.id = ?")
		args = append(args, employer_id)
	}

	if v, ok := fields["positions[]"]; ok {
		if rawIds, ok2 := v.([]string); ok2 && len(rawIds) > 0 {

			placeholders := make([]string, len(rawIds))
			for i, raw := range rawIds {
				id, err := strconv.Atoi(raw)
				if err != nil {
					continue
				}
				placeholders[i] = "?"
				args = append(args, id)
			}

			if len(placeholders) > 0 {
				conditions = append(conditions,
					fmt.Sprintf("positions.id IN (%s)", strings.Join(placeholders, ",")),
				)
			}
		}
	}

	if v, ok := fields["subDepartments[]"]; ok {
		if rawIds, ok2 := v.([]string); ok2 && len(rawIds) > 0 {

			placeholders := make([]string, len(rawIds))
			for i, raw := range rawIds {
				id, err := strconv.Atoi(raw)
				if err != nil {
					continue
				}
				placeholders[i] = "?"
				args = append(args, id)
			}

			if len(placeholders) > 0 {
				conditions = append(conditions,
					fmt.Sprintf("sub_departments.id IN (%s)", strings.Join(placeholders, ",")),
				)
			}
		}
	}

	// --- startDate & endDate ---
	if v, ok := fields["startDate"]; ok {
		if dateStr, ok2 := v.(string); ok2 && dateStr != "" {
			conditions = append(conditions, "jobs.deadline >= ?")
			args = append(args, dateStr+" 00:00:00")
		}
	}

	if v, ok := fields["endDate"]; ok {
		if dateStr, ok2 := v.(string); ok2 && dateStr != "" {
			conditions = append(conditions, "jobs.deadline <= ?")
			args = append(args, dateStr+" 23:59:59")
		}
	}

	// --- salary_min ---
	if v, ok := fields["salaryMin"]; ok {
		if val, ok2 := v.(float64); ok2 {
			conditions = append(conditions, "jobs.salary_min >= ?")
			args = append(args, val)
		}
	}

	// --- salary_max ---
	if v, ok := fields["salaryMax"]; ok {
		if val, ok2 := v.(float64); ok2 {
			conditions = append(conditions, "jobs.salary_max <= ?")
			args = append(args, val)
		}
	}

	// --- type ---
	if v, ok := fields["type"]; ok {
		if typeStr, ok2 := v.(string); ok2 && typeStr != "" {
			conditions = append(conditions, "jobs.type = ?")
			args = append(args, typeStr)
		}
	}

	// --- searchValue ---
	if searchValue != "" {
		conditions = append(conditions, "(jobs.id LIKE ? OR jobs.title LIKE ?)")
		like := "%" + searchValue + "%"
		args = append(args, like, like)
	}

	// Build WHERE
	if len(conditions) == 0 {
		return "", args
	}

	whereClause := "WHERE " + strings.Join(conditions, " AND ")
	return whereClause, args
}

func (r *JobRepository) buildSelectClause() string {
	return "SELECT jobs.*, positions.name as position_name, employers.name as employer_name, departments.name as department_name, sub_departments.name as sub_department_name"
}

func (r *JobRepository) buildFromJoinClause() string {
	return `FROM jobs
			INNER JOIN sub_departments ON jobs.sub_department_id = sub_departments.id
			INNER JOIN departments ON sub_departments.department_id = departments.id
			INNER JOIN employers ON departments.employer_id = employers.id
			INNER JOIN positions ON jobs.position_id = positions.id
	`
}
