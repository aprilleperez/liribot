// Set up all required npms
require("dotenv").config();

// required key vars
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var axios = require("axios");
var moment = require("moment");
var fs = require("fs");

////////////////////////////////////////////////////////////////////////////


// capture COMMAND user wants to execute
var userCommand = process.argv[2];

// determine what SEARCH is wanted
var userSearch = process.argv.slice(3).join(" "); // for spotifyThisSong
let artist = process.argv.slice(3).join(""); // for concertThis
let artistLog = process.argv.slice(3).join(" ")
var movie = process.argv.slice(3).join("+"); // for movieThis


// determine what command function to call
if (userCommand === "concert-this") {
    concertThis(artist);
} else if (userCommand === "spotify-this-song") {
    spotifyThisSong(userSearch);
} else if (userCommand === "movie-this") {
    movieThis(movie);
} else if (userCommand === "doWhatItSays") {
    doWhatItSays();
} else {
    console.log("Need a valid command");
}




function concertThis(artist) {  // Bands in Town, WILL USE AXIOS
    // if no artist provided, use predefined artist
    if (!artist) {
        artist = "ArianaGrande"
        artistLog = "Ariana Grande"
    }

    // Bands in Town query
    var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

    axios.get(queryURL).then(
        function (response) {
            console.log("\n\r");
            
            // Then we print out the name of venue, venue location, date of event
            var venueLocation = response.data[0].venue.city + ", " + response.data[0].venue.region + " " + response.data[0].venue.country
            console.log(artistLog + " is playing at " + response.data[0].venue.name);
            console.log("The venue is located in " + venueLocation);
            console.log("The show is on " + moment(response.data[0].datetime).format("MM/DD/YYYY"));

            console.log("\n\r");
        }
    ).catch(function (err) {
        console.log("ERROR: ", err)
    });
}



function spotifyThisSong(userSearch) {  // WILL USE SPOTIFY NODE
    // if no userSearch provided, use predefined userSearch
    if (!userSearch) {
        userSearch = "Passionfruit"
    }

    // Bands in Town query
    spotify.search({ type: 'track', query: userSearch, limit: 5 }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        // Because spotify objects is very nested, let tracks = digged down main source 
        let tracks = data.tracks.items

        // loop through each returned track object (limited at 5)
        for (i = 0; i < tracks.length; i++) {
            console.log("\n\r");

            console.log("Result " + (i + 1));
            console.log("-------------");

            // because artist name is nested down further, loop through that object to retrieve artist name
            let artists = tracks[i].artists
            for (j = 0; j < artists.length; j++) {
                let artistName = artists[j].name;
                console.log("Artist Name: " + artistName)
            }

            let song = tracks[i].name
            console.log("Song Name: " + song)

            let preview = tracks[i].preview_url
            if (!preview) {
                console.log("Preview URL: Sorry, there was no preview URL")
            } else {
                console.log("Preview URL: " + preview)
            }

            let album = tracks[i].album.name
            console.log("Album Name: " + album)

            console.log("\n\r");
        }
    });
}



function movieThis(movie) {  // OMDB WILL USE AXIOS
    // if no movie provided, use predefined movie
    if (!movie) {
        movie = "mr+nobody"
    }

    // OMDB query
    var queryURL = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";

    axios.get(queryURL).then(
        function (response) {
            console.log("\n\r");

            // Then we print out the title, year, IMDB rating, rotten tomatoes rating, country produced, language, plot, actors
            console.log("Title: " + response.data.Title);
            console.log("Year Released: " + response.data.Year);
            console.log("IMDB Rating: " + response.data.Ratings[0].Value);
            console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
            console.log("Produced In: " + response.data.Country);
            console.log("Language: " + response.data.Language);
            console.log("Plot: " + response.data.Plot);
            console.log("Actors: " + response.data.Actors);

            console.log("\n\r");
        }
    )
}



function doWhatItSays() {
    // read data from random.txt file
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }

        // when data is read, split the line at the comma, making two items in the array
        var dataArr = data.split(",");

        // determine desired command from 0 index in dataArr
        if (dataArr[0] === "spotify-this-song") {
            // set userSearch to be dataArr[1] then call function
            userSearch = dataArr[1];
            spotifyThisSong(userSearch);
        } 
        else if (dataArr[0] === "movie-this") {
            // set movie to be dataArr[1] then call function
            movie = dataArr[1];
            movieThis(movie);
        } 
        else if (dataArr[0] === "concert-this") {
            // set artist & artistLog to be dataArr[1] then call function
            artist = dataArr[1];
            artistLog = dataArr[1];
            concertThis(artist);
        }

    });

}


// FOR RANDOM.TXT 
// spotify-this-song,"I Want it That Way"
// concert-this,Kali Uchis
// movie-this,"Captain Marvel"

