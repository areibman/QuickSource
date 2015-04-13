'use strict';

module.exports = function(app) {
    var filehandler = require('../../app/controllers/filehandler.server.controller');

    app.route('/file/uploadProfilePic').post(filehandler.uploadProfilePic);
    app.route('/file/uploadProfileResume').post(filehandler.uploadProfileResume);
    app.route('/file/uploadPostAttachment').post(filehandler.uploadPostAttachment);
};
