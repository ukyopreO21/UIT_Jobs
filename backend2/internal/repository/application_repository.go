package repository

import (
	"database/sql"
	"fmt"
	"log"
	"math"
	"reflect"
	"sort"
	"strings"
	"uitjobs-backend/internal/model"

	"github.com/jmoiron/sqlx"
)

type ApplicationRepository struct {
	DB *sqlx.DB
}

func NewApplicationRepository(db *sqlx.DB) *ApplicationRepository {
	return &ApplicationRepository{DB: db}
}

func buildInsertQuery(table string, data interface{}) (string, map[string]any, error) {
	// 1. Lấy Value và Type của data
	val := reflect.ValueOf(data)

	// Nếu là pointer thì lấy giá trị thực mà nó trỏ tới
	if val.Kind() == reflect.Ptr {
		val = val.Elem()
	}

	// Kiểm tra xem data có phải là struct không
	if val.Kind() != reflect.Struct {
		return "", nil, fmt.Errorf("data must be a struct or a pointer to a struct")
	}

	typ := val.Type()
	named := make(map[string]any)
	var cols []string

	// 2. Duyệt qua các field của struct
	for i := 0; i < val.NumField(); i++ {
		field := typ.Field(i)

		// Lấy tag "db"
		dbTag := field.Tag.Get("db")

		// Bỏ qua nếu không có tag, hoặc tag là "-", hoặc field không được export (viết thường)
		if dbTag == "" || dbTag == "-" || !field.IsExported() {
			continue
		}

		// Xử lý trường hợp tag có thêm option (ví dụ: `db:"created_at,omitempty"`)
		dbName := strings.Split(dbTag, ",")[0]

		cols = append(cols, dbName)
		named[dbName] = val.Field(i).Interface()
	}

	if len(cols) == 0 {
		return "", nil, fmt.Errorf("no columns to insert")
	}

	// 3. Sắp xếp cột để đảm bảo thứ tự nhất quán (quan trọng cho testing/caching)
	sort.Strings(cols)

	placeholders := make([]string, 0, len(cols))
	for _, col := range cols {
		placeholders = append(placeholders, ":"+col)
	}

	// 4. Tạo câu query
	query := fmt.Sprintf(
		"INSERT INTO %s (%s) VALUES (%s)",
		table,
		strings.Join(cols, ", "),
		strings.Join(placeholders, ", "),
	)

	return query, named, nil
}

func (r *ApplicationRepository) Create(application *model.Application) (sql.Result, error) {
	query, args, err := buildInsertQuery("applications", application)
	if err != nil {
		return nil, err
	}

	result, err := r.DB.NamedExec(query, args)
	if err != nil {
		return nil, err
	}

	return result, nil
}

func (r *ApplicationRepository) FindById(id string) (*model.ApplicantionResponse, error) {
	query := `SELECT applications.*, jobs.position, jobs.faculty, jobs.discipline
			FROM applications
			INNER JOIN jobs ON applications.job_id = jobs.id
			WHERE applications.id = ?`

	var app model.ApplicantionResponse

	err := r.DB.QueryRowx(query, id).StructScan(&app)
	if err != nil {
		return nil, err
	}

	return &app, nil
}

func (r *ApplicationRepository) GetQuantityPerStatus() (map[string]int, error) {
	query := `
        SELECT status, COUNT(*) AS total
        FROM applications
        GROUP BY status
    `

	rows, err := r.DB.Queryx(query)
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
	query := "SELECT COUNT(*) AS total FROM applications INNER JOIN jobs ON applications.job_id = jobs.id " + whereClause

	var total int
	err = r.DB.QueryRow(query, val...).Scan(&total)
	if err != nil {
		return 0, 0, err
	}

	totalRecords = total
	totalPages = int(math.Ceil(float64(totalRecords) / float64(resultPerPage)))
	return totalRecords, totalPages, nil
}

