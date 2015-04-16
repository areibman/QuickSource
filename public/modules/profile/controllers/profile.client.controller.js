'use strict';

angular.module('profile').controller('ProfileController', ['$scope','$http','$upload','$stateParams',
	function($scope,$http,$upload,$stateParams) {
		// Profile controller logic
		// ...
		$scope.get = function(){
			$http.get('/profile/'+$stateParams.profileId).success(function(user){
				$scope.user = user;
			}).error(function(response){
				$scope.error = response.message;
			});
		};


	}]);
