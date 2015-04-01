'use strict';

angular.module('core').directive('interest', [
	function() {
		return {
			template: '<div></div>',
			restrict: 'E',
			link: function postLink(scope, element, attrs) {
				// Interest directive logic
				// ...

				element.text('this is the interest directive');
			}
		};
	}
]);