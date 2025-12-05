package util

import "golang.org/x/crypto/bcrypt"

const saltRounds = 10

func HashPassword(plain string) (string, error) {
	hashed, err := bcrypt.GenerateFromPassword([]byte(plain), saltRounds)
	if err != nil {
		return "", err
	}
	return string(hashed), nil
}

func ComparePassword(plain, hashed string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hashed), []byte(plain))
	return err == nil
}
