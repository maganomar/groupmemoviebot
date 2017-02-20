 = require('https');
var cool = require('cool-ascii-faces');
var request = require('request'); 

var rtKey="9dmrtf2sxh82ypntedzra263";
var basertUrl = "http://api.rottentomatoes.com/api/public/v1.0/movies.json?";

var botID = process.env.BOT_ID;


function respond() {
  var request = JSON.parse(this.req.chunks[0]),
      botRegex = /Kareem Youssef/i;
  console.log(request.name);
  if(request.name && botRegex.test(request.name)) {
    this.res.writeHead(200);
    postMessage();
    this.res.end();
  } else {
    console.log("don't care");
    this.res.writeHead(200);
    this.res.end();
  }
}

function movieInfo(movieText) {
  var movieName=movieText.replace(/MovieBot/i, "");
  var rtRating, imdbRate, rtArr, imdbArr;
  rtArr="";
  //var rtReq = new XMLHttpRequest;
  var rtUrl = basertUrl+"apikey="+rtKey+"&q="+movieName;
  console.log(rtUrl);
  // HTTP.get(rtUrl, function(rtArr) {
  //   console.log("requestify");
  //   console.log(response.getBody());
  // });
  // var options= {
  //   host: basertUrl,
  //   path: "apikey="+rtKey+"&q="+movieName
  // };
  // var callback = function(response) {
  //   response.on('data', function (chunk) {
  //     rtArr += chunk;
  //   });

  //   response.on('end', function () {
  //     //console.log(req.data);
  //     console.log(rtArr);
  //     // your code here if you want to use the results !
  //   });
  // }
  request.get(rtUrl, function(error, response, body) {
    console.log(JSON.parse(body));
  });
  //var req = HTTP.request(options, callback).end();
  //var rtArr = JSON.parse(rtReq.responseText);
  console.log(rtUrl+""+rtArr);
  console.log(rtArr.movies);
  rtRating=rtArr.movies.ratings.critics_score;


  //var imdbReq = new XMLHttpRequest;
  var imdbUrl = "http://www.omdbapi.com/?t="+movieName;
  //imdbReq.open("GET", imdbUrl, true);
  //imdbReq.send();
  HTTP.get(imdbUrl, function(imdbArr) {
    var imdbArr=response.getBody();
  });
  //var imdbArr = JSON.parse(imdbReq.responseText);
  imdbRate=imdbArr.imdbRating;
  var response="The movie " +movieText+" has a RT score of "+rtRating+"% and an IMDB rating of "+imdbRate;

  return response;
}

function randomText() {
  var kareemisms = [
    "Yo, how do people live in Indonesia? Aren't there Komodo dragons there?",
    
  ];
  return "#kareemisms: \"" + kareemisms[Math.floor(Math.random() * kareemisms.length)] + "\"";
}



function postMessage() {
  var botResponse, options, body, botReq;

  //botResponse = movieInfo(reqText);
  botResponse=randomText();

  options = {
    hostname: 'api.groupme.com',
    path: '/v3/bots/post',
    method: 'POST'
  };

  body = {
    "bot_id" : botID,
    "text" : botResponse
  };

  console.log('sending ' + botResponse + ' to ' + botID);

  botReq = HTTPS.request(options, function(res) {
      if(res.statusCode == 202) {
        //neat
      } else {
        console.log('rejecting bad status code ' + res.statusCode);
      }
  });

  botReq.on('error', function(err) {
    console.log('error posting message '  + JSON.stringify(err));
  });
  botReq.on('timeout', function(err) {
    console.log('timeout posting message '  + JSON.stringify(err));
  });
  botReq.end(JSON.stringify(body));
}


exports.respond = respond;  
