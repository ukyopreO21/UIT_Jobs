package util

import (
	"reflect"
)

func StructToMap(data interface{}, skipKeys ...string) map[string]any {
	skip := make(map[string]bool)
	for _, v := range skipKeys {
		skip[v] = true
	}

	result := make(map[string]any)

	val := reflect.ValueOf(data)
	if val.Kind() == reflect.Ptr {
		val = val.Elem()
	}

	typ := val.Type()

	for i := 0; i < val.NumField(); i++ {
		field := typ.Field(i)
		dbTag := field.Tag.Get("db")
		if dbTag == "" || dbTag == "-" {
			continue
		}
		if skip[dbTag] {
			continue
		}

		value := val.Field(i).Interface()
		result[dbTag] = value
	}

	return result
}
