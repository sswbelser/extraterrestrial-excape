$(function() {

	var commentController = {

		// compile comment template
		template: _.template($('#comment-template').html()),

		all: function() {
			$.get('/api/comments', function(data) {
				var allComments = data;
				// iterate through allComments
				_.each(allComments, function(comment) {
					// pass each comment object through template and append to view
					var $commentHtml = $(commentController.template(comment));
					$('#comment-list').prepend($commentHtml);
				});
				// add event-handlers to comments for updating/deleting
				commentController.addEventHandlers();
			});
		},

		create: function(newComment) {
			var commentData = {comment: newComment};
			// send COMMENT request to server to create new comment
			$.post('/api/comments', commentData, function(data) {
				// pass post object through template and prepend to view
				var $commentHtml = $(commentController.template(data));
				$('#comment-list').prepend($commentHtml);
			});
		},

		update: function(commentId, updatedComment) {
			// send PUT request to server to update comment
			$.ajax({
				type: 'PUT',
				url: '/api/comments/' + commentId,
				data: {
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
				commentController.create(commentText);
				// reset the form
				$(this)[0].reset();
			});
		}
	};

	commentController.setupView();

	// GAME CODE
	var Q = Quintus()
	.include("Sprites, Scenes, Input, 2D, Touch, UI")
	.setup({
		width: 960,
		height: 640,
		development: true
	}).controls().touch();            

	//player
	Q.Sprite.extend("Player",{
		init: function(p) {
			this._super(p, { asset: "player.png", x: 110, y: 50, jumpSpeed: -380});
			this.add('2d, platformerControls');              
		},
		step: function(dt) {
			if(Q.inputs['left'] && this.p.direction == 'right') {
				this.p.flip = 'x';
			} 
			if(Q.inputs['right'] && this.p.direction == 'left') {
				this.p.flip = false;                    
			}
		}                    
	});

	Q.scene("level1",function(stage) {
		var background = new Q.TileLayer({ dataAsset: 'level1.tmx', layerIndex: 0, sheet: 'tiles', tileW: 70, tileH: 70, type: Q.SPRITE_NONE });
		stage.insert(background);
		stage.collisionLayer(new Q.TileLayer({ dataAsset: 'level1.tmx', layerIndex:1,  sheet: 'tiles', tileW: 70, tileH: 70 }));
		var player = stage.insert(new Q.Player());
		stage.add("viewport").follow(player,{x: true, y: true},{minX: 0, maxX: background.p.w, minY: 0, maxY: background.p.h});
	});

	//load assets
	Q.load("tiles_map.png, player.png, level1.tmx", function() {
		Q.sheet("tiles","tiles_map.png", { tilew: 70, tileh: 70});          
		Q.stageScene("level1");
	});
	// END GAME CODE

});