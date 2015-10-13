(function() {
'use strict';

var aim = angular.module('tjlaxs.aim', []);

aim.controller('imageMaskController', ['$scope', function($scope) {
}]);

aim.directive('tjlImageMask', function() {
	function link(scope, element, attrs) {
		scope.$watch(attrs.src, function(value) {
			if(angular.isUndefined(value)) {
				return;
			}
			console.log(value);
		});
	}

	var ret = {
		restrict: 'E',
		link: link,
		scope: {
			image: '=src'
		},
		template: 'template/image-mask.part.html'
	};

	return ret;
});

})();
