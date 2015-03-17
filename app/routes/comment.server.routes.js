'use strict';

module.exports = function(app) {
    var comment = require('../../app/controllers/comment.server.controller');

    //Create a comment to a post
    app.route('comment/:postID/create').post(comment.create);
};
