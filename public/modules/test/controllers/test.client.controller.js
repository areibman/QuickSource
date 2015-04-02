'use strict';

angular.module('test').controller('TestController', ['$scope', '$upload', function ($scope, $upload) {

    // Angular-File-Upload: Watching model (Profile Picture)
    $scope.$watch('profilePic', function () {
        $scope.uploadProfilePic($scope.profilePic);
    });

    $scope.uploadProfilePic = function (profilePic) {
        if (profilePic) {
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
}]);
