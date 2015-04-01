'use strict';

module.exports = function(app) {
	// Test for file upload functions
    var filehandler = require('../../app/controllers/filehandler.server.controller');

    app.route('/test')
        .get(filehandler.getProfilePic)
        .post(filehandler.uploadProfilePic);
};
