'use strict';

/* Controllers */

angular.module('webhooksio.controllers', [])
  .controller('WebhookCtrl', ['$scope', '$location', '$http', 'consumerService', function($scope, $location, $http, consumerService) {

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
  $scope.urlbase = 'http://api.dev.webhooks.io';
  $scope.apiversion = 'v1';
  $scope.account_id = $scope.params.account_id;
  $scope.application_id = $scope.params.application_id;
  $scope.application_version_id = $scope.params.application_version_id;
  $scope.consumer_id = $scope.params.consumer_id;
  $scope.consumer_name = $scope.params.consumer_name;
  $scope.api_token = $scope.params.token;

  // Default authorization
  $http.defaults.headers.common.Authorization = 'Bearer ' + $scope.api_token;

  //Check to see if the customer is setup
  consumerService.getConsumer($scope.urlbase, $scope.apiversion, $scope.account_id, $scope.application_id, $scope.consumer_id).success(function(data) {
    //Consumer is Setup
    console.log(data);
  }).error(function(data) {
    if(data.status_code == 404) {

      //Consumer is not setup, lets provision them.
      var postdata =  $.param({
          consumer_id: $scope.consumer_id,
          name : $scope.consumer_name
      });

      consumerService.provisionConsumer($scope.urlbase, $scope.apiversion, $scope.account_id, $scope.application_id, postdata).success(function(data) {
        console.log(data);
      }).error(function(data) {
         $scope.message = data.message || "Request failed";
        $scope.messagedetails = data.message_detail;
        $scope.showError = true;
      });

      
      console.log('provision consumer here');
    } else {
      $scope.message = data.message || "Request failed";
      $scope.messagedetails = data.message_detail;
      $scope.showError = true;
    }
   });
  	

  }]);
