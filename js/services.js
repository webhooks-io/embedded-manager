'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('webhooksio.services', [])
  .value('version', '0.1')
  .value('title', 'Webhook Manager')
  .factory('consumerService', function($http) {
     return {
          getConsumer: function($urlbase, $apiversion, $account_id, $application_id, $consumer_id) {
               $http.defaults.useXDomain = true;
               delete $http.defaults.headers.common['X-Requested-With'];
               return $http.get($urlbase + '/' + $apiversion + '/accounts/' + $account_id + '/applications/' + $application_id + '/consumers/' + $consumer_id).success(function(result) {
                    return result.data;
               }).error(function(result, status) {
                    return result;

               });
          },
          createOutput: function($urlbase, $apiversion, $account_id, $application_id, $consumer_id, $postparams) {
               $http.defaults.useXDomain = true;
               $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
               delete $http.defaults.headers.common['X-Requested-With'];
               return $http.post($urlbase + '/' + $apiversion + '/accounts/' + $account_id + '/applications/' + $application_id + '/consumers/' + $consumer_id + '/outputs', postparams).success(function(result) {
                    return result.data;
               }).error(function(result, status) {
                    return result;
               });
          },
          getOutputs:  function($urlbase, $apiversion, $account_id, $application_id, $consumer_id, $postparams) {
               $http.defaults.useXDomain = true;
               delete $http.defaults.headers.common['X-Requested-With'];
               return $http.get($urlbase + '/' + $apiversion + '/accounts/' + $account_id + '/applications/' + $application_id + '/consumers/' + $consumer_id + '/outputs?bucket_key=' + $bucket_key ).success(function(result) {
                    return result.data;
               }).error(function(result, status) {
                    return result;

               });
          },
          updateOutput:  function($urlbase, $apiversion, $account_id, $application_id, $consumer_id, $output_id, $postparams) {
               $http.defaults.useXDomain = true;
               $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
               delete $http.defaults.headers.common['X-Requested-With'];
               return $http.put($urlbase + '/' + $apiversion + '/accounts/' + $account_id + '/applications/' + $application_id + '/consumers/' + $consumer_id + '/outputs/' + $output_id, postparams).success(function(result) {
                    return result.data;
               }).error(function(result, status) {
                    return result;
               });
          },
          deleteOutput: function($urlbase, $apiversion, $account_id, $application_id, $consumer_id) {
               $http.defaults.useXDomain = true;
               delete $http.defaults.headers.common['X-Requested-With'];
               return $http.delete($urlbase + '/' + $apiversion + '/accounts/' + $account_id + '/applications/' + $application_id + '/consumers/' + $consumer_id + '/outputs/' + $output_id).success(function(result) {
                    return result.data;
               }).error(function(result, status) {
                    return result;

               });
          }
     }
})
