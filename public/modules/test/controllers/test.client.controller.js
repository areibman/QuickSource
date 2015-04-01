'use strict';

angular.module('test').controller('TestController', ['$scope', '$stateParams', '$location', 'Authentication', 'Users','$http','$state',
    function($scope, $stateParams, $location, Authentication, Posts,$http,$state) {

        $scope.postTest = function() {
            console.log($scope);
            $http.post('/test/upload', $scope.filefield).success(function(response) {
            }).error(function(response) {
                $scope.error = response.message;
            });
        };

        $scope.getTest = function() {
            $http.get('/test/fetch', $scope.fields).success(function(response) {
                console.log(response);
            }).error(function(response) {
                $scope.error = response.message;
            });
        };

        $scope.putTest = function() {
            $http.put('/test', $scope.fields).success(function(response) {
                console.log(response);
            }).error(function(response) {
                $scope.error = response.message;
            });
        };
	}
]);
