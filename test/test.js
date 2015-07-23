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

describe('DELETE /api/comments/:id', function() {
  it('should return statusCode 200', function(done) {
    request.del(baseUrl + '/api/comments/' + commentId, function(error, response, body) {
      expect(response.statusCode).to.equal(200);
      done();
    });
  });
});