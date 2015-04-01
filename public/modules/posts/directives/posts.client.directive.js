'use strict';

angular.module('posts').directive('posts', [
	function() {
		return {
			template: '<div></div>',
			restrict: 'E',
			link: function postLink(scope, element, attrs) {
				// Posts directive logic
				// ...

				element.text('this is the posts directive');
			}
		};
	}
]);
