'use strict';

/* Controllers */

angular.module('webhooksio.controllers', [])
  .controller('WebhookCtrl', ['$scope', '$location', '$http', '$templateCache', 'consumerService', function($scope, $location, $http, $templateCache, consumerService) {

  $scope.changePage = function($page) {
    $templateCache.removeAll();
    $scope.currentview = $page;
  }

  $scope.resizeFrame = function(){
    // If there are any additional elements added, we will need to resize again...
    var container_height = $('.container-fluid').height();
    var footer_height = $('#footer').height();
    var height = container_height + footer_height + 5;
    parent.postMessage(height, '*');
  }

  $scope.getURLParams = function() {

    $scope.params = {};
    var urlparams = window.location.search.split("?")[1].split("&");

    for(var i = 0; i < urlparams.length; i++){
      var parr = urlparams[i].split("=");
      $scope.params[decodeURIComponent(parr[0])] = decodeURIComponent(parr[1]);
    }

  }

  //Get URL Parameters
  $scope.getURLParams();

  //Default Values
  $scope.currentview='dashboard';
  $scope.urlbase = 'http://api.dev.webhooks.io'
  $scope.apiversion = 'v1';
  $scope.account_id = $scope.params.account_id;
  $scope.application_id = $scope.params.application_id;
  $scope.application_version_id = $scope.params.application_version_id;
  $scope.consumer_id = $scope.params.consumer_id;
  $scope.api_token = $scope.params.token;

  // Default authorization
  $http.defaults.headers.common.Authorization = 'Bearer ' + $scope.api_token;

  
  	

  }])
  .controller('OutputCtrl', ['$scope', '$location', '$http', 'consumerService', function($scope, $location, $http, consumerService) {

  // Default authorization
  $http.defaults.headers.common.Authorization = 'Bearer ' + $scope.api_token;

  console.log("loaded");

  
    

  }]);
