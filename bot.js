var HTTPS = require('https');
var cool = require('cool-ascii-faces');
var http        = require('http');
var botID = process.env.BOT_ID;






//-----------


function respond() {
  var request = JSON.parse(this.req.chunks[0]),
      botRegex = /^\/ball stat$/;

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

  var test = "";
  //------------------

  var options = {
    host: 'www.omdbapi.com',
    path: '/?i=tt0468569&plot=full&r=json&tomatoes=true',
    method: 'GET'
  };

  callback = function(response) {
    var str = '';

    //another chunk of data has been recieved, so append it to `str`
    response.on('data', function (chunk) {
      str += chunk;
    });

    //the whole response has been recieved, so we just print it out here
    response.on('end', function () {
      console.log(str);

      test = str;
    });
  }
  http.request(options, callback).end();



  

  // test
  botResponse = test;
  console.log("Test message");
  console.log(test);


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