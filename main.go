package main

import (
	// "os"
	"fmt"
	"log"
	"io/ioutil"
	"time"
	"net/http"
	"bytes"
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

type InfoStruct struct {
	Title    string `json:"Title"`
	Year     string `json:"Year"`
	Rated    string `json:"Rated"`
	Released string `json:"Released"`
	Runtime  string `json:"Runtime"`
	Genre    string `json:"Genre"`
	Director string `json:"Director"`
	Writer   string `json:"Writer"`
	Actors   string `json:"Actors"`
	Plot     string `json:"Plot"`
	Language string `json:"Language"`
	Country  string `json:"Country"`
	Awards   string `json:"Awards"`
	Poster   string `json:"Poster"`
	Ratings  []struct {
		Source string `json:"Source"`
		Value  string `json:"Value"`
	} `json:"Ratings"`
	Metascore  string `json:"Metascore"`
	ImdbRating string `json:"imdbRating"`
	ImdbVotes  string `json:"imdbVotes"`
	ImdbID     string `json:"imdbID"`
	Type       string `json:"Type"`
	DVD        string `json:"DVD"`
	BoxOffice  string `json:"BoxOffice"`
	Production string `json:"Production"`
	Website    string `json:"Website"`
	Response   string `json:"Response"`
}

type ErrorStruct struct {
	Response string `json:"Response"`
	Error    string `json:"Error"`
}

type BotPost struct {
	BotID string `json:"bot_id"`
	Text  string `json:"text"`
}

func main(){

	router := mux.NewRouter()
	router.HandleFunc("/callback", callbackFunc).Methods("POST")
	router.HandleFunc("/ping", TestPing).Methods("GET")
 
 	// for local testing 
	port := ":9000" 

	// for Heroku deployment. Heroku assigns port with PORT env var
	// port := ":" + os.Getenv("PORT")

	fmt.Println("Listening on port " + port + "...")
	handler := cors.AllowAll().Handler(router)
	http.ListenAndServe(port,handler)

}

func callbackFunc (w http.ResponseWriter, req *http.Request){

	var response CallbackStruct

	decoder := json.NewDecoder(req.Body)
	decoder.Decode(&response)
	fmt.Println(response.Text)

	// example message to parse
	originaltext := "Moviebot: The Dark Knight"

	if strings.Contains(originaltext, "Moviebot:"){
		
		// Parse message text for movie
		text := originaltext
		text = text[9:]
		text = strings.TrimPrefix(text, " ")
		text = strings.Replace(text, " ", "+", -1)

		// After parsing, do OMDB API call
		var client = &http.Client{
	  		Timeout: time.Second * 30,
		}

		b1, _ := ioutil.ReadFile("apikey.txt")
		apikey := string(b1)
		url := "http://www.omdbapi.com/?apikey=" + apikey + "&t=" + text
		res, err := client.Get(url)
		if err != nil {
			log.Fatal(err)
		}

		info := InfoStruct{}
		json.NewDecoder(res.Body).Decode(&info)

		// Now create response message from OMDB API
		var buffer bytes.Buffer

		length := len(info.Ratings)

		for i, j := range info.Ratings {
			if i != 0 {
				// ratingmsg = append(ratingmsg, " and ")
				buffer.WriteString(" and ")
			}
			if j.Source == "Internet Movie Database" {
				buffer.WriteString("IMDB rating of ")
				buffer.WriteString(j.Value)
			} else {
				buffer.WriteString(j.Source + " rating of ")
				buffer.WriteString(j.Value)
			}

		}

		finalresp := "The " + info.Type + " " + info.Title + " (" + info.Year + "), " + buffer.String()

		// Once message is created, do POST request to Groupme
		var bot BotPost
		bot.Text = finalresp

		b2, _ := ioutil.ReadFile("botID.txt")
		bot.BotID = string(b2)

		b := new(bytes.Buffer)
		json.NewEncoder(b).Encode(bot)
		posturl := "https://api.groupme.com/v3/bots/post"
		postres, err := client.Post(posturl, "application/json", b)
		if err != nil {
			log.Fatal(err)
		}

	} else {
		// don't care
		fmt.Println("Message did not call Moviebot...")	
	}
	w.WriteHeader(200)
	w.Write([]byte("done"))

}

func TestPing(w http.ResponseWriter, req *http.Request){

	fmt.Println("calling test function...")
	w.WriteHeader(200)
	w.Write([]byte("pong"))

}