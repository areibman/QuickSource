'use strict';

angular.module('profile').controller('ProfileController', ['$scope','$http','$upload','$stateParams','$state',
	function($scope,$http,$upload,$stateParams,$state) {
		// Profile controller logic
		// ...
		$scope.find = function(){
			$http.get('/profile/'+$stateParams.username).success(function(user){
				$scope.user = user;
				console.log(user);
				$scope.user.profileImage = 'uploads/profilePic/'+user.profilePic;
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
			{heading:'Publication',route:'profile.publication', active:false}
		];
		$scope.go = function(route){
			$state.go(route);
		};

		$scope.active = function(route){
			return $state.is(route);
		};

		$scope.$on('$stateChangeSuccess', function() {
			//console.log($state);
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
			var previousitem = $scope.edufield[newitem-2];
			//console.log(previousitem);
			//previousitem.title = $scope.profile.headline;
			$http.post('/users/profile/addEducation',previousitem).success(function(response){
				$scope.edufield[newitem-2].submitted = true;
				$scope.edufield.unshift({'id':newitem});
				$scope.edufield = $scope.edufield.splice(previousitem,1);
				$scope.error = '';
				previousitem._id = response._id;
				$scope.profile.educations.unshift(previousitem);
			}).error(function(response){
				$scope.error = response.message;
			});
		};
		$scope.remove = function(experienceId){
			console.log(experienceId);
			$http.put('/users/profile/'+experienceId+'/remove').success(function(response){
				console.log(response);

				if(response.type === 'education') {
					$scope.profile.educations.splice(response, 1);
				}
				if(response.type === 'position'){
					$scope.profile.positions.splice(response, 1);
					console.log($scope.profile.positions);
				}
				if(response.type === 'course'){
					$scope.profile.courses.splice(response, 1);
				}
				if(response.type === 'publication'){
					$scope.profile.publications.splice(response, 1);
				}
			});
		};
		$scope.posfield = [{id: '1'}];
		$scope.addNewPosition = function() {
			var newitem = $scope.posfield.length+1;
			var previousitem = $scope.posfield[newitem-2];
			//previousitem.title = $scope.profile.headline;
			$http.post('/users/profile/addPosition',previousitem).success(function(response){
				$scope.posfield[newitem-2].submitted = true;
				$scope.posfield.unshift({'id':newitem});
				$scope.posfield = $scope.posfield.splice(previousitem,1);
				previousitem._id = response._id;
				$scope.error = '';
				$scope.profile.positions.unshift(previousitem);
			}).error(function(response){
				$scope.error = response.message;
			});
		};
		$scope.coursefield = [{id: '1'}];
		$scope.addNewCourse = function() {
			var newitem = $scope.coursefield.length+1;
			var previousitem = $scope.coursefield[newitem-2];
			//previousitem.title = $scope.profile.headline;
			$http.post('/users/profile/addCourse',previousitem).success(function(response){
				$scope.coursefield[newitem-2].submitted = true;
				$scope.coursefield.unshift({'id':newitem});
				$scope.coursefield = $scope.coursefield.splice(previousitem,1);
				previousitem._id = response._id;
				$scope.error = '';
				$scope.profile.courses.unshift(previousitem);
			}).error(function(response){
				$scope.error = response.message;
			});
		};

		$scope.pubfield = [{id: '1'}];
		$scope.addNewPublication = function() {
			var newitem = $scope.pubfield.length+1;
			var previousitem = $scope.pubfield[newitem-2];
			//previousitem.title = $scope.profile.headline;
			$http.post('/users/profile/addPublication',previousitem).success(function(response){
				$scope.pubfield[newitem-2].submitted = true;
				$scope.pubfield.unshift({'id':newitem});
				$scope.pubfield = $scope.pubfield.splice(previousitem,1);
				previousitem._id = response._id;
				$scope.error = '';
				$scope.profile.publications.unshift(previousitem);
			}).error(function(response){
				$scope.error = response.message;
			});
		};

		$scope.profile = function () {
			$http.get('/users/profile').success(function(res){
				
				$scope.profile = res.profile;
				$scope.profile.educations = res.profile.educations;
				$scope.profile.headline = res.profile.headline;
				$scope.profile.positions = res.profile.positions;
				$scope.profile.courses = res.profile.courses;
				$scope.profile.publications = res.profile.publications;
				console.log($scope);
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
					//Not updating file upload correctly
					$http.put('/users/accounts', { profilePic : response }).success(function (response) {
						console.log(response);
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
