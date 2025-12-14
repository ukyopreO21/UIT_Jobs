package util

import (
	"fmt"
	"reflect"
	"strings"

	"github.com/jmoiron/sqlx"
)

func InsertStruct(db *sqlx.DB, table string, data any, ignoredColumns []string) string {
	v := reflect.ValueOf(data)
	if v.Kind() == reflect.Ptr {
		v = v.Elem()
	}
	t := v.Type()

	ignore := map[string]bool{}
	for _, col := range ignoredColumns {
		ignore[col] = true
	}

	columns := []string{}
	params := []string{}
	mapped := map[string]any{}

	for i := 0; i < t.NumField(); i++ {
		field := t.Field(i)
		dbTag := field.Tag.Get("db")

		// Không có tag → bỏ qua
		if dbTag == "" || dbTag == "-" {
			continue
		}

		// Nằm trong list ignore → bỏ qua
		if ignore[dbTag] {
			continue
		}

		columns = append(columns, dbTag)
		params = append(params, ":"+dbTag)

		mapped[dbTag] = v.Field(i).Interface()
	}

	return fmt.Sprintf(`INSERT INTO %s (%s) VALUES (%s) `, table, strings.Join(columns, ","), strings.Join(params, ","))

}
