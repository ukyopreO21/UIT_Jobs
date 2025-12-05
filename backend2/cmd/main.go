package main

import (
	"database/sql"
	"log"
	"os"
	"time"
	"uitjobs-backend/internal/database"
	"uitjobs-backend/internal/repository"
	"uitjobs-backend/internal/route"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

type Repositories struct {
	UserRepo *repository.UserRepository
}

func initDatabase() *sql.DB {
	if err := database.Connect(); err != nil {
		log.Fatal("Cannot connect DB:", err)
	}
	log.Println("Database connected")
	return database.GetDB()
}

func main() {
	godotenv.Load()
	db := initDatabase()
	repository.InitRepositories(db)

	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5000", "http://192.168.100.57:5000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))
	route.RegisterRoutes(r)

	port := os.Getenv("PORT")
	log.Println("Server running on port:", port)
	r.Run(":" + port)
}
