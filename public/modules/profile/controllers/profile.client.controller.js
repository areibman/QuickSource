'use strict';

angular.module('profile').controller('ProfileController', ['$scope','$http','$upload','$stateParams','$state',
	function($scope,$http,$upload,$stateParams,$state) {
		// Profile controller logic
		// ...
		$scope.find = function(){
			$http.get('/profile/'+$stateParams.username).success(function(user){
				$scope.user = user;
				//console.log(user);
				$scope.user.profileImage = '#!/uploads/profilePic/'+user.profilePic;
			}).error(function(response){
				$scope.error = response.message;
			});
		};

		$scope.updateHead = function(){
			var headline = $scope.profile.headline;
			var obj = { headline : $scope.profile.headline };
			$http.put('/users/profile/update', obj).success(function(response){
				//console.log(response);
				$scope.profile.headline = response.headline;
			});
		};


		$scope.tabs = [
			{ heading: 'General', route:'profile.general', active:false},
			{heading:'Position',route:'profile.position', active:false},
			{heading:'Education',route:'profile.education',active:false},
			{heading:'Courses',route:'profile.courses', active:false},
			{heading:'Publication',route:'profile.publication', active:false},
		];
		$scope.go = function(route){
			$state.go(route);
		};

		$scope.active = function(route){
			return $state.is(route);
		};

		$scope.$on('$stateChangeSuccess', function() {
			console.log($state);
			$scope.tabs.forEach(function(tab) {
				tab.active = $scope.active(tab.route);
			});
		});

		$scope.$on('$stateChangeStart', function() {
			//console.log('start');
		});

		$scope.inittab = function(){
			$state.go('profile.general');
		};

		$scope.edufield = [{id: '1'}];
		$scope.addNewEducation = function() {
			var newitem = $scope.edufield.length+1;
			$scope.edufield.push({'id':newitem});
			$http.post('/users/profile/addEducation/').success(function(response){
				//console.log(response);
			});
		};
		$scope.posfield = [{id: '1'}];
		$scope.addNewPosition = function() {
			var newitem = $scope.posfield.length+1;
			$scope.posfield.push({'id':newitem});
		};
		$scope.coursefield = [{id: '1'}];
		$scope.addNewCourse = function() {
			var newitem = $scope.coursefield.length+1;
			$scope.coursefield.push({'id':newitem});
		};
		$scope.pubfield = [{id: '1'}];
		$scope.addNewPublication = function() {
			var newitem = $scope.pubfield.length+1;
			$scope.pubfield.push({'id':newitem});
		};

		$scope.profile = function () {
			$http.get('/users/profile').success(function(res){
				//console.log(res.profile.headline);
				$scope.profile.headline = res.profile.headline;
			});
		};

		// Angular-File-Upload: Watching model (Profile Picture)
		$scope.$watch('profilePic', function () {
			$scope.uploadProfilePic($scope.profilePic);
		});

		$scope.uploadProfilePic = function (profilePic) {
			if (profilePic) {
				//console.log(profilePic);
				$upload.upload({
					url: '/file/uploadProfilePic',
					method: 'POST',
					file: profilePic[0]
				}).progress(function (evt) {
					var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
					console.log('Picture uploading progress: ' + progressPercentage + '% ' +
					evt.config.file.name);
				}).success(function (response) {
					$scope.user.profilePic = response;
					$http.put('/users/profile/update',$scope.user).success(function (response) {
					});
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
					$scope.user.resumeDoc = response;
					$http.put('/users/profile/update',$scope.user).success(function (response) {
					});
				});
			}
		};





	}
]);
