'use strict';

/* Directives */


angular.module('webhooksio.directives', []).
  	directive('appVersion', ['version', function(version) {
    	return function(scope, elm, attrs) {
      		elm.text(version);
    	};
  	}])
    .directive('appTitle', ['title', function(title) {
    	return function(scope, elm, attrs) {
      		elm.text(title);
    	};
  	}])
    .directive('viewDashboard', function() {
      return {
        replace: true,
        restrict: 'AEC',
        templateUrl: "partials/dashboard.html",
        link: function(scope, elem, attrs) {
          scope.resizeFrame();
        }
      }
    })
    .directive('viewDocs', function() {
      return {
        replace: true,
        restrict: 'AEC',
        templateUrl: "/partials/docs.html",
        link: function(scope, elem, attrs) {
          scope.resizeFrame();
        }
      }
    })
    .directive('viewDestinations', function() {
      return {
        replace: true,
        restrict: 'AEC',
        templateUrl: "/partials/destinations.html",
        link: function(scope, elem, attrs) {
          scope.resizeFrame();
        }
      }
    })
    .directive('viewLogs', function() {
      return {
        replace: true,
        restrict: 'AEC',
        templateUrl: "/partials/logs.html",
        link: function(scope, elem, attrs) {
          scope.resizeFrame();
        }
      }
    });
