require('dotenv').config();
var request = require("request");
var Spotify = require('node-spotify-api');
var fs = require("fs");

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
         
            if (concerts == null || concerts.length == 0) {
                console.log("No scheduled concerts at this time for : " + artist);
            }
            else {
                var time = moment(concerts[0].datetime).format('MMMM Do YYYY');
                var output = "\n\n";
                output += "* Venue : " +concerts[0].venue.name;
                output += "* Location : " +concerts[0].venue.city;
                output += "* Date of Event: " + time;
                output += "\n\n";
                console.log(output);

                // This block of code will write to a file called "log.txt".
                fs.appendFile("log.txt", "Search: " + artist + ": " + output, function(err) {
                    // If the code experiences any errors it will log the error to the console.
                    if (err) {
                    return console.log(err);
                    }
                });
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
        
        var items = data.tracks.items[0];
        var output = "\n\n";
        output += "* Artist: " + items.album.artists[0].name;
        output += "* Song Name: " + items.name;
        output += "* Preview URL: " + items.preview_url;
        output += "* Album Name: " + items.album.name;
        output += "\n\n";
        console.log(output);
        // This block of code will write to a file called "log.txt".
        fs.appendFile("log.txt", "Search: " + songName + ": " + output, function(err) {
            // If the code experiences any errors it will log the error to the console.
            if (err) {
            return console.log(err);
            }
        });
        
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
        var output = "\n\n";
        output += "* Title: " + movie.Title;
        output += "* Year: " + movie.Year;
        output += "* IMDB Rating: " + imdbRating;
        output += "* Rotten Tomatoes Rating: " + rtRating;
        output += "* Country: " + movie.Country;
        output += "* Language: " + movie.Language;
        output += "* Plot: " + movie.Plot;
        output += "* Actors: " + movie.Actors;
        output += "\n\n";
        console.log(output);
        // This block of code will write to a file called "log.txt".
        fs.appendFile("log.txt", "Search: " + movieTitle + ": " + output, function(err) {
            // If the code experiences any errors it will log the error to the console.
            if (err) {
                return console.log(err);
            }
        });
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