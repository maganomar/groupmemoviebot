var HTTPS = require('https');
var cool = require('cool-ascii-faces');
var http        = require('http');
var botID = process.env.BOT_ID;

var testconsole = "";
var test = "";
var finalresponse = "old response";
//------------------


// movie url example:
// http://www.omdbapi.com/?t=Batman+Begins&y=&plot=short&r=json&tomatoes=true

  var options = {
  host: 'www.omdbapi.com',
  path: '/?i=tt0468569&plot=full&r=json&tomatoes=true',
  method: 'GET'
  };

var callback = function(response) {
  var str = '';

  //another chunk of data has been recieved, so append it to `str`
  response.on('data', function (chunk) {
    str += chunk;
  });

  //the whole response has been recieved, so we just print it out here
  response.on('end', function () {
    
    test = str;
    var obj = JSON.parse(str);
    //console.log(obj.Title);
    var tomatoRating = obj.tomatoMeter;
    var imdbRating = obj.imdbRating;
    var movieTitle = obj.Title
    var metacriticRating = obj.Metascore;
    finalresponse = movieTitle + "'s rating on Rotten Tomatoes is " + tomatoRating;
    console.log(test);
    console.log(testconsole);
    //return finalresponse;
    console.log(finalresponse);

  });
}
http.request(options, callback).end();
function movieResponse(){




return finalresponse;


}

//-----------


function respond() {
  var request = JSON.parse(this.req.chunks[0]),
      botRegex = /^\/cool guy$/;
      
      //botRegex = thedarkknight;

//botRegex.test(request.text)) {
  //if (request.text && request.text == "Movie Bot"){

  if(request.text && botRegex.test(request.text)){ 

    this.res.writeHead(200);
    postMessage();
    this.res.end();
  } else {
    console.log("don't care");
    this.res.writeHead(200);
    this.res.end();
  }
}




function postMessage() {
  var botResponse, options, body, botReq;

  // test
  //http.request(options, callback).end();
  botResponse = movieResponse();



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




// ORIGINAL SAMPLE CODE
/*

var HTTPS = require('https');
var cool = require('cool-ascii-faces');

var botID = process.env.BOT_ID;

function respond() {
  var request = JSON.parse(this.req.chunks[0]),
      botRegex = /^\/cool guy$/;

  if(request.text && botRegex.test(request.text)) {
    this.res.writeHead(200);
    postMessage();
    this.res.end();
  } else {
    console.log("don't care");
    this.res.writeHead(200);
    this.res.end();
  }
}

function postMessage() {
  var botResponse, options, body, botReq;

  botResponse = cool();

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

*/