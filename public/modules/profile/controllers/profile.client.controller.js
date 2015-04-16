'use strict';

angular.module('profile').controller('ProfileController', ['$scope','$http','$upload','$stateParams',
	function($scope,$http,$upload,$stateParams) {
		// Profile controller logic
		// ...
		$scope.find = function(){
			$http.get('/profile/'+$stateParams.username).success(function(user){
				$scope.user = user;
			}).error(function(response){
				$scope.error = response.message;
			});
		};


	}]);
