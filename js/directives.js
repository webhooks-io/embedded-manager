'use strict';

/* Directives */


angular.module('webhooksio.directives', []).
  	directive('appVersion', ['version', function(version) {
    	return function(scope, elm, attrs) {
      		elm.text(version);
    	};
  	}]).
  	directive('appTitle', ['title', function(title) {
    	return function(scope, elm, attrs) {
      		elm.text(title);
    	};
  	}]);
