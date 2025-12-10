package util

import "github.com/gin-gonic/gin"

// Sửa hàm trả về map[string]any để có thể chứa cả string và []string
func GetFields(c *gin.Context, skipKeys ...string) map[string]any {

	skipMap := make(map[string]bool)
	for _, key := range skipKeys {
		skipMap[key] = true
	}

	queries := c.Request.URL.Query()

	// 💡 Sửa kiểu dữ liệu đầu ra thành map[string]any
	fields := make(map[string]any)

	for key, values := range queries {
		if skipMap[key] {
			continue
		}

		if len(values) > 0 {
			if len(values) > 1 {
				// Nếu có NHIỀU giá trị, lưu trữ toàn bộ slice
				fields[key] = values
			} else {
				// Nếu chỉ có MỘT giá trị, lưu trữ chuỗi đơn
				fields[key] = values[0]
			}
		}
	}

	return fields
}
