'use strict';

/* Directives */


angular.module('webhooksio.directives', [])

  .directive('appVersion', ['version', function(version) {
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
              if (scope.introduction_url) {
                  $http.get(scope.introduction_url).then(function(data) {
                      element.html(converter.makeHtml(data.data));
                  });
              } else {
                  element.html(converter.makeHtml(element.text()));
              }
          }
      };
  })
    
  .directive('dateRangePicker', [function () {
    return {
          restrict: 'A',
          require: 'ngModel',
          link: function (scope, elem, attrs, ngModel) {

            var opts={};

            scope.$watch(attrs.ngModel, function () {
              render();
            });
              
            scope.$watch(attrs.opts, function(){
              render();
            }
                );
            var render = function () {
              var model;
              if(attrs.opts) angular.extend(opts, angular.fromJson(attrs.opts));
                // Trim trailing comma if we are a string
                angular.isString(ngModel.$viewValue) ? model = ngModel.$viewValue.replace(/(^,)|(,$)/g, "") : model = ngModel.$viewValue;
                $(elem).daterangepicker(opts);

                $(elem).on('apply.daterangepicker', function(ev, picker) {
                  scope.start_date = picker.startDate;
                  scope.end_date = picker.endDate;
                  scope.date_range = picker.startDate.utc().format('MMM Do HH:mm UTC') + ' - ' + picker.endDate.utc().format('MMM Do HH:mm UTC');
                  scope.$apply();
                  scope.resizeFrame();
                });

                $(elem).on('show.daterangepicker', function(ev, picker) {
                  scope.resizeFrame(300);
                });

                $(elem).on('hide.daterangepicker', function(ev, picker) {
                  scope.resizeFrame();
                });

                $(elem).on('cancel.daterangepicker', function(ev, picker) {
                  scope.resizeFrame();
                });
            };
           
          }
      };
    }])
    .directive('resizeTab', [function () {
      return {
          restrict: 'ACE',
          link: function (scope, elem) {
             elem.click(function(e) {
                    e.preventDefault();
                    $(elem).tab('show');
                    scope.resizeFrame();
                });
          }
      };
    }])
    .directive('jqSparkline', [function () {
      return {
          restrict: 'A',
          require: 'ngModel',
          link: function (scope, elem, attrs, ngModel) {

               var opts={};
               //TODO: Use $eval to get the object
              opts.type = attrs.type || 'line';

              scope.$watch(attrs.ngModel, function () {
                  render();
              });
              
              scope.$watch(attrs.opts, function(){
                render();
              }
                );
              var render = function () {
                  var model;
                  if(attrs.opts) angular.extend(opts, angular.fromJson(attrs.opts));
                  // Trim trailing comma if we are a string
                  angular.isString(ngModel.$viewValue) ? model = ngModel.$viewValue.replace(/(^,)|(,$)/g, "") : model = ngModel.$viewValue;
                  var data;
                  // Make sure we have an array of numbers
                  angular.isArray(model) ? data = model : data = model.split(',');
                  $(elem).sparkline(data, opts);
              };
          }
      };
    }])
    .directive('viewIntroduction', function() {
      return {
        replace: true,
        restrict: 'AEC',
        templateUrl: "partials/introduction.html",
        link: function(scope, elem, attrs) {
          scope.resizeFrame();
        }
      };
    })
    .directive('viewDashboard', function() {
      return {
        replace: true,
        restrict: 'AEC',
        templateUrl: "partials/dashboard.html",
        link: function(scope, elem, attrs) {
          scope.resizeFrame();
        }
      };
    })
    .directive('viewDocs', function() {
      return {
        replace: true,
        restrict: 'AEC',
        templateUrl: "/partials/docs.html",
        link: function(scope, elem, attrs) {
          scope.resizeFrame();
        }
      };
    })
    .directive('viewDestinations', function() {
      return {
        replace: true,
        restrict: 'AEC',
        templateUrl: "/partials/destinations.html",
        link: function(scope, elem, attrs) {
          scope.resizeFrame();
        }
      };
    })
    .directive('viewLogs', function() {
      return {
        replace: true,
        restrict: 'AEC',
        templateUrl: "/partials/logs.html",
        link: function(scope, elem, attrs) {
          scope.resizeFrame();
        }
      };
    })
    .directive('viewLog', function() {
      return {
        replace: true,
        restrict: 'AEC',
        templateUrl: "/partials/log-view.html",
        link: function(scope, elem, attrs) {
          scope.resizeFrame();
        }
      };
    })
    .directive('addDestination', function() {
      return {
        replace: true,
        restrict: 'AEC',
        templateUrl: "/partials/destination-add.html",
        link: function(scope, elem, attrs) {
          scope.resizeFrame();
        }
      };
    })
    .directive('editDestination', function() {
      return {
        replace: true,
        restrict: 'AEC',
        templateUrl: "/partials/destination-edit.html",
        link: function(scope, elem, attrs) {
          scope.resizeFrame();
        }
      };
    });
