'use strict';

/**
 * Module dependencies.
 */
exports.index = function(req, res) {
    console.log("Testing");
    res.render('index', {
		user: req.user || null,
		request: req
	});
};
