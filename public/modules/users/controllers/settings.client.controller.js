'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http','$upload','$location', 'Users', 'Authentication',
	function($scope, $http,$upload, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);

				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.edufield = [{id: '1'}, {id: '2'}];
		$scope.addNewEducation = function() {
			var newitem = $scope.edufield.length+1;
			$scope.edufield.push({'id':newitem});
		};
		$scope.posfield = [{id: '1'}, {id: '2'}];
		$scope.addNewPosition = function() {
			var newitem = $scope.posfield.length+1;
			$scope.posfield.push({'id':newitem});
		};
		$scope.coursefield = [{id: '1'}, {id: '2'}];
		$scope.addNewCourse = function() {
			var newitem = $scope.coursefield.length+1;
			$scope.coursefield.push({'id':newitem});
		};
		$scope.pubfield = [{id: '1'}, {id: '2'}];
		$scope.addNewPublication = function() {
			var newitem = $scope.pubfield.length+1;
			$scope.pubfield.push({'id':newitem});
		};

		$scope.profile = function () {
			$http.get('/users/accounts').success(function(res){
				console.log(res);
			});
		};

		// Angular-File-Upload: Watching model (Profile Picture)
		$scope.$watch('profilePic', function () {
			$scope.uploadProfilePic($scope.profilePic);
		});

		$scope.uploadProfilePic = function (profilePic) {
			if (profilePic) {
				console.log(profilePic);
				$upload.upload({
					url: '/file/uploadProfilePic',
					method: 'POST',
					file: profilePic[0]
				}).progress(function (evt) {
					var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
					console.log('Picture uploading progress: ' + progressPercentage + '% ' +
					evt.config.file.name);
				}).success(function (response) {
					if($scope.fields)   $scope.fields.profilePic = response;
					else                $scope.profilePic = response;
					console.log($scope);
				});
			}
		};
		// Angular-File-Upload: Watching model (Profile Resume)
		$scope.$watch('profileResume', function () {
			$scope.uploadProfileResume($scope.profileResume);
		});

		$scope.uploadProfileResume = function (profileResume) {
			if (profileResume) {
				$upload.upload({
					url: '/file/uploadProfileResume',
					method: 'POST',
					file: profileResume[0]
				}).progress(function (evt) {
					var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
					console.log('Resume uploading progress: ' + progressPercentage + '% ' +
					evt.config.file.name);
				}).success(function (response) {
					if($scope.fields)   $scope.fields.resumeDoc = response;
					else                $scope.resumeDoc = response;
					console.log($scope);
				});
			}
		};


	}
]);
