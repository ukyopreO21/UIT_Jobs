package repository

import (
	"database/sql"
	"fmt"
	"math"
	"strings"
	"time"
	"uitjobs-backend/internal/model"
	"uitjobs-backend/internal/util"

	"github.com/jmoiron/sqlx"
)

type FilterGroup struct {
	Faculty     string
	Disciplines []string
}

type SearchFields struct {
	Positions []string
	Filters   []FilterGroup
	StartDate *time.Time
	EndDate   *time.Time
}

type FindByFieldsResult struct {
	Data       []model.Job
	Pagination Pagination
	Positions  []string
	Faculties  []string
}

type Pagination struct {
	CurrentPage   int
	ResultPerPage int
	TotalRecords  int
	TotalPages    int
}

type JobRepository struct {
	DB *sqlx.DB
}

func NewJobRepository(db *sqlx.DB) *JobRepository {
	return &JobRepository{DB: db}
}

func (r *JobRepository) Create(job *model.Job) (sql.Result, error) {
	query := `
		INSERT INTO jobs (title, location, faculty, discipline, position, description, quantity, salary, degree, deadline)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`
	return r.DB.Exec(query,
		job.Title,
		job.Location,
		job.Faculty,
		job.Discipline,
		job.Position,
		job.Description,
		job.Quantity,
		job.Salary,
		job.Degree,
		job.Deadline,
	)
}

func (r *JobRepository) FindByID(id string) (*model.Job, error) {
	query := `SELECT * FROM jobs WHERE id = ?`
	row := r.DB.QueryRow(query, id)
	var job model.Job
	err := row.Scan(
		&job.Id,
		&job.Title,
		&job.Location,
		&job.Faculty,
		&job.Discipline,
		&job.Position,
		&job.Description,
		&job.Quantity,
		&job.Salary,
		&job.Degree,
		&job.Deadline,
	)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	return &job, err
}

func (r *JobRepository) GetAllFaculties() ([]map[string]any, error) {
	query := `SELECT DISTINCT faculty, discipline FROM jobs ORDER BY faculty`
	rows, err := r.DB.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	facultyMap := make(map[string]map[string]bool)

	for rows.Next() {
		var faculty, discipline sql.NullString
		if err := rows.Scan(&faculty, &discipline); err != nil {
			return nil, err
		}

		if faculty.Valid {
			if _, exists := facultyMap[faculty.String]; !exists {
				facultyMap[faculty.String] = make(map[string]bool)
			}
			if discipline.Valid && discipline.String != "" {
				facultyMap[faculty.String][discipline.String] = true
			}
		}
	}

	var result []map[string]any
	for name, disciplines := range facultyMap {
		discList := make([]string, 0, len(disciplines))
		for disc := range disciplines {
			discList = append(discList, disc)
		}
		result = append(result, map[string]any{
			"name":        name,
			"disciplines": discList,
		})
	}

	return result, rows.Err()
}

func (r *JobRepository) GetAllPositions() ([]string, error) {
	query := `SELECT DISTINCT position FROM jobs ORDER BY position`
	rows, err := r.DB.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var positions []string
	for rows.Next() {
		var position sql.NullString
		if err := rows.Scan(&position); err != nil {
			return nil, err
		}
		if position.Valid {
			positions = append(positions, position.String)
		}
	}
	return positions, rows.Err()
}

func (r *JobRepository) GetPagination(whereClause string, val []any, resultPerPage int) (totalRecords int, totalPages int, err error) {
	query := "SELECT COUNT(*) AS total FROM jobs " + whereClause

	var total int
	err = r.DB.QueryRow(query, val...).Scan(&total)
	if err != nil {
		return 0, 0, err
	}

	totalRecords = total
	totalPages = int(math.Ceil(float64(totalRecords) / float64(resultPerPage)))
	return totalRecords, totalPages, nil
}

