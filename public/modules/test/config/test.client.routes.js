'use strict';

//Setting up route
angular.module('test').config(['$stateProvider',
	function($stateProvider) {
		// Test state routing
		$stateProvider.
		state('test', {
			url: '/test',
			templateUrl: 'modules/test/views/test.client.view.html'
		});
	}
]);