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
 * File (Profile Picture) upload
 */
exports.uploadProfilePic = function(req, res) {
    req.pipe(req.busboy);
    req.busboy.on('file', function(fieldname, file, filename) {
        console.log(file);
        var newFilename = uuid.v1() + filename.substring(filename.lastIndexOf('.'), filename.length);
        var saveTo = path.dirname(require.main.filename) + '/uploads/profilePic/' + newFilename;
        var fstream = fs.createWriteStream(saveTo);
        file.pipe(fstream);
        fstream.on('close', function () {
            if(req.fields)  req.fields.profilePicPath = newFilename;
            else            req.profilePicPath = newFilename;
            res.status(200).send(newFilename);
        });
    });
};

/**
 * File (Profile Resume) upload
 */
exports.uploadProfileResume = function(req, res) {
    req.pipe(req.busboy);
    req.busboy.on('file', function(fieldname, file, filename) {
        var newFilename = uuid.v1() + filename.substring(filename.lastIndexOf('.'), filename.length);
        var saveTo = path.dirname(require.main.filename) + '/uploads/profileResume/' + newFilename;
        var fstream = fs.createWriteStream(saveTo);
        file.pipe(fstream);
        fstream.on('close', function () {
            if(req.fields)  req.fields.profileResumePath = newFilename;
            else            req.profileResumePath = newFilename;
            res.status(200).send(newFilename);
        });
    });
};

/**
 * File (Post Attachment) upload
 */
exports.uploadPostAttachment = function(req, res) {
    req.pipe(req.busboy);
    req.busboy.on('file', function(fieldname, file, filename) {
        var newFilename = uuid.v1() + filename.substring(filename.lastIndexOf('.'), filename.length);
        var saveTo = path.dirname(require.main.filename) + '/uploads/postAttachment/' + newFilename;
        var fstream = fs.createWriteStream(saveTo);
        file.pipe(fstream);
        fstream.on('close', function () {
            if(req.fields)  req.fields.profileResumePath = newFilename;
            else            req.profileResumePath = newFilename;
            res.status(200).send(newFilename);
        });
    });
};

