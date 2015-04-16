'use strict';

module.exports = function(app) {
    var users = require('../../app/controllers/users.server.controller');
    var posts = require('../../app/controllers/posts.server.controller');
    var notification = require('../../app/controllers/notification.server.controller');

    app.route('/notification/:notificationId').post(users.requiresLogin, notification.hasAuthorization, notification.read);

    app.route('/notification/post/:postId/send').post(users.requiresLogin, notification.sendNotification_route);
    app.route('/notification/user/:userId/send').post(users.requiresLogin, notification.sendNotification_route);

    app.route('/notification/:notificationId/read').put(users.requiresLogin, notification.hasAuthorization, notification.setRead);
    app.route('/notification/:notificationId/remove').put(users.requiresLogin, notification.hasAuthorization, notification.setInactive);

    app.param('postId', posts.postByID);
    app.param('userId', users.userByID);
    app.param('notificationId', notification.notificationByID);
};
