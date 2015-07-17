// TESTING JS

var request = require("request"),
	expect = require("chai").expect,
	cheerio = require("cheerio");

var baseUrl = "http://localhost:3000";

describe("Game Title", function() {
	it("should be 'SBelser Platformer'", function() {
		request(baseUrl, function(err, res, body) {
			var $ = cheerio.load(body);
			var title = $("title").text();
			expect(title).to.equal("SBelser Platformer");
			done();
		});
	});
});