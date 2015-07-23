// Score.js

var mongoose = require("mongoose"),
	Schema = mongoose.Schema;

var ScoreSchema = new Schema({
	username: String,
	time: Number
});

var Score = mongoose.model("Score", ScoreSchema);

module.exports = Score;