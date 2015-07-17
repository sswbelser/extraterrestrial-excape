// SERVER NODE.JS

// require express framework and additional modules
var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	_ = require("underscore"),
	mongoose = require("mongoose"),
	cors = require("cors"),
	session = require("express-session"),
	db = require("./models/models");

mongoose.connect(process.env.MONGOLAB_URI || "mongodb://localhost/game");

// serve js and css files from public folder
app.use(express.static(__dirname + "/public"));

// tell app to use bodyParser middleware
app.use(bodyParser.urlencoded({extended: true}));

// Open the API to requests from any domain
app.use(cors());

// show HTML file on main page
app.get("/", function (req, res) {
	res.sendFile(__dirname + "/public/index.html");
});

app.listen(process.env.PORT || 3000);
// Add Mongo Lab to Heroku