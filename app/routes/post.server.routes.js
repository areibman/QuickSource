'use strict';

module.exports = function(app) {
    var post = requires('../../app/controllers/post.server.controller');

    //Get post(s)
    app.route('post/view/:postID').get(post.read);

    //Create a new post
    app.route('post/new').post(post.create);

    //Edit a post
    app.route('post/edit/:postID').update(post.update);

    //Delete (Set Inactive) a post
    app.route('post/delete/:postID').delete(post.delete);

    //List posts
    app.route('post/view/recent/:limit').get(post.getRecent);
};
