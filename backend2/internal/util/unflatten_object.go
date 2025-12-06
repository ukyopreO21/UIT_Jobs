package util

import (
	"fmt"
	"regexp"
	"strconv"
)

// Unflatten converts flat map[string]string with keys like "filters[0][faculty]"
// into nested map[string]any
func Unflatten(flat map[string]string) (map[string]any, error) {
	result := make(map[string]any)

	// regex: root[index][prop] optionally [subIndex]
	re := regexp.MustCompile(`(\w+)\[(\d+)\]\[(\w+)\](?:\[(\d+)\])?`)

	for key, val := range flat {
		match := re.FindStringSubmatch(key)
		if match != nil {
			root, idxStr, prop, subIdxStr := match[1], match[2], match[3], match[4]
			idx, err := strconv.Atoi(idxStr)
			if err != nil {
				return nil, fmt.Errorf("invalid index in key %s", key)
			}

			// ensure root is a slice
			slice, ok := result[root].([]map[string]any)
			if !ok {
				slice = []map[string]any{}
			}

			// make sure slice is long enough
			for len(slice) <= idx {
				slice = append(slice, map[string]any{})
			}

			// assign prop
			if subIdxStr != "" {
				subIdx, err := strconv.Atoi(subIdxStr)
				if err != nil {
					return nil, fmt.Errorf("invalid subIndex in key %s", key)
				}
				arr, ok := slice[idx][prop].([]any)
				if !ok {
					arr = []any{}
				}
				for len(arr) <= subIdx {
					arr = append(arr, nil)
				}
				arr[subIdx] = val
				slice[idx][prop] = arr
			} else {
				slice[idx][prop] = val
			}

			result[root] = slice
		} else {
			// flat key without index
			result[key] = val
		}
	}

	return result, nil
}
