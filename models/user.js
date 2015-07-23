var mongoose = require("mongoose"),
	Schema = mongoose.Schema,
	bcrypt = require("bcrypt"),
	salt = bcrypt.genSaltSync(10),
	Comment = require("./comment.js")

// define user schema
var UserSchema = new Schema({
	username: String,
	passwordDigest: String,
	comments: [Comment]
});

// create a new user with secure (hashed) password
UserSchema.statics.createSecure = function (username, password, callback) {
	// `this` references our schema
	// store it in variable `that` because `this` changes context in nested callbacks
	var that = this;

	// hash password user enters at sign up
	bcrypt.genSalt(function (err, salt) {
		bcrypt.hash(password, salt, function (err, hash) {

			// create the new user (save to db) with hashed password
			that.create({
				username: username,
				passwordDigest: hash
			}, callback);
		});
	});
};

// authenticate user (when user logs in)
UserSchema.statics.authenticate = function (username, password, callback) {
	// find user by username entered at log in
	this.findOne({username: username}, function (err, user) {

    // throw error if can't find user
		if (user === null) {
			throw new Error("Invalid username or password");

		// if found user, check if password is correct
		} else if (user.checkPassword(password)) {
			callback(null, user);
		}
	});
};

// compare password user enters with hashed password (`passwordDigest`)
UserSchema.methods.checkPassword = function (password) {
	// run hashing algorithm (with salt) on password user enters in order to compare with `passwordDigest`
	return bcrypt.compareSync(password, this.passwordDigest);
};

// define user model
var User = mongoose.model("User", UserSchema);

// export user model
module.exports = User;