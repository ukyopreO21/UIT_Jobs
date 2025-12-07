package util

import "github.com/gin-gonic/gin"

func GetFields(c *gin.Context, skipKeys ...string) map[string]string {
	// Đánh dấu các key cần bỏ
	skipMap := make(map[string]bool)
	for _, key := range skipKeys {
		skipMap[key] = true
	}

	// Lấy tất cả query params
	queries := c.Request.URL.Query()

	fields := make(map[string]string)

	for key, values := range queries {
		// Bỏ qua nếu nằm trong skip
		if skipMap[key] {
			continue
		}

		if len(values) > 0 {
			fields[key] = values[0] // chỉ lấy giá trị đầu
		}
	}

	return fields
}
