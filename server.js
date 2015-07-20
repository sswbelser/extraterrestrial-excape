// SERVER NODE.JS

// require express framework and additional modules
var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	_ = require("underscore"),
	mongoose = require("mongoose"),
	cors = require("cors"),
	session = require("express-session"),
	db = require("./models/models"),
	Comment = require("./models/models")

mongoose.connect(
	process.env.MONGOLAB_URI ||
	process.env.MONGOHQ_URL ||
	"mongodb://localhost/game"
);

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

// AJAX functions
app.get("/api/comments", function (req, res) {
	db.Comment.find(function (err, allComments) {
		if (err) {
			console.log("Error: " + err);
			res.status(500).send(err);
		} else {
			res.json(allComments);
		}
	});
});

app.get("/api/comments/:id", function (req, res) {
	var targetId = req.params.id;
	db.Comment.findOne({_id: targetId}, function (err, foundComment) {
		if (err) {
			console.log("Error: " + err);
			res.status(500).send(err);
		} else {
			res.json(foundComment);
		}
	});
});

app.post("/api/comments", function (req, res) {
	var newComment = new db.Comment({
		comment: req.body.comment
	});
	newComment.save(function (err, savedComment) {
		if (err) {
			console.log("Error: " + err);
			res.status(500).send(err);
		} else {
			res.json(savedComment);
		}
	});
});

app.put("/api/comments/:id", function (req, res) {
	var targetId = req.params.id;
	db.Comment.findOne({_id: targetId}, function (err, foundComment) {
		if (err) {
			console.log("Error: " + err);
			res.status(500).send(err);
		} else {
			foundComment.comment = req.body.comment;
			foundComment.save(function (err, savedComment) {
				if (err) {
					console.log("Error: " + err);
					res.status(500).send(err);
				} else {
					res.json(savedComment);
				}
			})
		}
	})
});

app.delete("/api/comments/:id", function (req, res) {
	var targetId = req.params.id;
	db.Comment.findOneAndRemove({_id: targetId}, function (err, deletedComment) {
		if (err) {
			console.log("Error: " + err);
			res.status(500).send(err);
		} else {
			res.json(deletedComment);
		}
	});
});

// Add Mongo Lab to Heroku
app.listen(process.env.PORT || 3000);