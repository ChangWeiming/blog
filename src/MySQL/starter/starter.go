package starter

import (
	"database/sql"
	"fmt"

	//mysql interfaces for query
	_ "github.com/go-sql-driver/mysql"
)

var db *sql.DB

// RunMySQL connect mysql on the server.
func RunMySQL() {
	var err error
	db, err = sql.Open("mysql", "Blog:BlogMySQL@tcp(localhost:3306)/?charset=utf8")
	res, err2 := db.Query("use Blog")

	if err2 != nil {
		fmt.Println(err2)
	} else {
		res.Close()
	}
	if err != nil {
		fmt.Println(err)
	}
}

//GetDB returns db poiter
func GetDB() *sql.DB {
	return db
}

//CloseMySQL close mysql connection
func CloseMySQL() {
	db.Close()
}
