'use strict';

/* Controllers */

angular.module('webhooksio.controllers', [])
  .controller('WebhookCtrl', ['$scope', '$location', '$http', '$templateCache', 'consumerService', function($scope, $location, $http, $templateCache, consumerService) {

  $scope.changePage = function($page) {
    $scope.currentview = $page;
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
  $scope.bucket_key = $scope.params.bucket_key;

  // Default authorization
  $http.defaults.headers.common.Authorization = 'Bearer ' + $scope.api_token;

  
  	

  }])
  .controller('DestinationCtrl', ['$scope', '$location', '$http', 'consumerService', function($scope, $location, $http, consumerService) {

  // Default authorization
  $http.defaults.headers.common.Authorization = 'Bearer ' + $scope.api_token;

  //Get the list of events:
  consumerService.getOutputs($scope.urlbase, $scope.apiversion, $scope.account_id, $scope.application_id, $scope.consumer_id, $scope.bucket_key).success(function(data) {
        console.log(data);
  }).error(function(data) {
        $scope.message = data.message || "Request failed";
        $scope.messagedetails = data.message_detail;
        $scope.showError = true;
  });

  

  
    

  }]);
