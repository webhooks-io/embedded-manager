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
          provisionConsumer: function($urlbase, $apiversion, $account_id, $application_id, $postparams) {
               $http.defaults.useXDomain = true;
               $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
               delete $http.defaults.headers.common['X-Requested-With'];
               return $http.post($urlbase + '/' + $apiversion + '/accounts/' + $account_id + '/applications/' + $application_id + '/consumers', $postparams).success(function(result) {
                    return result.data;
               }).error(function(result, status) {
                    return result;

               });
          }/*,
          getBucket: function($bucket_id) {
               $http.defaults.useXDomain = true;
               delete $http.defaults.headers.common['X-Requested-With'];
               return $http.get($localStorage.urlbase + '/' + $localStorage.apiversion + '/accounts/' + $localStorage.account_id + '/buckets/' + $bucket_id).success(function(result) {
                    return result.data;
               }).error(function(result, status) {
                    return result;

               });
          },
          deleteBucket: function($bucket_id) {
               $http.defaults.useXDomain = true;
               delete $http.defaults.headers.common['X-Requested-With'];
               return $http.delete($localStorage.urlbase + '/' + $localStorage.apiversion + '/accounts/' + $localStorage.account_id + '/buckets/' + $bucket_id).success(function(result) {
                    return result.data;
               }).error(function(result, status) {
                    return result;

               });
          },
          createBucket: function($postparams) {
               $http.defaults.useXDomain = true;
               $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
               delete $http.defaults.headers.common['X-Requested-With'];
               return $http.post($localStorage.urlbase + '/' + $localStorage.apiversion + '/accounts/' + $localStorage.account_id + '/buckets', $postparams).success(function(result) {
                    return result.data;
               }).error(function(result, status) {
                    return result;

               });
          },
          updateBucket: function($bucket_id, $postparams) {
               $http.defaults.useXDomain = true;
               $http.defaults.headers.put["Content-Type"] = "application/x-www-form-urlencoded";
               delete $http.defaults.headers.common['X-Requested-With'];
               return $http.put($localStorage.urlbase + '/' + $localStorage.apiversion + '/accounts/' + $localStorage.account_id + '/buckets/' + $bucket_id, $postparams).success(function(result) {
                    return result.data;
               }).error(function(result, status) {
                    return result;

               });
          }*/
     }
})
