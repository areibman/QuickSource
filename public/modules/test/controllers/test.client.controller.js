'use strict';

angular.module('test').controller('TestController', ['$scope', '$upload', function ($scope, $upload) {

    // Angular-File-Upload: Watching model
    $scope.$watch('file', function () {
        $scope.upload($scope.file);
    });

    $scope.upload = function (file) {
        if (file) {
            $upload.upload({
                url: '/users/uploadResume',
                method: 'POST',
                file: file[0]
            }).progress(function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' +
                evt.config.file.name);
            }).success(function (response) {
                console.log('fileName:' + response);
            });
        }
    };
}]);
