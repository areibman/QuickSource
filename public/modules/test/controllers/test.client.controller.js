'use strict';

angular.module('test').controller('TestController', ['$scope', '$upload', function ($scope, $upload) {
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
            }).success(function (data, status, headers, config) {
                console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
            });
        }
    };
}]);
