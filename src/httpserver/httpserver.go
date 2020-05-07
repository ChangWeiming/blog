package httpserver

import (
	"Blog/src/handlers"
	"fmt"
	"net/http"
)

//RunServer start server with router
func RunServer(port int) {
	http.HandleFunc("/api/newest-passages", handlers.GetNewestPassages)
	http.HandleFunc("/api/login", handlers.LoginAccount)
	http.HandleFunc("/api/writing", handlers.IsAccessible)
	http.HandleFunc("/api/post-passage", handlers.PassageSubmission)
	http.HandleFunc("/api/delete-passage", handlers.DeletePassage)
	http.HandleFunc("/api/update-passages", handlers.UpdatePassage)
	http.HandleFunc("/api/all-passages", handlers.GetAllPassages)
	http.HandleFunc("/api/passage/", handlers.GetPassageWithPassageID)

	http.ListenAndServe("127.0.0.1:"+fmt.Sprintf("%d", port), nil)
	//	fmt.Println(err)
}
