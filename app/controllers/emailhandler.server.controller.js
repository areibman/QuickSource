'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    nodemailer = require('nodemailer'),
    _ = require('lodash');

/**
 * Transporter set up
 */
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'emory.quicksource@gmail.com',
        pass: 'QuickSource@Emory'
    }
});

/**
 * Dummy email test
 */
exports.sendEmail = function(mailOptions){

    // Sample mailOptions
    //var mailOptions = {
    //    from: 'QuickSource <emory.quicksource@gmail.com>', // sender address
    //    to: to, // list of receivers
    //    subject: 'Hello', // Subject line
    //    text: 'Hello world', // plaintext body
    //    html: '<b>Hello world</b>' // html body
    //};

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Message sent: ' + info.response);
        }
    });
};


