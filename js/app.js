'use strict';


// Declare app level module which depends on filters, and services
var app = angular.module('webhooksio', [
  	'webhooksio.filters',
  	'webhooksio.services',
  	'webhooksio.directives',
  	'webhooksio.controllers'
]);

app.run(function ($rootScope) {


  $rootScope.resizeFrame = function() {
    // If there are any additional elements added, we will need to resize again...
      var container_height = $('.container-fluid').height();
      var footer_height = $('#footer').height();
      var height = container_height + footer_height + 1000;
      window.parent.postMessage(height, '*');
  }

	

  $rootScope.showMessage = function($opts) {
    $.gritter.add($opts);
  }

});
 