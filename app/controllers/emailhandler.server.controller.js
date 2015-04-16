'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    nodemailer = require('nodemailer'),
    os = require('os'),
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

// send mail with defined transport object
var send = function(mailOptions) {
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) console.log(error);
        else    console.log('Message sent: ' + info.response);
    });
};

/**
 * Send customized email
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

    send(mailOptions);
};

/**
 * Send confirmation email
 */
exports.sendConfirmationEmail = function(userId, email){
    var mailOptions = {
        from: 'QuickSource <emory.quicksource@gmail.com>', // sender address
        to: email, // list of receivers
        subject: 'Welcome to QuickSource', // Subject line
        text: 'Please click the following link to validate your email: http://' + os.hostname() + '/users/emailValidation/'+userId, // plaintext body
        html: 'Please click the following link to validate your email: <a href="http://' + os.hostname() + '/users/emailValidation/'+userId+'">Click here</a>' // html body
    };
    send(mailOptions);
};

