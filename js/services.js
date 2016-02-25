(function () {
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
               createDestination: function($urlbase, $apiversion, $sub_account_id, $input_id,  $postparams) {
                    $http.defaults.useXDomain = true;
                    $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
                    delete $http.defaults.headers.common['X-Requested-With'];
                    return $http.post($urlbase + '/' + $apiversion + '/accounts/' + $sub_account_id + '/inputs/' + $input_id + '/destinations', $postparams).success(function(result) {
                         return result.data;
                    }).error(function(result, status) {
                         return result;
                    });
               },
               getDestinations:  function($urlbase, $apiversion, $sub_account_id, $input_id) {
                    $http.defaults.useXDomain = true;
                    delete $http.defaults.headers.common['X-Requested-With'];

                    return $http.get($urlbase + '/' + $apiversion + '/accounts/' + $sub_account_id + '/inputs/' + $input_id + '/destinations' ).success(function(result) {
                         return result.data;
                    }).error(function(result, status) {
                         return result;

                    });
               },
               getDestination:  function($urlbase, $apiversion, $sub_account_id, $destination_id) {
                    $http.defaults.useXDomain = true;
                    delete $http.defaults.headers.common['X-Requested-With'];
                    return $http.get($urlbase + '/' + $apiversion + '/accounts/' + $sub_account_id + '/destinations/' + $destination_id ).success(function(result) {
                         return result.data;
                    }).error(function(result, status) {
                         return result;

                    });
               },
               getLog:  function($urlbase, $apiversion, $sub_account_id, $bucket_id, $start_date, $end_date) {
                    $http.defaults.useXDomain = true;
                    delete $http.defaults.headers.common['X-Requested-With'];
                    return $http.get($urlbase + '/' + $apiversion + '/accounts/' + $sub_account_id + '/log?start_date=' + $start_date + '&end_date=' + $end_date ).success(function(result) {
                         return result.data;
                    }).error(function(result, status) {
                         return result;

                    });
               },
               updateDestination:  function($urlbase, $apiversion, $sub_account_id, $destination_id, $postparams) {
                    $http.defaults.useXDomain = true;
                    $http.defaults.headers.put["Content-Type"] = "application/x-www-form-urlencoded";
                    delete $http.defaults.headers.common['X-Requested-With'];
                    return $http.put($urlbase + '/' + $apiversion + '/accounts/' + $sub_account_id + '/destinations/' + $destination_id, $postparams).success(function(result) {
                         return result.data;
                    }).error(function(result, status) {
                         return result;
                    });
               },
               deleteDestination: function($urlbase, $apiversion, $sub_account_id, $destination_id, $consumer_id, $output_id) {
                    $http.defaults.useXDomain = true;
                    delete $http.defaults.headers.common['X-Requested-With'];
                    return $http.delete($urlbase + '/' + $apiversion + '/accounts/' + $sub_account_id + '/destinations/' + $destination_id).success(function(result) {
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
               getAuthOptions: function($urlbase, $apiversion, $type) {
                    $http.defaults.useXDomain = true;
                    delete $http.defaults.headers.common['X-Requested-With'];
                    return $http.get($urlbase + '/' + $apiversion + '/gateway/authentication/'+ $type).success(function(result) {
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
               getStats: function($urlbase, $apiversion, $sub_account_id, $application_id, $bucket_id, $start_date, $end_date, $precision) {
                    $http.defaults.useXDomain = true;
                    delete $http.defaults.headers.common['X-Requested-With'];
                    return $http.get($urlbase + '/' + $apiversion + '/accounts/' + $sub_account_id + '/stats/overview?application_id=' + $application_id + '&start_date=' + $start_date + '&end_date=' + $end_date + '&precision=' + $precision).success(function(result) {
                         return result.data;
                    }).error(function(result, status) {
                         return result;
                    });
               },
               getOutgoingMessage: function($urlbase, $apiversion, $sub_account_id, $outgoing_message_id) {
                    $http.defaults.useXDomain = true;
                    delete $http.defaults.headers.common['X-Requested-With'];
                    return $http.get($urlbase + '/' + $apiversion + '/accounts/' + $sub_account_id + '/outgoing/' + $outgoing_message_id).success(function(result) {
                         return result.data;
                    }).error(function(result, status) {
                         return result;

                    });
               },
               getOutgoingMessageAttempt: function($urlbase, $apiversion, $sub_account_id, $attempt_id) {
                    $http.defaults.useXDomain = true;
                    delete $http.defaults.headers.common['X-Requested-With'];
                    return $http.get($urlbase + '/' + $apiversion + '/accounts/' + $sub_account_id + '/attempts/' + $attempt_id + '?include_attempt_detail=true').success(function(result) {
                         return result.data;
                    }).error(function(result, status) {
                         return result;

                    });
               },
               getIntroductionText: function($url) {
                    $http.defaults.useXDomain = true;
                    delete $http.defaults.headers.common['X-Requested-With'];
                    return $http.get($url).success(function(result) {
                         return result.data;
                    }).error(function(result, status) {
                         return result;

                    });
               }
          };
     });
}());