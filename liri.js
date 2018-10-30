require('dotenv').config();
var request = require("request");
var Spotify = require('node-spotify-api');

var command = process.argv[2];
var searchString = processArgvForQuery(process.argv);

var keys = require('./keys.js');
var moment = require('moment');

switch(command) {
    case "concert-this": concertThis(searchString);
                         break;
    case "spotify-this-song": spotifyThisSong(searchString);
                            break;
    case "movie-this": movieThis(searchString);
                       break;
}


function concertThis(artist) {
    console.log("Concert This: " + artist);
    request("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp", function(error, response, body) {

        // If the request is successful (i.e. if the response status code is 200)
        if (!error && response.statusCode === 200) {
            var concerts = JSON.parse(body); 
            // console.log(concerts);
            // for (var key in concerts) {
            //     var item = concerts[key];
            //     for (var key2 in item) {
            //       console.log(item[key2]);
            //     }
            //   }
            if (concerts == null || concerts.length == 0) {
                console.log("No scheduled concerts at this time for : " + artist);
            }
            else {
            var time = moment(concerts[0].datetime).format('MMMM Do YYYY');
                console.log("\n\n");
                console.log("* Venue : " +concerts[0].venue.name);
                console.log("* Location : " +concerts[0].venue.city);
                console.log("* Date of Event: " + time);
                console.log("\n\n");
            }
        }

    })
}

function spotifyThisSong(songName) {
    console.log("Spotify this: " + songName);
    //var queryString = processArgvForQuery(songName);
    var queryString= songName;
    if (queryString == "") {
        queryString= "The+Sign+Ace+Of+Base";
    }
    var spotify = new Spotify({
        id: process.env.SPOTIFY_ID,
     secret: process.env.SPOTIFY_SECRET
    });
 
    spotify.search({ type: 'track', query: queryString }, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        
        //console.log(data); 
        //console.log(data.tracks.items.length);
        var items = data.tracks.items[0];
        //console.log(JSON.stringify(items, null, 2));
        //for (var i = 0 ; i<items.length;i++) {
            console.log("\n\n");
            console.log("* Artist: " + items.album.artists[0].name);
            console.log("* Song Name: " + items.name);
            console.log("* Preview URL: " + items.preview_url);
            console.log("* Album Name: " + items.album.name);
            console.log("\n\n");
        //}
        
    });
}

function movieThis(movieTitle) {
    console.log("Movie this: " + movieTitle);
    request("http://www.omdbapi.com/?t=" + movieTitle + "&y=&plot=short&apikey=trilogy", function(error, response, body) {

    if (!error && response.statusCode === 200) {
        var movie = JSON.parse(body); 
        var ratings = movie.Ratings;
        var imdbRating = "";
        var rtRating = "";
        for (var i = 0; i < ratings.length; i++) {
            if (ratings[i].Source === "Rotten Tomatoes") {
                rtRating = ratings[i].Value;
            }
            if (ratings[i].Source === "Internet Movie Database") {
                imdbRating = ratings[i].Value;
            }
        }
        console.log("\n\n");
        console.log("* Title: " + movie.Title);
        console.log("* Year: " + movie.Year);
        console.log("* IMDB Rating: " + imdbRating);
        console.log("* Rotten Tomatoes Rating: " + rtRating);
        console.log("* Country: " + movie.Country);
        console.log("* Language: " + movie.Language);
        console.log("* Plot: " + movie.Plot);
        console.log("* Actors: " + movie.Actors);
        console.log("\n\n");
    }
    });
}

function processArgvForQuery(argv) {

    var searchString = "";
    for (var i = 3; i < argv.length; i++){
        
        searchString += argv[i] + "+";
    }
    return searchString.substring(0, searchString.length -1); // trim off the extra + at end
}