func (r *ApplicationRepository) FindByFields(fields map[string]any, searchValue string, page int, resultPerPage int) (data []any, pagination map[string]int, quantityPerStatus map[string]int, positions []string, faculties []map[string]any, err error) {
	if page <= 0 {
		page = 1
	}
	if resultPerPage <= 0 {
		resultPerPage = 10
	}
	offset := (page - 1) * resultPerPage

	log.Println("FindByFields - fields:", fields)

	whereClause, values := r.buildWhereClause(fields, searchValue)

	// 3. Lấy dữ liệu jobs
	query := fmt.Sprintf(`
				SELECT applications.*, jobs.position, jobs.faculty, jobs.discipline
				FROM applications
				INNER JOIN jobs ON applications.job_id = jobs.id %s
				ORDER BY applications.created_at DESC LIMIT ? OFFSET ?`, whereClause)
	log.Println("Final query:", query)
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

	// 4. Lấy tổng số records để tính pagination
	countQuery := fmt.Sprintf(`
				SELECT COUNT(*) AS total
            	FROM applications
            	INNER JOIN jobs ON applications.job_id = jobs.id
				%s`, whereClause)
	var total int
	err = r.DB.QueryRow(countQuery, values...).Scan(&total)
	if err != nil {
		return nil, nil, nil, nil, nil, err
	}
	totalPages := int(math.Ceil(float64(total) / float64(resultPerPage)))

	positions, _ = Repos.JobRepo.GetAllPositions()
	faculties, _ = Repos.JobRepo.GetAllFaculties()
	quantityPerStatus, _ = r.GetQuantityPerStatus()

	pagination = map[string]int{
		"currentPage":   page,
		"resultPerPage": resultPerPage,
		"totalRecords":  total,
		"totalPages":    totalPages,
	}

	return data, pagination, quantityPerStatus, positions, faculties, nil
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

func (r *ApplicationRepository) buildWhereClause(fields map[string]any, searchValue string) (string, []any) {
	whereParts := []string{}
	values := []any{}

	// --- Xử lý Positions (Phiên bản đã sửa lỗi cú pháp) ---
	posList := []any{}
	var rawPositions any

	// Ưu tiên kiểm tra key "positions[]" (key thực tế)
	if val, ok := fields["positions[]"]; ok {
		rawPositions = val
	} else if val, ok := fields["positions"]; ok {
		// Hoặc kiểm tra key "positions" (nếu có tiền xử lý)
		rawPositions = val
	}

	if rawPositions != nil {
		// Sử dụng type switch để kiểm tra lần lượt các kiểu dữ liệu
		switch list := rawPositions.(type) {
		case []string:
			// 2. Kiểm tra kiểu slice chuẩn ([]string)
			for _, p := range list {
				if p != "" {
					posList = append(posList, p)
				}
			}

		case string:
			// 3. Kiểm tra kiểu chuỗi đơn (string)
			if list != "" {
				posList = append(posList, list)
			}
		}
	}

	// 3. Xây dựng mệnh đề SQL IN (phần này giữ nguyên)
	if len(posList) > 0 {
		placeholders := strings.TrimSuffix(strings.Repeat("?,", len(posList)), ",")
		whereParts = append(whereParts, fmt.Sprintf("position IN (%s)", placeholders))
		values = append(values, posList...)
	}

	filterGroupParts := []string{}

	// --- 2. Xử lý Filters (Faculty/Disciplines) ---
	// Cần import package common nếu struct FilterGroup được dùng
	if filters, ok := fields["filters"].([]map[string]any); ok {
		for _, filterGroup := range filters {
			groupConditions := []string{}

			// A. Xử lý Faculty (Bắt buộc phải có faculty để tạo nhóm)
			if faculty, ok := filterGroup["faculty"].(string); ok && faculty != "" {
				groupConditions = append(groupConditions, "faculty = ?")
				values = append(values, faculty)
			} else {
				// Nếu không có faculty, bỏ qua nhóm lọc này để tránh lỗi SQL
				continue
			}

			// B. Xử lý Disciplines (Nếu có)
			// Lưu ý: Cần đảm bảo rằng dữ liệu "disciplines" được unflatten thành []any
			if disciplines, ok := filterGroup["disciplines"].([]any); ok && len(disciplines) > 0 {
				// Tạo placeholders cho IN clause: ?, ?, ?
				placeholders := strings.TrimSuffix(strings.Repeat("?,", len(disciplines)), ",")

				// Thêm điều kiện: discipline IN (?,?,?)
				groupConditions = append(groupConditions, fmt.Sprintf("discipline IN (%s)", placeholders))
				values = append(values, disciplines...) // Thêm các giá trị disciplines vào mảng values
			}

			// C. Ghép các điều kiện trong cùng một nhóm (Faculty AND Disciplines)
			if len(groupConditions) > 0 {
				// Ví dụ: (faculty = ? AND discipline IN (...))
				filterGroupParts = append(filterGroupParts, fmt.Sprintf("(%s)", strings.Join(groupConditions, " AND ")))
			}
		}
	}

	if len(filterGroupParts) > 0 {
		// Ví dụ: ((F1 AND D1) OR (F2 AND D2))
		// Thêm toàn bộ khối lọc này vào whereParts chính
		whereParts = append(whereParts, fmt.Sprintf("(%s)", strings.Join(filterGroupParts, " OR ")))
	}

	// --- 3. Xử lý StartDate, EndDate ---
	if start, ok := fields["startDate"].(string); ok && start != "" {
		whereParts = append(whereParts, "deadline >= ?")
		values = append(values, start+" 00:00:00")
	}
	if end, ok := fields["endDate"].(string); ok && end != "" {
		whereParts = append(whereParts, "deadline <= ?")
		values = append(values, end+" 23:59:59")
	}

	// status
	if status, ok := fields["status"].(string); ok && status != "" {
		whereParts = append(whereParts, "applications.status = ?")
		values = append(values, status)
	}

	// --- 4. Xử lý SearchValue ---
	if searchValue != "" {
		// Thêm điều kiện tìm kiếm đa trường
		whereParts = append(whereParts, "(applications.id LIKE ? OR applications.applicant_name LIKE ?)")
		for range 2 { // 2 lần cho 2 placeholder
			values = append(values, "%"+searchValue+"%")
		}
	}

	whereClause := ""
	if len(whereParts) > 0 {
		whereClause = "WHERE " + strings.Join(whereParts, " AND ")
	}

	return whereClause, values
}
