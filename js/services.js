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
          createDestination: function($urlbase, $apiversion, $account_id, $application_id, $consumer_id, $postparams) {
               $http.defaults.useXDomain = true;
               $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
               delete $http.defaults.headers.common['X-Requested-With'];
               return $http.post($urlbase + '/' + $apiversion + '/accounts/' + $account_id + '/applications/' + $application_id + '/consumers/' + $consumer_id + '/desintations', $postparams).success(function(result) {
                    return result.data;
               }).error(function(result, status) {
                    return result;
               });
          },
          getDestinations:  function($urlbase, $apiversion, $account_id, $application_id, $consumer_id, $bucket_key) {
               $http.defaults.useXDomain = true;
               delete $http.defaults.headers.common['X-Requested-With'];
               return $http.get($urlbase + '/' + $apiversion + '/accounts/' + $account_id + '/applications/' + $application_id + '/consumers/' + $consumer_id + '/destinations?bucket_key=' + $bucket_key ).success(function(result) {
                    return result.data;
               }).error(function(result, status) {
                    return result;

               });
          },
          getDestination:  function($urlbase, $apiversion, $account_id, $application_id, $consumer_id, $bucket_key, $destination_id) {
               $http.defaults.useXDomain = true;
               delete $http.defaults.headers.common['X-Requested-With'];
               return $http.get($urlbase + '/' + $apiversion + '/accounts/' + $account_id + '/applications/' + $application_id + '/consumers/' + $consumer_id + '/destinations/' + $destination_id + '?bucket_key=' + $bucket_key ).success(function(result) {
                    return result.data;
               }).error(function(result, status) {
                    return result;

               });
          },
          getLog:  function($urlbase, $apiversion, $account_id, $bucket_id, $start_date, $end_date) {
               $http.defaults.useXDomain = true;
               delete $http.defaults.headers.common['X-Requested-With'];
               return $http.get($urlbase + '/' + $apiversion + '/accounts/' + $account_id + '/log?bucket_id=' + $bucket_id + '&start_date=' + $start_date + '&end_date=' + $end_date ).success(function(result) {
                    return result.data;
               }).error(function(result, status) {
                    return result;

               });
          },
          updateDestination:  function($urlbase, $apiversion, $account_id, $application_id, $consumer_id, $destination_id, $postparams) {
               $http.defaults.useXDomain = true;
               $http.defaults.headers.put["Content-Type"] = "application/x-www-form-urlencoded";
               delete $http.defaults.headers.common['X-Requested-With'];
               return $http.put($urlbase + '/' + $apiversion + '/accounts/' + $account_id + '/applications/' + $application_id + '/consumers/' + $consumer_id + '/destinations/' + $destination_id, $postparams).success(function(result) {
                    return result.data;
               }).error(function(result, status) {
                    return result;
               });
          },
          deleteDestination: function($urlbase, $apiversion, $account_id, $application_id, $consumer_id, $destination_id) {
               $http.defaults.useXDomain = true;
               delete $http.defaults.headers.common['X-Requested-With'];
               return $http.delete($urlbase + '/' + $apiversion + '/accounts/' + $account_id + '/applications/' + $application_id + '/consumers/' + $consumer_id + '/destinations/' + $destination_id).success(function(result) {
                    return result.data;
               }).error(function(result, status) {
                    return result;

               });
          },
          getAppVersions: function($urlbase, $apiversion, $account_id, $application_id) {
               $http.defaults.useXDomain = true;
               delete $http.defaults.headers.common['X-Requested-With'];
               return $http.get($urlbase + '/' + $apiversion + '/accounts/' + $account_id + '/applications/' + $application_id + '/versions/').success(function(result) {
                    return result.data;
               }).error(function(result, status) {
                    return result;

               });
          },
          getAuthOptions: function($urlbase, $apiversion) {
               $http.defaults.useXDomain = true;
               delete $http.defaults.headers.common['X-Requested-With'];
               return $http.get($urlbase + '/' + $apiversion + '/gateway/authentication/input').success(function(result) {
                    return result.data;
               }).error(function(result, status) {
                    return result;

               });
          },
          getRetryPolicies: function($urlbase, $apiversion) {
               $http.defaults.useXDomain = true;
               delete $http.defaults.headers.common['X-Requested-With'];
               return $http.get($urlbase + '/' + $apiversion + '/retry_policies').success(function(result) {
                    return result.data;
               }).error(function(result, status) {
                    return result;

               });
          },
          getStats: function($urlbase, $apiversion, $account_id, $application_id, $bucket_id, $start_date, $end_date, $precision) {
               $http.defaults.useXDomain = true;
               delete $http.defaults.headers.common['X-Requested-With'];
               return $http.get($urlbase + '/' + $apiversion + '/accounts/' + $account_id + '/stats/overview?application_id=' + $application_id + '&bucket_id=' + $bucket_id + '&start_date=' + $start_date + '&end_date=' + $end_date + '&precision=' + $precision).success(function(result) {
                    
                    return result.data;
               }).error(function(result, status) {
                    return result;

               });
          }
     }
})