func (r *JobRepository) FindByFields(fields map[string]string, searchValue string, page int, resultPerPage int) (data []any, pagination map[string]int, positions []string, faculties []map[string]any, err error) {
	if page <= 0 {
		page = 1
	}
	if resultPerPage <= 0 {
		resultPerPage = 10
	}
	offset := (page - 1) * resultPerPage

	// 1. Unflatten input
	structuredFields, err := util.Unflatten(fields)
	if err != nil {
		return nil, nil, nil, nil, err
	}

	// 2. Build WHERE clause dynamically
	whereParts := []string{}
	values := []any{}

	// example xử lý positions
	if posSlice, ok := structuredFields["positions"].([]map[string]any); ok {
		posList := []any{}
		for _, v := range posSlice {
			if p, ok := v["0"].(string); ok && p != "" {
				posList = append(posList, p)
			}
		}
		if len(posList) > 0 {
			placeholders := strings.Repeat("?,", len(posList))
			placeholders = placeholders[:len(placeholders)-1]
			whereParts = append(whereParts, fmt.Sprintf("position IN (%s)", placeholders))
			values = append(values, posList...)
		}
	}

	// xử lý startDate, endDate
	if start, ok := structuredFields["startDate"].(string); ok && start != "" {
		whereParts = append(whereParts, "deadline >= ?")
		values = append(values, start+" 00:00:00")
	}
	if end, ok := structuredFields["endDate"].(string); ok && end != "" {
		whereParts = append(whereParts, "deadline <= ?")
		values = append(values, end+" 23:59:59")
	}

	// searchValue
	if searchValue != "" {
		whereParts = append(whereParts, "(id LIKE ? OR position LIKE ? OR faculty LIKE ? OR discipline LIKE ? OR degree LIKE ?)")
		for range 5 {
			values = append(values, "%"+searchValue+"%")
		}
	}

	whereClause := ""
	if len(whereParts) > 0 {
		whereClause = "WHERE " + strings.Join(whereParts, " AND ")
	}

	// 3. Lấy dữ liệu jobs
	query := fmt.Sprintf("SELECT * FROM jobs %s ORDER BY id DESC LIMIT ? OFFSET ?", whereClause)
	valuesWithLimit := append(values, resultPerPage, offset)

	rows, err := r.DB.Queryx(query, valuesWithLimit...)
	if err != nil {
		return nil, nil, nil, nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var job model.Job
		rows.StructScan(&job)
		data = append(data, job)
	}

	// 4. Lấy tổng số records để tính pagination
	countQuery := fmt.Sprintf("SELECT COUNT(*) FROM jobs %s", whereClause)
	var total int
	err = r.DB.QueryRow(countQuery, values...).Scan(&total)
	if err != nil {
		return nil, nil, nil, nil, err
	}
	totalPages := int(math.Ceil(float64(total) / float64(resultPerPage)))

	// 5. Lấy tất cả positions & faculties (distinct)
	positions, _ = r.GetAllPositions()
	faculties, _ = r.GetAllFaculties()

	pagination = map[string]int{
		"currentPage":   page,
		"resultPerPage": resultPerPage,
		"totalRecords":  total,
		"totalPages":    totalPages,
	}

	return data, pagination, positions, faculties, nil
}

func (r *JobRepository) UpdateById(id int, fields map[string]string) (sql.Result, error) {
	if id == 0 {
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

func BuildWhereClause(fields SearchFields, searchValue string) (string, []any) {
	var whereParts []string
	var values []any

	// positions[]
	if len(fields.Positions) > 0 {
		placeholders := strings.Repeat("?,", len(fields.Positions))
		placeholders = strings.TrimRight(placeholders, ",")
		whereParts = append(whereParts, fmt.Sprintf("position IN (%s)", placeholders))
		for _, p := range fields.Positions {
			values = append(values, p)
		}
	}

	// filters (faculty + disciplines)
	if len(fields.Filters) > 0 {
		var filterGroups []string
		for _, group := range fields.Filters {
			if len(group.Disciplines) > 0 {
				placeholders := strings.Repeat("?,", len(group.Disciplines))
				placeholders = strings.TrimRight(placeholders, ",")
				filterGroups = append(filterGroups, fmt.Sprintf("(faculty = ? AND discipline IN (%s))", placeholders))
				values = append(values, group.Faculty)
				for _, d := range group.Disciplines {
					values = append(values, d)
				}
			} else {
				filterGroups = append(filterGroups, "(faculty = ?)")
				values = append(values, group.Faculty)
			}
		}
		if len(filterGroups) > 0 {
			whereParts = append(whereParts, "("+strings.Join(filterGroups, " OR ")+")")
		}
	}

	// startDate, endDate
	if fields.StartDate != nil && fields.EndDate != nil {
		whereParts = append(whereParts, "deadline BETWEEN ? AND ?")
		startStr := fields.StartDate.Format("2006-01-02 15:04:05")
		endStr := fields.EndDate.Format("2006-01-02 15:04:05")
		values = append(values, startStr, endStr)
	} else if fields.StartDate != nil {
		whereParts = append(whereParts, "deadline >= ?")
		values = append(values, fields.StartDate.Format("2006-01-02 15:04:05"))
	} else if fields.EndDate != nil {
		whereParts = append(whereParts, "deadline <= ?")
		values = append(values, fields.EndDate.Format("2006-01-02 15:04:05"))
	}

	// searchValue
	if searchValue != "" {
		whereParts = append(whereParts, "(id LIKE ? OR position LIKE ? OR faculty LIKE ? OR discipline LIKE ? OR degree LIKE ?)")
		for range 5 {
			values = append(values, "%"+searchValue+"%")
		}
	}

	whereClause := ""
	if len(whereParts) > 0 {
		whereClause = "WHERE " + strings.Join(whereParts, " AND ")
	}

	return whereClause, values
}
