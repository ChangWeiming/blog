package handlers

import (
	"Blog/src/MySQL/query"
	"Blog/src/MySQL/starter"
	"crypto/md5"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"math/rand"
	"net/http"

	// connect mysql
	_ "github.com/go-sql-driver/mysql"
)

func check(err error) {
	if err != nil {
		fmt.Println(err)
	}
}

type accountState struct {
	Username string `json:"usernameText"`
	Password string `json:"passwordText"`
}

const username string = "123"
const password string = "123"

var rndAcc int64

func getMd5Encode(str string) string {
	dataEncode := []byte(str)
	hashMd5 := md5.Sum(dataEncode)
	return fmt.Sprintf("%x", hashMd5)
}

//LoginAccount handlefunc to deal with logins
func LoginAccount(w http.ResponseWriter, req *http.Request) {

	rnd := rand.Int63n(200000000000)

	if req.Method == "POST" {

		data, _ := ioutil.ReadAll(req.Body)
		user := new(accountState)

		var cookies http.Cookie
		var str string
		if err := json.Unmarshal(data, user); err == nil {

			if user.Username == username && user.Password == password {
				md5Str := getMd5Encode(username + password + fmt.Sprint(rnd))
				rndAcc = rnd

				cookies = http.Cookie{
					Name:  "GAGA",
					Value: md5Str,
					Path:  "/",
				}
				str = "success"
			} else {

				md5Str := getMd5Encode(fmt.Sprint(rnd))
				cookies = http.Cookie{
					Name:  "GAGA",
					Value: md5Str,
					Path:  "/",
				}
				str = "failed"
			}
			fmt.Println(cookies)
			http.SetCookie(w, &cookies)
			w.Write([]byte(str))
		} else {
			w.WriteHeader(400)
		}

	} else {
		w.WriteHeader(403)
	}
}

//IsAccessible handlefunc to authorize users
func IsAccessible(w http.ResponseWriter, req *http.Request) {
	if req.Method == "GET" {

		if len(req.URL.Query()["auth"]) == 0 {
			w.WriteHeader(400)
			return
		}

		md5Str := getMd5Encode(username + password + fmt.Sprint(rndAcc))
		if req.URL.Query()["auth"][0] == md5Str {
			w.Write([]byte("OK!"))
		} else {
			w.Write([]byte("nooooob"))
		}

	} else {
		w.WriteHeader(403)
	}
}

type passageInfo struct {
	SubDate  string `json:"SubDate"`
	Title    string `json:"Title"`
	Abstract string `json:"Abstract"`
	Content  string `json:"Content"`
	ID       int    `json:"PassageID"`
}

//POSTPassageInfo passage information for post requests
type POSTPassageInfo struct {
	passageInfo
	Auth string `json:"CookieVal"`
}

//PassageSubmission submit passage
func PassageSubmission(w http.ResponseWriter, req *http.Request) {
	if req.Method == "POST" {
		data, _ := ioutil.ReadAll(req.Body)

		passage := new(POSTPassageInfo)
		err := json.Unmarshal(data, passage)

		if err != nil {
			fmt.Println(err)
		}

		md5Str := getMd5Encode(username + password + fmt.Sprintf("%d", rndAcc))
		if passage.Auth == md5Str {
			db := starter.GetDB()
			stmt, err := db.Prepare("INSERT INTO passage VALUES(?, ?, ?, ?, ?);")
			if _, err = stmt.Exec(nil, passage.SubDate, passage.Abstract, passage.Content, passage.Title); err == nil {
			} else {
				fmt.Println(err)
				w.WriteHeader(503)
			}
		} else {
			//	fmt.Println("Auth failed")
			w.WriteHeader(503)
		}

	} else {
		w.WriteHeader(403)
	}
}

//UpdatePassage update passage
func UpdatePassage(w http.ResponseWriter, req *http.Request) {
	if req.Method == "POST" {
		data, _ := ioutil.ReadAll(req.Body)

		passage := new(POSTPassageInfo)
		err := json.Unmarshal(data, passage)

		if err != nil {
			fmt.Println("Update: ", err)
		}

		md5Str := getMd5Encode(username + password + fmt.Sprintf("%d", rndAcc))
		if passage.Auth == md5Str {

			db := starter.GetDB()
			stmt, _ := db.Prepare("update passage set abstract=? content=? title=? where passage_id=?")
			if _, err = stmt.Exec(passage.Abstract, passage.Content, passage.Title, passage.ID); err != nil {
				fmt.Println(err)
				w.WriteHeader(403)
			}
			w.Write([]byte("OKK!"))
		} else {
			w.WriteHeader(503)
		}
	} else {
		w.WriteHeader(403)
	}
}

//DeletePassage delete passage
func DeletePassage(w http.ResponseWriter, req *http.Request) {
	if req.Method == "POST" {
		data, _ := ioutil.ReadAll(req.Body)
		passage := new(POSTPassageInfo)
		err := json.Unmarshal(data, passage)

		if err != nil {
			fmt.Println("Delete: ", err)
		}

		md5Str := getMd5Encode(username + password + fmt.Sprintf("%d", rndAcc))
		if passage.Auth == md5Str {
			db := starter.GetDB()
			if _, err := db.Exec("delete from passage where id = " + fmt.Sprintf("%d", passage.ID)); err != nil {
				w.WriteHeader(503)
			}
		} else {
			w.WriteHeader(503)
		}
	} else {
		w.WriteHeader(403)
	}
}

func getPassagesWithSQL(opt string, w http.ResponseWriter, req *http.Request) {
	if req.Method == "GET" {

		db := starter.GetDB()
		//		fmt.Println(opt)
		if queryResult, err := db.Query(opt); err == nil {

			resultMap, err1 := query.GetResult(queryResult)
			queryResult.Close()
			resultJson, err2 := json.Marshal(resultMap)

			if err1 != nil || err2 != nil {
				fmt.Print("InnergetPassageWithSQL")
				w.WriteHeader(503)
			} else {
				w.Write(resultJson)
			}

		} else {
			fmt.Print(err)
			w.WriteHeader(503)
		}
	} else {
		fmt.Print("OutergetPassagesWithSQL")
		w.WriteHeader(403)
	}
}

//GetNewestPassages handlefunc for newest passages
func GetNewestPassages(w http.ResponseWriter, req *http.Request) {
	getPassagesWithSQL("select * from Blog.passage order by publish_date desc limit 3", w, req)
}

//GetAllPassages handlefunc for all passages
func GetAllPassages(w http.ResponseWriter, req *http.Request) {
	getPassagesWithSQL("select * from Blog.passage", w, req)
}

//GetPassageWithPassageID get certain passage with passage ID
func GetPassageWithPassageID(w http.ResponseWriter, req *http.Request) {
	fmt.Println(req.URL.Query())
	str := req.URL.Query()["passage-id"][0]
	getPassagesWithSQL("select * from Blog.passage where passage_id = "+str, w, req)
}
