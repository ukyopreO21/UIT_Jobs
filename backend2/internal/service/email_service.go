package service

import (
	"fmt"
	"net/smtp"
	"os"
)

func SendApplicationEmail(toEmail string, jobPosition string, jobTitle string, appId string) error {
	from := os.Getenv("SMTP_EMAIL")
	password := os.Getenv("SMTP_PASSWORD")

	if from == "" || password == "" {
		return fmt.Errorf("SMTP config missing")
	}

	subject := "Xác nhận ứng tuyển thành công - " + jobTitle
	body := fmt.Sprintf(
		"Xin chào,\n\n"+
			"Chúc mừng bạn đã ứng tuyển thành công!\n\n"+
			"Thông tin chi tiết hồ sơ của bạn:\n"+
			"- Việc làm: %s\n"+
			"- Vị trí: %s\n"+
			"- Mã hồ sơ: %s\n\n"+
			"Chúng tôi đã nhận được hồ sơ của bạn và sẽ tiến hành xem xét. "+
			"Bộ phận tuyển dụng sẽ liên hệ với bạn trong thời gian sớm nhất.\n\n"+
			"Trân trọng,\n"+
			"Đội ngũ Tuyển dụng",
		jobTitle, jobPosition, appId,
	)

	msg := []byte(
		"From: " + from + "\r\n" +
			"To: " + toEmail + "\r\n" +
			"Subject: " + subject + "\r\n\r\n" +
			body,
	)

	auth := smtp.PlainAuth("", from, password, "smtp.gmail.com")

	return smtp.SendMail(
		"smtp.gmail.com:587",
		auth,
		from,
		[]string{toEmail},
		msg,
	)
}
