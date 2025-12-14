package util

import (
	"strings"

	"github.com/gin-gonic/gin"
)

func GetFields(c *gin.Context, skipKeys ...string) map[string]any {
	skipMap := make(map[string]bool)
	for _, key := range skipKeys {
		skipMap[key] = true
	}

	fields := make(map[string]any)
	queries := c.Request.URL.Query()

	for key, values := range queries {
		if skipMap[key] {
			continue
		}

		if len(values) == 0 {
			continue
		}

		if strings.HasSuffix(key, "[]") {
			fields[key] = values
			continue
		}

		fields[key] = values[0]
	}

	return fields
}
