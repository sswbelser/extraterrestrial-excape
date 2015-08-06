// Server Node.js

// require express framework and additional modules
var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	_ = require("underscore"),
	mongoose = require("mongoose"),
	cors = require("cors"),
	session = require("express-session"),
	Comment = require("./models/comment"),
	User = require("./models/user"),
	Score = require("./models/score")

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

// set session options
app.use(session({
	saveUninitialized: true,
	resave: true,
	secret: 'NoLookieCookie',
	cookie: { maxAge: 60000 }
}));

// middleware to manage sessions
app.use('/', function (req, res, next) {
	// saves userId in session for logged-in user
	req.login = function (user) {
		req.session.userId = user._id;
	};

	// finds user currently logged in based on `session.userId`
	req.currentUser = function (callback) {
		User.findOne({_id: req.session.userId}, function (err, user) {
			req.user = user;
			callback(null, user);
		});
	};

	// destroy `session.userId` to log out user
	req.logout = function () {
		req.session.userId = null;
		req.user = null;
	};
	next();
});

// show HTML file on main page
app.get("/", function (req, res) {
	res.sendFile(__dirname + "/public/index.html");
});

// AJAX functions for comments
app.get("/api/comments", function (req, res) {
	Comment.find(function (err, allComments) {
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
	Comment.findOne({_id: targetId}, function (err, foundComment) {
		if (err) {
			console.log("Error: " + err);
			res.status(500).send(err);
		} else {
			res.json(foundComment);
		}
	});
});

app.post("/api/comments", function (req, res) {
	var newComment = new Comment({
		username: req.body.username,
		comment: req.body.comment
	});
	newComment.save(function (err, savedComment) {
		if (err) {
			console.log("Error: " + err);
			res.status(500).send(err);
		} else {
			res.json(savedComment);
			User.findOne({_id: req.session.userId}).exec(function (err, foundUser) {
				// add newComment to `comments` array
				foundUser.comments.push(newComment);
				foundUser.save();
			});
		}
	});
});
	
		
// });
	// User.findOne({_id: req.session.userId}).exec(function (err, foundUser) {
	// 	// add newList to `lists` array
	// 	foundUser.comment.push(newComment);
	// 	foundUser.save(function (err, savedComment) {
	// 	});	
	// });
// });

app.put("/api/comments/:id", function (req, res) {
	var targetId = req.params.id;
	Comment.findOne({_id: targetId}, function (err, foundComment) {
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
	Comment.findOneAndRemove({_id: targetId}, function (err, deletedComment) {
		if (err) {
			console.log("Error: " + err);
			res.status(500).send(err);
		} else {
			res.json(deletedComment);
		}
	});
});

// AJAX functions for leaderboard
app.get("/api/scores", function (req, res) {
	Score.find(function (err, allScores) {
		if (err) {
			console.log("Error: " + err);
			res.status(500).send(err);
		} else {
			res.json(allScores);
		}
	});
});

app.get("/api/scores/:id", function (req, res) {
	var targetId = req.params.id;
	Score.findOne({_id: targetId}, function (err, foundScore) {
		if (err) {
			console.log("Error: " + err);
			res.status(500).send(err);
		} else {
			res.json(foundScore);
		}
	});
});

app.post("/api/scores", function (req, res) {
	var newScore = new Score({
		username: req.body.username,
		time: req.body.time
	});
	newScore.save(function (err, savedScore) {
		if (err) {
			console.log("Error: " + err);
			res.status(500).send(err);
		} else {
			res.json(savedScore);
		}
	});
});

// Login Stuff
app.get('/api/current', function (req, res) {
	User.findOne({_id: req.session.userId}).exec(function (err, user) {
		res.json(user);
	});
});

// user submits the signup form
app.post('/api/users', function (req, res) {

	// create new user with secure password
	User.createSecure(req.body.username, req.body.password, function (err, user) {
		req.login(user);
		res.send(user);
	});
});

// user submits the login form
app.post('/login', function (req, res) {

	// call authenticate function to check if password user entered is correct
	User.authenticate(req.body.username, req.body.password, function (err, user) {
		// saves user id to session
		req.login(user);
		res.json(user);
	});
});

// log out user (destroy session)
app.get('/logout', function (req, res) {
	req.logout();
	res.redirect('/');
});

// user submits the login form
app.get('/api/users', function (req, res) {
	User.find(function (err, foundUsers) {
		res.json(foundUsers);
	});
});

app.listen(process.env.PORT || 3000);