'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    fs = require('fs'),
    path = require('path'),
    uuid = require('node-uuid'),
    _ = require('lodash');

/**
 * File upload
 */
exports.uploadResume = function(req, res) {
    req.pipe(req.busboy);
    req.busboy.on('file', function(fieldname, file, filename) {
        var newFilename = uuid.v1() + filename.substring(filename.lastIndexOf('.'), filename.length);
        var saveTo = path.dirname(require.main.filename) + '/uploads/profilePic/' + newFilename;
        var fstream = fs.createWriteStream(saveTo);
        file.pipe(fstream);
        fstream.on('close', function () {
            res.status(200).send(newFilename);
        });
    });
};

/*
 * Fetch file
 */
exports.read = function(req, res) {
    console.log('Getting...');
};
