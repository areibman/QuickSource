'use strict';

module.exports = function(app) {
    var users = require('../../app/controllers/users.server.controller');
    var profile = require('../../app/controllers/profile.server.controller');

    // Profile handling
    app.route('/profile/:userUsername')
        // View experience
        .get(profile.read);

    app.param('userUsername', users.profile);
};
