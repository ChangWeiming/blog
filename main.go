package main

import (
	"Blog/src/MySQL/starter"
	"Blog/src/httpserver"
	"math/rand"
	"time"
)

func main() {
	rand.Seed(time.Now().UnixNano())
	starter.RunMySQL()
	httpserver.RunServer(8001)
	starter.CloseMySQL()
}
