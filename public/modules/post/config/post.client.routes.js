'use strict';

//Setting up route
angular.module('post').config(['$stateProvider',
	function($stateProvider) {
		// Post state routing
		$stateProvider.
		state('browse', {
			url: '/browse',
			templateUrl: 'modules/post/views/browse.client.view.html'
		});
	}
]);