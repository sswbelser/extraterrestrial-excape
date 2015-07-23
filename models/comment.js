// Comment.js

var mongoose = require("mongoose"),
	Schema = mongoose.Schema;

var CommentSchema = new Schema({
	username: String,
	comment: String
});

var Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;