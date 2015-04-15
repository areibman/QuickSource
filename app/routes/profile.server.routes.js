'use strict';

module.exports = function(app) {
    var users = require('../../app/controllers/users.server.controller');
    var profile = require('../../app/controllers/profile.server.controller');

    // Profile handling
    app.route('/profile/:profileId')
        // View experience
        .get(profile.read);

    // Finish by binding the Profile middleware
    app.param('profileId', profile.profileByID);
};
