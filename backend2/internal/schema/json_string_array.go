package schema

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
)

type MixedJSONStringArray []any

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

func (a MixedJSONStringArray) Value() (driver.Value, error) {
	if a == nil {
		return nil, nil
	}
	return json.Marshal(a)
}
