'use strict';

module.exports = function(app) {
	// Test for file upload functions
    var filehandler = require('../../app/controllers/filehandler.server.controller');

    app.route('/test/upload').post(filehandler.create);
    app.route('/test/fetch/:filename').get(filehandler.read);
};
