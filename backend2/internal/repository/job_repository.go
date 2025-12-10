package repository

import (
	"database/sql"
	"fmt"
	"log"
	"math"
	"strings"
	"uitjobs-backend/internal/model"

	"github.com/jmoiron/sqlx"
)

type JobRepository struct {
	DB *sqlx.DB
}

func NewJobRepository(db *sqlx.DB) *JobRepository {
	return &JobRepository{DB: db}
}

func (r *JobRepository) Create(job *model.Job) (sql.Result, error) {
	query := `
		INSERT INTO jobs (title, location, faculty, discipline, position, descriptions, quantity, salary, degree, deadline)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`
	return r.DB.Exec(query,
		job.Title,
		job.Location,
		job.Faculty,
		job.Discipline,
		job.Position,
		job.Descriptions,
		job.Quantity,
		job.Salary,
		job.Degree,
		job.Deadline,
	)
}

func (r *JobRepository) FindById(id string) (*model.Job, error) {
	query := `SELECT * FROM jobs WHERE id = ?`
	var job model.Job
	err := r.DB.QueryRowx(query, id).StructScan(&job)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	return &job, err
}

func (r *JobRepository) GetAllFaculties() ([]map[string]any, error) {
	// 1. Vẫn bắt buộc phải có ORDER BY
	query := `SELECT DISTINCT faculty, discipline FROM jobs ORDER BY faculty ASC, discipline ASC`
	rows, err := r.DB.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	// Khởi tạo sẵn để tránh nil slice
	result := []map[string]any{}

	for rows.Next() {
		var faculty, discipline sql.NullString
		if err := rows.Scan(&faculty, &discipline); err != nil {
			return nil, err
		}

		// Lấy giá trị chuỗi
		fName := faculty.String
		dName := discipline.String

		// LOGIC MỚI: Kiểm tra phần tử cuối cùng trong mảng result
		// Nếu mảng rỗng HOẶC tên khoa mới KHÁC tên khoa của phần tử cuối cùng
		if len(result) == 0 || result[len(result)-1]["name"] != fName {
			// -> Tạo khoa mới và thêm vào result
			newFaculty := map[string]any{
				"name":        fName,
				"disciplines": []string{},
			}
			result = append(result, newFaculty)
		}

		// Tới đây thì chắc chắn phần tử cuối cùng (Tail) là khoa hiện tại
		// Lấy khoa cuối cùng ra (đây là tham chiếu đến Map)
		lastFaculty := result[len(result)-1]

		// Thêm ngành vào (nếu ngành hợp lệ)
		if discipline.Valid && dName != "" {
			// Vì Go lưu value trong map là 'any', ta cần ép kiểu về []string để append
			currentDisciplines := lastFaculty["disciplines"].([]string)
			lastFaculty["disciplines"] = append(currentDisciplines, dName)
		}
	}

	return result, rows.Err()
}

func (r *JobRepository) GetAllPositions() ([]string, error) {
	query := `SELECT DISTINCT position FROM jobs ORDER BY position ASC`
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

func (r *JobRepository) FindByFields(fields map[string]any, searchValue string, page int, resultPerPage int) (data []any, pagination map[string]int, positions []string, faculties []map[string]any, err error) {
	if page <= 0 {
		page = 1
	}
	if resultPerPage <= 0 {
		resultPerPage = 10
	}
	offset := (page - 1) * resultPerPage

	whereClause, values := r.buildWhereClause(fields, searchValue)
	log.Println("where:", whereClause)

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

func (r *JobRepository) buildWhereClause(fields map[string]any, searchValue string) (string, []any) {
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
			log.Println("Parsed positions from []string:", posList)

		case string:
			// 3. Kiểm tra kiểu chuỗi đơn (string)
			if list != "" {
				posList = append(posList, list)
			}
			log.Println("Parsed single position string:", posList)
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

	// --- 4. Xử lý SearchValue ---
	if searchValue != "" {
		// Thêm điều kiện tìm kiếm đa trường
		whereParts = append(whereParts, "(id LIKE ? OR title LIKE ? OR position LIKE ? OR faculty LIKE ? OR discipline LIKE ? OR degree LIKE ?)")
		for range 6 { // 6 lần cho 6 placeholder
			values = append(values, "%"+searchValue+"%")
		}
	}

	whereClause := ""
	if len(whereParts) > 0 {
		whereClause = "WHERE " + strings.Join(whereParts, " AND ")
	}

	return whereClause, values
}
