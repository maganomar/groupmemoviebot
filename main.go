package main

import (
	"fmt"
	"log"
	"net/http"
	"strings"
	"encoding/json"
	"github.com/rs/cors"
	"github.com/gorilla/mux"
)

type CallbackStruct struct {
	Attachments []interface{} `json:"attachments"`
	AvatarURL   string        `json:"avatar_url"`
	CreatedAt   int           `json:"created_at"`
	GroupID     string        `json:"group_id"`
	ID          string        `json:"id"`
	Name        string        `json:"name"`
	SenderID    string        `json:"sender_id"`
	SenderType  string        `json:"sender_type"`
	SourceGUID  string        `json:"source_guid"`
	System      bool          `json:"system"`
	Text        string        `json:"text"`
	UserID      string        `json:"user_id"`
}

func main(){

	os.Setenv("PORT", "9000")
	router := mux.NewRouter()
	router.HandleFunc("/callback", callbackFunc).Methods("POST")
	router.HandleFunc("/test", testFunc).Methods("POST")

	port := ":9000"
	fmt.Println("Listening....")
	handler := cors.AllowAll().Handler(router)
	log.Fatal(http.ListenAndServe(port,handler))

}

func callbackFunc (w http.ResponseWriter, req *http.Request){
	// fmt.Println(req.Body)
	var response CallbackStruct

	decoder := json.NewDecoder(req.Body)
	decoder.Decode(&response)
	fmt.Println(response)
	fmt.Println(response.Text)

	if strings.Contains(response.Text, "MovieBot"){
		// Call Movie API here
	} else {
		// don't care	
	}
	w.WriteHeader(200)
	w.Write([]byte("hello"))

}

func testFunc (w http.ResponseWriter, req *http.Request){

	fmt.Println("calling test func...")
	w.WriteHeader(200)
	w.Write([]byte("hello"))

}