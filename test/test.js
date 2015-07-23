// TESTING JS

var request = require("request"),
	expect = require("chai").expect,
	cheerio = require("cheerio");

var baseUrl = "http://localhost:3000";
var commentId;

describe("Game Title", function() {
	it("should be 'SBelser Platformer'", function(done) {
		request(baseUrl, function(err, res, body) {
			var $ = cheerio.load(body);
			var title = $("title").text();
			expect(title).to.equal("SBelser Platformer");
			done();
		});
	});
});

describe('GET /', function() {
	it('should return statusCode 200', function(done) {
		request(baseUrl, function(error, response, body) {
			expect(response.statusCode).to.equal(200);
			done();
		});
	});
});

describe('GET /api/comments', function() {
	it('should return statusCode 200', function(done) {
		request(baseUrl + '/api/comments', function(error, response, body) {
			expect(response.statusCode).to.equal(200);
			done();
		});
	});
});

describe('POST /api/comments', function() {
	it('should return statusCode 200', function(done) {
		request.post(
			{
				url: baseUrl + '/api/comments',
				form: {
					username: 'Sabo',
					comment: 'I love it!'
				}
			},
			function(error, response, body) {
				expect(response.statusCode).to.equal(200);
				done();
			}
		);
	});
});

describe('GET /api/users', function() {
	it('should return statusCode 200', function(done) {
		request(baseUrl + '/api/comments', function(error, response, body) {
			expect(response.statusCode).to.equal(200);
			done();
		});
	});
});

describe('POST /api/users', function() {
	it('should return statusCode 200', function(done) {
		request.post(
			{
				url: baseUrl + '/api/comments',
				form: {
					username: 'TestUser',
					password: 'thisisatest'
				}
			},
			function(error, response, body) {
				expect(response.statusCode).to.equal(200);
				done();
			}
		);
	});
});

describe('GET /login', function() {
	it('should return statusCode 200', function(done) {
		request(baseUrl + '/api/comments', function(error, response, body) {
			expect(response.statusCode).to.equal(200);
			done();
		});
	});
});

describe('POST /login', function() {
	it('should return statusCode 200', function(done) {
		request.post(
			{
				url: baseUrl + '/api/comments',
				form: {
					username: 'TestUser',
					password: 'thisisatest'
				}
			},
			function(error, response, body) {
				expect(response.statusCode).to.equal(200);
				done();
			}
		);
	});
});