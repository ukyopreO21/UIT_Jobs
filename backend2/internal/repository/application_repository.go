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

type ApplicationRepository struct {
	DB *sqlx.DB
}

func NewApplicationRepository(db *sqlx.DB) *ApplicationRepository {
	return &ApplicationRepository{DB: db}
}

func (r *ApplicationRepository) Create(application *model.Application) (sql.Result, error) {
	query := util.InsertStruct(r.DB, "applications", application, []string{})
	result, err := r.DB.NamedExec(query, application)
	if err != nil {
		return nil, err
	}
	return result, nil
}

func (r *ApplicationRepository) FindById(id string) (*model.ApplicantionResponse, error) {
	query := fmt.Sprintf(`%s %s WHERE applications.id = ?`, r.buildSelectClause(), r.buildFromJoinClause())

	var app model.ApplicantionResponse

	err := r.DB.QueryRowx(query, id).StructScan(&app)
	if err != nil {
		log.Println("Error querying application by ID:", err)
		return nil, err
	}

	return &app, nil
}

func (r *ApplicationRepository) GetQuantityPerStatus(employer_id string) (map[string]int, error) {
	query := fmt.Sprintf(`
        SELECT status, COUNT(*) AS total
        %s
		WHERE departments.employer_id = ?
        GROUP BY status
    `, r.buildFromJoinClause())

	rows, err := r.DB.Queryx(query, employer_id)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	quantityPerStatus := map[string]int{
		"Đã ghi nhận":     0,
		"Đang phỏng vấn":  0,
		"Được tuyển dụng": 0,
		"Bị từ chối":      0,
	}

	for rows.Next() {
		var sc struct {
			Status string `json:"status"`
			Total  int    `json:"total"`
		}
		if err := rows.StructScan(&sc); err != nil {
			return nil, err
		}

		if _, exists := quantityPerStatus[sc.Status]; exists {
			quantityPerStatus[sc.Status] = sc.Total
		}
	}

	return quantityPerStatus, nil
}

func (r *ApplicationRepository) GetPagination(whereClause string, val []any, resultPerPage int) (totalRecords int, totalPages int, err error) {
	query := fmt.Sprintf(`SELECT COUNT(*) AS total %s %s`, r.buildFromJoinClause(), whereClause)

	var total int
	err = r.DB.QueryRow(query, val...).Scan(&total)
	if err != nil {
		return 0, 0, err
	}

	totalRecords = total
	totalPages = int(math.Ceil(float64(totalRecords) / float64(resultPerPage)))
	return totalRecords, totalPages, nil
}

func (r *ApplicationRepository) FindByFields(employer_id string, fields map[string]any, searchValue string, page int, resultPerPage int) (data []any, pagination map[string]int, quantityPerStatus map[string]int, positions []*model.Position, subDepartments []*model.SubDepartmentResponse, err error) {
	if page <= 0 {
		page = 1
	}
	if resultPerPage <= 0 {
		resultPerPage = 10
	}
	offset := (page - 1) * resultPerPage

	whereClause, values := r.buildWhereClause(employer_id, fields, searchValue)

	query := fmt.Sprintf(`%s %s %s ORDER BY applications.created_at DESC LIMIT ? OFFSET ?`, r.buildSelectClause(), r.buildFromJoinClause(), whereClause)

	valuesWithLimit := append(values, resultPerPage, offset)

	rows, err := r.DB.Queryx(query, valuesWithLimit...)

	if err != nil {
		return nil, nil, nil, nil, nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var app model.ApplicantionResponse
		rows.StructScan(&app)
		data = append(data, app)
	}

	positions, err = Repos.PositionRepo.GetAll(employer_id)
	if err != nil {
		return nil, nil, nil, nil, nil, err
	}

	subDepartments, err = Repos.SubDepartmentRepo.GetAll(employer_id)
	if err != nil {
		return nil, nil, nil, nil, nil, err
	}

	total, totalPages, err := r.GetPagination(whereClause, values, resultPerPage)
	if err != nil {
		return nil, nil, nil, nil, nil, err
	}
	quantityPerStatus, _ = r.GetQuantityPerStatus(employer_id)

	pagination = map[string]int{
		"currentPage":   page,
		"resultPerPage": resultPerPage,
		"totalRecords":  total,
		"totalPages":    totalPages,
	}

	return data, pagination, quantityPerStatus, positions, subDepartments, nil
}

func (r *ApplicationRepository) UpdateById(id string, fields map[string]any) (sql.Result, error) {
	if id == "" {
		return nil, fmt.Errorf("ID là bắt buộc cho lệnh cập nhật")
	}
	if len(fields) == 0 {
		return nil, fmt.Errorf("không có trường nào để cập nhật")
	}

	setParts := []string{}
	vals := []any{}
	for col, v := range fields {
		setParts = append(setParts, fmt.Sprintf("%s = ?", col))
		vals = append(vals, v)
	}

	setClause := strings.Join(setParts, ", ")
	query := fmt.Sprintf("UPDATE applications SET %s WHERE id = ?", setClause)
	vals = append(vals, id)

	return r.DB.Exec(query, vals...)
}

func (r *ApplicationRepository) DeleteById(id string) (sql.Result, error) {
	if id == "" {
		return nil, fmt.Errorf("ID là bắt buộc cho lệnh xóa")
	}
	query := "DELETE FROM applications WHERE id = ?"
	return r.DB.Exec(query, id)
}

func (r *ApplicationRepository) buildWhereClause(employer_id any, fields map[string]any, searchValue string) (string, []any) {
	conditions := []string{}
	args := []any{}

	// --- employer_id ---
	if employer_id != "" {
		conditions = append(conditions, "departments.employer_id = ?")
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
			conditions = append(conditions, "applications.created_at >= ?")
			args = append(args, dateStr+" 00:00:00")
		}
	}

	if v, ok := fields["endDate"]; ok {
		if dateStr, ok2 := v.(string); ok2 && dateStr != "" {
			conditions = append(conditions, "applications.created_at <= ?")
			args = append(args, dateStr+" 23:59:59")
		}
	}

	// --- searchValue ---
	if searchValue != "" {
		conditions = append(conditions, "(applications.id LIKE ? OR applications.applicant_name LIKE ?)")
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

func (r *ApplicationRepository) buildSelectClause() string {
	return `SELECT applications.*,
			positions.name as position_name, departments.name as department_name,
			sub_departments.name as sub_department_name, jobs.salary_type as salary_type,
			jobs.salary_min as salary_min, jobs.salary_max as salary_max`
}

func (r *ApplicationRepository) buildFromJoinClause() string {
	return `
			FROM applications
			INNER JOIN jobs ON applications.job_id = jobs.id
			INNER JOIN sub_departments ON jobs.sub_department_id = sub_departments.id
			INNER JOIN departments ON sub_departments.department_id = departments.id
			INNER JOIN positions ON jobs.position_id = positions.id
	`
}
