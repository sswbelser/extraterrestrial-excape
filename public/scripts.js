$(function() {

	var commentController = {

		// compile comment template
		template: _.template($('#comment-template').html()),

		all: function() {
			$.get('/api/comments', function(data) {
				var allComments = data;
				// iterate through allComments
				_.each(allComments, function(username, comment) {
					// pass each comment object through template and append to view
					var $commentHtml = $(commentController.template(username, comment));
					$('#comment-list').prepend($commentHtml);
				});
				// add event-handlers to comments for updating/deleting
				commentController.addEventHandlers();
			});
		},

		create: function(newUsername, newComment) {
			// send COMMENT request to server to create new comment
			$.ajax({
				type: 'POST',
				url: '/api/comments',
				data: {
					username: newUsername,
					comment: newComment
				},
				success: function(data) {
					var $commentHtml = $(commentController.template(data));
					$('#comment-list').prepend($commentHtml);
				}
			})
		},

		update: function(commentId, updatedComment) {
			// send PUT request to server to update comment
			$.ajax({
				type: 'PUT',
				url: '/api/comments/' + commentId,
				data: {
					username: username,
					comment: updatedComment
				},
				success: function(data) {
					// pass comment object through template and append to view
					var $commentHtml = $(commentController.template(data));
					$('#comment-' + commentId).replaceWith($commentHtml);
				}
			});
		},
    
		delete: function(commentId) {
			// send DELETE request to server to delete comment
			$.ajax({
				type: 'DELETE',
				url: '/api/comments/' + commentId,
				success: function(data) {
					// remove deleted comment li from the view
					$('#comment-' + commentId).remove();
				}
			});
		},

		// add event-handlers to comments for updating/deleting
		addEventHandlers: function() {
			$('#comment-list')
			// for update: submit event on `.update-comment` form
			.on('submit', '.update-comment', function(event) {
				event.preventDefault();
				var commentId = $(this).closest('.comment').attr('data-id');
				var updatedComment = $(this).find('.updated-comment').val();
				commentController.update(commentId, updatedComment);
			})
			// for delete: click event on `.delete-comment` button
			.on('click', '.delete-comment', function(event) {
				event.preventDefault();
				var commentId = $(this).closest('.comment').attr('data-id');
				commentController.delete(commentId);
			});
		},

		setupView: function() {
			// append existing posts to view
			commentController.all();
			// add event-handler to new-comment form
			$('#new-comment').on('submit', function(event) {
				event.preventDefault();
				var commentText = $('#comment-text').val();
				var currentUser = $('#login-name').text();
				commentController.create(currentUser, commentText);
				// reset the form
				$(this)[0].reset();
			});
		}
	};

	commentController.setupView();

	// jQuery Validate
	$("#signup-form").validate({
		rules: {
			username: {
				required: true,
				minlength: 2
			},
			password: {
				required: true,
				minlength: 6
			},
			confirm_password: {
				required: true,
				minlength: 6,
				equalTo: "#password"
			}
		},
		messages: {
			username: {
				required: "Please enter a username",
				minlength: "Your username must be at least two characters long"
			},
			password: {
				required: "Please enter a password",
				minlength: "Your password must be at least six characters long"
			},
			confirm_password: {
				required: "Please confirm your password",
				minlength: "Your password must be at least six characters long",
				equalTo: "Please enter the same password as above"
			}
		}
	});

	$("#login-form").validate({
		rules: {
			username: {
				required: true,
				minlength: 2
			},
			password: {
				required: true,
				minlength: 6
			}
		},
		messages: {
			username: {
				required: "Please enter a username",
				minlength: "Your username must be at least two characters long"
			},
			password: {
				required: "Please enter a password",
				minlength: "Your password must be at least six characters long"
			}
		}
	});
	// END jQuery Validate

	// Login/sign up/logout functionality
	var loggedOut = function () {
		$("#login-name").text("");
		$("#signup-login").removeClass("hidden");
		$("#logged-in").addClass("hidden");
		$("#comment-loggedin").addClass("hidden");
		$("#comment-loggedout").removeClass("hidden");
	}

	var loggedIn = function () {
		$("#signup-login").addClass("hidden");
		$("#logged-in").removeClass("hidden");
		$("#comment-loggedin").removeClass("hidden");
		$("#comment-loggedout").addClass("hidden");
	}

	$.ajax({
		url: '/api/current',
		type: "GET",
		success: function (data) {
			if (data) {
				$("#login-name").text(data.username);
				loggedIn();
			} else {
				loggedOut();
			}
		},
		error: function () {
			console.log("Error, could not GET username");
		}
	});

	$("#signup-form").on("submit", function (event) {
		event.preventDefault();
		var newUserObj = {
			username: $("#username-signup").val(),
			password: $("#password").val()
		}
		$("#signup-modal").modal("hide");
		window.location = "";
		$.ajax({
			url: "/api/users",
			type: "POST",
			data: newUserObj,
			success: function (data) {
				$("#login-name").text(data.username);
				loggedIn();
				alert("You have logged in!");
			},
			error: function () {
				console.log("Error, could not post new User!");
			}
		});
	});

	$("#login-form").on('submit', function (event) {
		event.preventDefault();
		var loginUserObj = {
			username: $("#username-login").val(),
			password: $("#password-login").val()
		}
		$("#login-modal").modal("hide");
		window.location = "";
		$.ajax({
			url: '/login',
			type: "POST",
			data: loginUserObj,
			success: function (data) {
				$("#login-name").text(data.username);
				loggedIn();
				alert("You have logged in!");
			},
			error: function () {
				console.log("Error, could not log in");
			}
		});
	});

	$("#logout-button").on('click', function (event) {
		event.preventDefault();
		window.location = "";
		$.ajax({
			url: '/logout',
			type: 'GET',
			success: function (data) {
				loggedOut();
				alert("You have logged out");
			},
			error: function () {
			}
		});
	});
	// END login/sign up/logout functionality

	// Game Code
	var Q = Quintus()
	.include("Sprites, Scenes, Input, 2D, Touch, UI")
	.setup({
		width: 960,
		height: 640,
		development: true
	}).controls().touch();

	//load background tile
	//player
	Q.Sprite.extend("Player", {
		init: function(p) {
			this._super(p, {asset: "player.png", x: 110, y: 50, jumpSpeed: -400, lives: 3, coins: 0});
			this.add("2d, platformerControls"); 
			this.p.timeInvincible = 0;
			// this.on("hit.sprite",function(collision) {
			// 	if(collision.obj.isA("Coin")) {
			// 		collision.obj.destroy();
			// 		this.p.coins++;
			// 		var coinsLabel = Q("UI.Text",1).items[1];
			// 		coinsLabel.p.label = 'Coins: '+this.p.coins;
			// 	}
			// });
			this.on("hit.sprite", function(collison) {
				if(collison.obj.isA("Rocket")) {
					this.destroy();
					Q.stageScene("winGame",1, { label: "You Won!" })
				}
			});
		},
		step: function(dt) {
			if(Q.inputs["left"] && this.p.direction == "right") {
				this.p.flip = "x";
			} 
			if(Q.inputs["right"]  && this.p.direction == "left") {
				this.p.flip = false;                    
			}
			if(this.p.timeInvincible > 0) {
				this.p.timeInvincible = Math.max(this.p.timeInvincible - dt, 0);
			}
		},
		damage: function() {
			//only damage if not in "invincible" mode, otherwise beign next to an enemy takes all the lives inmediatly
			if(!this.p.timeInvincible) {
				this.p.lives--;

				//will be invincible for 1 second
				this.p.timeInvincible = 1;
				if(this.p.lives<0) { 
					this.destroy();
					Q.stageScene("endGame",1, { label: "Game Over" }); 
				}
				else {
				//TODO add an animation to show it's been damaged
				var livesLabel = Q("UI.Text",1).first();
				livesLabel.p.label = "Health: "+this.p.lives;
				}
			}
		}
	});

	//component for common enemy behaviors
	Q.component("commonEnemy", {
		added: function() {
			var entity = this.entity;
			entity.on("bump.left,bump.right,bump.bottom", function(collision) {
				if(collision.obj.isA("Player")) {                        
					collision.obj.damage();
					$(".hit-sound").trigger("play");
				}
			});
			entity.on("bump.top", function(collision) {
				if(collision.obj.isA("Player")) { 
					//make the player jump
					collision.obj.p.vy = -100;
					$(".jump-sound").trigger("play");
					//kill enemy
					this.destroy();
				}
			});
		},
	});

	Q.Sprite.extend("GroundEnemy", {
		init: function(p) {
			this._super(p, {vx: -80, defaultDirection: "left"});
			this.add("2d, aiBounce, commonEnemy");
		},
		step: function(dt) {        
			var dirX = this.p.vx/Math.abs(this.p.vx);
			var ground = Q.stage().locate(this.p.x, this.p.y + this.p.h/2 + 1, Q.SPRITE_DEFAULT);
			var nextTile = Q.stage().locate(this.p.x + dirX * this.p.w/2 + dirX, this.p.y + this.p.h/2 + 1, Q.SPRITE_DEFAULT);

			//if we are on ground and there is a cliff
			if(!nextTile && ground) {
				if(this.p.vx > 0) {
					if(this.p.defaultDirection == "right") {
						this.p.flip = "x";
					}
					else {
						this.p.flip = false;
					}
				}
				else {
					if(this.p.defaultDirection == "left") {
						this.p.flip = "x";
					}
					else {
						this.p.flip = false;
					}
				}
				this.p.vx = -this.p.vx;
			}
		}
	});

	Q.Sprite.extend("VerticalEnemy", {
		init: function(p) {
			this._super(p, {vy: -100, rangeY: 200, gravity: 0 });
			this.add("2d, commonEnemy");
			this.p.initialY = this.p.y;
		},
		step: function(dt) {                
			if(this.p.y - this.p.initialY >= this.p.rangeY && this.p.vy > 0) {
				this.p.vy = -this.p.vy;
			} 
			else if(-this.p.y + this.p.initialY >= this.p.rangeY && this.p.vy < 0) {
				this.p.vy = -this.p.vy;
			}
			else if(this.p.vy == 0) {
				this.p.vy = -100;
			}
		}
	});

	// Q.Sprite.extend("Coin", {
	// 	init: function(p) {
	// 		this._super(p, {asset: "coin.png"});
	// 	}
	// });

	Q.Sprite.extend("Rocket", {
		init: function(p) {
			this._super(p, {asset: "rocket.png"});
		}
	});

	//setup level 1
	Q.scene("level1",function(stage) {
		var background = new Q.TileLayer({dataAsset: "level1.tmx", layerIndex: 0, sheet: "tiles", tileW: 70, tileH: 70, type: Q.SPRITE_NONE });
		stage.insert(background);
		stage.collisionLayer(new Q.TileLayer({dataAsset: "level1.tmx", layerIndex:1,  sheet: "tiles", tileW: 70, tileH: 70, type: Q.SPRITE_DEFAULT }));
		var player = stage.insert(new Q.Player());

		//level assets. format must be as shown: [[ClassName, params], .. ] 
		var levelAssets = [
			["VerticalEnemy", {x: 310, y: 250, rangeY: 100, asset: "ghost.png"}],
			["VerticalEnemy", {x: 450, y: 450, rangeY: 100, asset: "ghost.png"}],
			["VerticalEnemy", {x: 450, y: 120, rangeY: 60, asset: "ghost.png"}],
			["VerticalEnemy", {x: 740, y: 120, rangeY: 100, vy: 100, asset: "ghost.png"}],
			["VerticalEnemy", {x: 800, y: 120, rangeY: 100, asset: "ghost.png"}],
			["VerticalEnemy", {x: 1080, y: 120, rangeY: 90, asset: "ghost.png"}],
			["VerticalEnemy", {x: 1080, y: 500, rangeY: 80, asset: "ghost.png"}],
			["VerticalEnemy", {x: 1360, y: 500, rangeY: 80, vy: 100, asset: "ghost.png"}],
			["VerticalEnemy", {x: 1780, y: 480, rangeY: 100, asset: "ghost.png"}],
			["VerticalEnemy", {x: 1990, y: 250, rangeY: 50, asset: "ghost.png"}],
			["VerticalEnemy", {x: 1680, y: 250, rangeY: 50, asset: "ghost.png"}],
			["VerticalEnemy", {x: 1300, y: 120, rangeY: 100, asset: "ghost.png"}],
			["VerticalEnemy", {x: 2200, y: 100, rangeY: 60, asset: "ghost.png"}],
			["GroundEnemy", {x: 400, y: 600, asset: "snail.png"}],
			["GroundEnemy", {x: 900, y: 120, asset: "snail.png"}],
			["GroundEnemy", {x: 1000, y: 500, asset: "snail.png"}],
			["GroundEnemy", {x: 1500, y: 500, vx: -10, asset: "snail.png"}],
			["GroundEnemy", {x: 1700, y: 500, asset: "snail.png"}],
			["GroundEnemy", {x: 1700, y: 250, vx: -10, asset: "snail.png"}],
			["GroundEnemy", {x: 2200, y: 400, asset: "snail.png"}],
			["GroundEnemy", {x: 2400, y: 350, vx: -10, asset: "snail.png"}],
			["GroundEnemy", {x: 1350, y: 150, vx: -10, asset: "snail.png"}],
			["GroundEnemy", {x: 1700, y: 100, vx: -10, asset: "snail.png"}],
			["GroundEnemy", {x: 2120, y: 100, vx: -10, asset: "snail.png"}],
			["GroundEnemy", {x: 2550, y: 100, vx: -10, asset: "snail.png"}],
			["GroundEnemy", {x: 450, y: 600, asset: "snail.png"}],
			["GroundEnemy", {x: 1000, y: 600, asset: "snail.png"}],
			["GroundEnemy", {x: 2000, y: 600, asset: "snail.png"}],
			["GroundEnemy", {x: 800, y: 500, asset: "snail.png"}],
			// ["Coin", {x: 300, y: 100}],
			// ["Coin", {x: 360, y: 100}],
			// ["Coin", {x: 420, y: 100}],
			// ["Coin", {x: 480, y: 100}],
			// ["Coin", {x: 800, y: 300}],
			// ["Coin", {x: 860, y: 300}],
			// ["Coin", {x: 920, y: 300}],
			// ["Coin", {x: 980, y: 300}],
			// ["Coin", {x: 1040, y: 300}],
			// ["Coin", {x: 1100, y: 300}],
			// ["Coin", {x: 1160, y: 300}],
			// ["Coin", {x: 1250, y: 400}],
			// ["Coin", {x: 1310, y: 400}],
			// ["Coin", {x: 1370, y: 400}],
			["Rocket", {x: 2700, y: 600}]
		];

		//load level assets
		stage.loadAssets(levelAssets); 
		stage.add("viewport").follow(player,{x: true, y: true},{minX: 0, maxX: background.p.w, minY: 0, maxY: background.p.h});
	});

	Q.scene("endGame",function(stage) {
		alert("You Lose!");
		window.location = "";
	});

	Q.scene("winGame",function(stage) {
		$(".fanfare-song").trigger("play");
		$(".main-song").trigger("pause");
		alert("Congrats, you won in " + time + " seconds! Please leave a comment.");
		window.location = "";
	});

	Q.scene("gameStats", function(stage) {
		var statsContainer = stage.insert(new Q.UI.Container({
			fill: "gray",
			x: 960/2,
			y: 620,
			border: 1,
			shadow: 3,
			shadowColor: "rgba(0,0,0,0.5)",
			w: 960,
			h: 40
		}));

		var lives = stage.insert(new Q.UI.Text({ 
			label: "Health: 3",
			color: "white",
			x: -300,
			y: 0
		}),statsContainer);

		// var coins = stage.insert(new Q.UI.Text({ 
		// 	label: "Coins: 0",
		// 	color: "white",
		// 	x: 0,
		// 	y: 0
		// }),statsContainer);

		var timer = stage.insert(new Q.UI.Text({
			label: "Seconds: 1",
			color: "white",
			x: 300,
			y: 0
		}),statsContainer);
	});

	
	var time = setInterval(runFunction,1000);
	function runFunction() {
		time++;
		var timeLabel = Q("UI.Text",1).items[1];
		timeLabel.p.label = 'Seconds: '+time;
	};

	//load assets
	Q.load("tiles_map.png, player.png, snail.png, ghost.png, level1.tmx, coin.png, rocket.png", function() {            
		Q.sheet("tiles","tiles_map.png", { tilew: 70, tileh: 70});          
		Q.stageScene("level1");
		Q.stageScene("gameStats",1);
	});
	// END Game Code

});