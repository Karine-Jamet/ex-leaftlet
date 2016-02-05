const http = require('http');
var fs = require('fs');
var express = require('express');
var Twitter = require('twitter-node-client').Twitter;
var bodyParser = require('body-parser');
var app = express();
app.use(express.static('./public'));

var html_dir = './public';


app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true
}));


app.post('/', function(req, res) {
  var lat = req.body.lattitude,
    long = req.body.longitude;

  geoTweet(lat, long, res);

});

app.get('/carte', function(req, res) {
  res.sendfile(html_dir + '/carte.html');
});

app.get('/', function(req, res) {

  geoTweet(43, 5.437152200000014, res);

});

app.listen(3000, function() {
  console.log('Example app listening on port 3000!');
});




var geoTweet = function(lat, long, res) {

  var gpsTab = [{
    "lat": lat,
    "long": long
  }, ];
  var tweets = "";

  console.log(lat + " " + long);

  var error = function(err, response, body) {
    console.log('ERROR [%s]', err);
  };
  var success = function(data) {

    tweets = JSON.parse(data);

    for (var item in tweets.statuses) {
      if (tweets.statuses[item].geo) {
        var tweetObj = {
          "name": tweets.statuses[item].user.name,
          "text": tweets.statuses[item].text,
          "gps": tweets.statuses[item].geo.coordinates
        };
        gpsTab.push(tweetObj);

      }
    }
    var outputFilename = './public/tweet.json';
    fs.writeFile(outputFilename, JSON.stringify(gpsTab, null, 4), function(err) {
      if (err) {
        console.log(err);

      } else {
        console.log("JSON saved to " + outputFilename);
        //  console.log(gpsTab);
        //res.sendfile(html_dir + '/carte.html');
        res.redirect("/carte");

      }
    });

  };



  var config = {
    "consumerKey": "fLJ0pSot8zjtCRsGMnnKWwMjj",
    "consumerSecret": "vN8XCiEuXurUvcMZLaHcq09midM9FdwYy0LfEmaByzJeH7TOTT",
    "accessToken": "94043369-fdDv2UqCncrjE36xsVpNbrqV6rehmYtueJ8ephdOn",
    "accessTokenSecret": "Sf6qk76fWY0FR554G1qPAWet5ah5i99pHBcnTMcYNVexj",
    "callBackUrl": "http://NoWebsite.com"
  };

  var twitter = new Twitter(config);

  var coord = lat + ',' + long + ',1000mi';

  twitter.getSearch({
    'q': '',
    'geocode': coord,
    'count': 10
  }, error, success);

  //res.redirect('/carte');

};
