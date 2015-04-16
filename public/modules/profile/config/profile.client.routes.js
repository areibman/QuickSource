'use strict';

//Setting up route
angular.module('profile').config(['$stateProvider',
	function($stateProvider) {
		// Profile state routing
		$stateProvider.
		state('view-profile', {
			url: '/profile/:username',
			templateUrl: 'modules/profile/views/view-profile.client.view.html'
		});
	}
]);
