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
    .directive("markdown", function ($compile, $http) {
      var converter = new Showdown.converter();
      return {
          restrict: 'E',
          replace: true,
          link: function (scope, element, attrs) {
              if ("src" in attrs) {
                  $http.get(attrs.src).then(function(data) {
                      element.html(converter.makeHtml(data.data));
                  });
              } else {
                  element.html(converter.makeHtml(element.text()));
              }
          }
      };
  })
    .directive('viewIntroduction', function() {
      return {
        replace: true,
        restrict: 'AEC',
        templateUrl: "partials/introduction.html",
        link: function(scope, elem, attrs) {
          scope.resizeFrame();
        }
      }
    })
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
    })
    .directive('addDestination', function() {
      return {
        replace: true,
        restrict: 'AEC',
        templateUrl: "/partials/destination-add.html",
        link: function(scope, elem, attrs) {
          scope.resizeFrame();
        }
      }
    })
    .directive('editDestination', function() {
      return {
        replace: true,
        restrict: 'AEC',
        templateUrl: "/partials/destination-edit.html",
        link: function(scope, elem, attrs) {
          scope.resizeFrame();
        }
      }
    });
