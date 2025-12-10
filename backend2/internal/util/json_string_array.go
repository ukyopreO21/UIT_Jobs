package util

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
)

// 1. Tạo kiểu dữ liệu riêng thay vì dùng []string thuần
type MixedJSONStringArray []any

// 2. Hàm Scan: Giúp sqlx hiểu cách đọc từ DB (JSON bytes) -> Go ([]string)
func (a *MixedJSONStringArray) Scan(value any) error {
	if value == nil {
		*a = []any{}
		return nil
	}
	bytes, ok := value.([]byte)
	if !ok {
		return errors.New("type assertion to []byte failed")
	}
	return json.Unmarshal(bytes, &a)
}

// 3. Hàm Value: Giúp sqlx hiểu cách ghi từ Go -> DB (khi bạn INSERT/UPDATE)
func (a MixedJSONStringArray) Value() (driver.Value, error) {
	if a == nil {
		return nil, nil // Lưu NULL hoặc "[]"
	}
	return json.Marshal(a)
}
