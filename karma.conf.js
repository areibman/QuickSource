'use strict';

/**
 * Module dependencies.
 */
var applicationConfiguration = require('./config/config');

// Karma configuration
module.exports = function(config) {
	config.set({
		// Frameworks to use
		frameworks: ['jasmine'],

		// List of files / patterns to load in the browser
		files: applicationConfiguration.assets.lib.js.concat(applicationConfiguration.assets.js, applicationConfiguration.assets.tests),

		// Test results reporter to use
		// Possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
		//reporters: ['progress'],
		reporters: ['progress','coverage'],

		// Web server port
		port: 9876,

		// Enable / disable colors in the output (reporters and logs)
		colors: true,

		// Level of logging
		// Possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_INFO,

		// Enable / disable watching file and executing tests whenever any file changes
		autoWatch: true,

        preprocessors: {
            // source files, that you wanna generate coverage for
            // do not include tests or libraries
            // (these files will be instrumented by Istanbul)
            'app/controller/*.js': ['coverage'],
            'app/models/*.js': ['coverage'],
            'app/routes/*.js': ['coverage'],
            'app/views/*.js': ['coverage'],
            'config/*.js': ['coverage'],
            'public/modules/comments/config/*.js': ['coverage'],
            'public/modules/comments/controllers/*.js': ['coverage'],
            'public/modules/comments/services/*.js': ['coverage'],
            'public/modules/comments/views/*.js': ['coverage'],
            'public/modules/core/config/*.js': ['coverage'],
            'public/modules/core/controllers/*.js': ['coverage'],
            'public/modules/core/services/*.js': ['coverage'],
            'public/modules/core/views/*.js': ['coverage'],
            'public/modules/posts/config/*.js': ['coverage'],
            'public/modules/posts/controllers/*.js': ['coverage'],
            'public/modules/posts/services/*.js': ['coverage'],
            'public/modules/posts/views/*.js': ['coverage'],
            'public/modules/users/config/*.js': ['coverage'],
            'public/modules/users/controllers/*.js': ['coverage'],
            'public/modules/users/services/*.js': ['coverage'],
            'public/modules/users/views/*.js': ['coverage'],


        },

        coverageReporter: {
            type : 'html',
            dir : 'coverage/'
           // ,file : 'coverage.txt'
        },



        // Start these browsers, currently available:
		// - Chrome
		// - ChromeCanary
		// - Firefox
		// - Opera
		// - Safari (only Mac)
		// - PhantomJS
		// - IE (only Windows)
		browsers: ['PhantomJS'],

		// If browser does not capture in given timeout [ms], kill it
		captureTimeout: 60000,

		// Continuous Integration mode
		// If true, it capture browsers, run tests and exit
		singleRun: true
	});
};
