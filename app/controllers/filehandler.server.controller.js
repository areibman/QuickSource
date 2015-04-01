'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    fs = require('fs'),
    _ = require('lodash');

/**
 * File upload
 */
exports.uploadResume = function(req, res) {
    req.pipe(req.busboy);
    console.log('Uploading... to '+__dirname);
    //req.busboy.on('file', function(fieldname, file, filename) {
    //    var fstream = fs.createWriteStream('./images/' + filename);
    //    file.pipe(fstream);
    //    fstream.on('close', function () {
    //        res.redirect('back');
    //    });
    //});
};

/*
 * Fetch file
 */
exports.read = function(req, res) {
    console.log('Getting...');
};
