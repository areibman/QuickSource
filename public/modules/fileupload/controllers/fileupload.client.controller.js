'use strict';

angular.module('fileupload').controller('FileuploadController', ['$scope','$http','$upload',
	function($scope,$http,$upload) {
		// Fileupload controller logic
		// ...
		// Angular-File-Upload: Watching model (Profile Resume)
		$scope.$watch('attachment', function () {
			$scope.uploadFile($scope.attachment);
		});

		$scope.uploadFile = function (attachment) {
			if (attachment) {
				$upload.upload({
					url: '/file/uploadPostAttachment',
					method: 'POST',
					file: attachment[0]
				}).progress(function (evt) {
					var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
					console.log('File uploading progress: ' + progressPercentage + '% ' +
					evt.config.file.name);
				}).success(function (response) {
					if($scope.fields)   $scope.fields.attachment = response;
					else                $scope.attachment = response;
					console.log($scope);
				});
			}
		};
	}]);
