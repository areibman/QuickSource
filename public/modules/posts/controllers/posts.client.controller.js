'use strict';

// Posts controller
angular.module('posts').controller('PostsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Posts','$http',
	function($scope, $stateParams, $location, Authentication, Posts,$http) {
		$scope.authentication = Authentication;

		// Create new Post
		$scope.create = function() {
            $http.post('/posts', $scope.fields).success(function(response) {
            // And redirect to the project page
                $location.path('/posts/'+response);

            }).error(function(response) {
                $scope.error = response.message;
        });
        };

		// Remove existing Post
		$scope.remove = function(post) {
			$http.delete('/posts'+post._id).success(function(response){
                $location.path('/posts');
            }).error(function(response){
                $scope.error=response.message;
            });
		};

		// Update existing Post
		$scope.update = function() {
            var post = $scope.post;
            $http.put('/posts/'+post._id,$scope.edit).success(function (response) {
                $location.path('posts/' + response._id);
            }).error(function (response) {
                $scope.error = response.message;
            });
        };



		// Find a list of Posts
		$scope.find = function() {
			$scope.posts = Posts.query();
		};

        $scope.interest= function(){
            var post = $scope.post;
            $http.post('/posts/'+post._id+'/interested').success(function(response){
                }).error(function(response){
                $scope.error = response.message;
            });
        };

		// Find existing Post
		$scope.findOne = function() {
			var post = Posts.get({
				postId: $stateParams.postId
			});

            post.$promise.then(function(post){
                    post.isAlreadyInterested = false;
                    post.isPoster = false;
                    for(var Iuser in post.interestedUsers){
                        if($scope.authentication.user._id===Iuser._id){
                            post.isAlreadyInterested = true;
                        }
                    }
                    if(post.user._id===$scope.authentication.user._id){
                        post.isPoster=true;
                    }
            });

            $scope.post = post;
           	console.log($scope.post);
        };
	}
]);
