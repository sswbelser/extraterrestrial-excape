// Models.js

var mongoose = require("mongoose"),
	Schema = mongoose.Schema;

var CommentSchema = new Schema({
	username: String,
	comment: String
});

var ScoreSchema = new Schema({
	username: String,
	time: Number
});

var Comment = mongoose.model("Comment", CommentSchema),
	Score = mongoose.model("Score", ScoreSchema);

module.exports.Comment = Comment;
module.exports.Score = Score;