

/* Controllers */

angular.module('webhooksio.controllers', ['ngSanitize'])


// ===================================================================
// Main Controller
// ===================================================================
  .controller('WebhookCtrl', ['$scope', '$location', '$http', '$templateCache', 'consumerService', 'cssInjector', function($scope, $location, $http, $templateCache, consumerService, cssInjector) {

    $scope.getURLParams = function() {

      $scope.params = {};
      var urlparams = window.location.search.split("?")[1].split("&");

      for(var i = 0; i < urlparams.length; i++){
        var parr = urlparams[i].split("=");
        $scope.params[decodeURIComponent(parr[0])] = decodeURIComponent(parr[1]);
      }

    };

    // handles resizing the window if anything changes...
    $scope.$watch(function() {
      $scope.resizeFrame();
    });


    $.listen('parsley:form:validated', function(){
      $scope.resizeFrame();
    });

    $scope.changePage = function($page, $id) {
      $scope.passedid = $id;
      $scope.currentview = $page;
    };

    //Get URL Parameters
    $scope.getURLParams();

    //Default Values
    if(!$scope.params.api_url){
      $scope.urlbase = 'https://api.webhooks.io';
    }else{
      $scope.urlbase = $scope.params.api_url;
    }

    if(!$scope.params.api_version){
      $scope.apiversion = 'v1';
    }else{
      $scope.apiversion = $scope.params.api_version;
    }

    if($scope.params.show_introduction === undefined) {
      $scope.params.show_introduction = 'no-destinations';
    }

    if($scope.params.css_url !== undefined && $scope.params.css_url.length > 0) {
      cssInjector.add($scope.params.css_url);
    }

    // Default authorization
    $http.defaults.headers.common.Authorization = 'client-token-bearer ' + $scope.params.token;

    //Destinations?
    consumerService.getDestinations($scope.urlbase, $scope.apiversion, $scope.params.sub_account_id, $scope.params.input_id).success(function(data) {
      $scope.destinations = data.destinations;
    }).error(function(data) {
          $scope.message = data.message || "Request failed";
          $scope.messagedetails = data.message_detail;
          $scope.showError = true;
    });

    // introducton display?
    if($scope.params.show_introduction == 'always') {
      $scope.show_introduction = true;
    } else if($scope.params.show_introduction == 'never') {
      $scope.show_introduction = false;
    } else if ($scope.params.show_introduction == 'no-destinations' && $scope.destinations !== undefined && $scope.destinations.length > 0) {
      $scope.show_introduction = false;
    } else {
      $scope.show_introduction = true;
    }

    // default tab?
    if( $scope.params.default_tab === undefined || $scope.params.default_tab === '' || ( $scope.params.default_tab == 'introduction' && $scope.show_introduction === false ) ){
      $scope.params.default_tab = 'dashboard';
    }

    if( $scope.params.introduction_url === undefined) {
      $scope.introduction_url =  "";
    } else {
      $scope.introduction_url = $scope.params.introduction_url;
    }

    $scope.currentview = $scope.params.default_tab;

    $scope.account_id = $scope.params.account_id;
    $scope.sub_account_id = $scope.params.sub_account_id;
    $scope.application_id = $scope.params.application_id;
    $scope.bucket_id = $scope.params.bucket_id;
    $scope.input_id = $scope.params.input_id;
    $scope.consumer_id = $scope.params.consumer_id;
    $scope.api_token = $scope.params.token;
    $scope.bucket_key = $scope.params.bucket_key;
   

    }])
    .controller('DestinationCtrl', ['$scope', '$location', '$http', 'consumerService', function($scope, $location, $http, consumerService) {

    // Default authorization
    $http.defaults.headers.common.Authorization = 'client-token-bearer ' + $scope.api_token;

    //Get the list of events:
    consumerService.getDestinations($scope.urlbase, $scope.apiversion, $scope.sub_account_id, $scope.input_id).success(function(data) {
      $scope.destinations = data.destinations;
    }).error(function(data) {
          $scope.message = data.message || "Request failed";
          $scope.messagedetails = data.message_detail;
          $scope.showError = true;
    });

  }])


// ===================================================================
// Dashboard Controller
// ===================================================================
  .controller('DashboardCtrl', ['$scope', '$location', '$http', '$templateCache', 'consumerService', function($scope, $location, $http, $templateCache, consumerService) {


     // Default authorization
    $http.defaults.headers.common.Authorization = 'client-token-bearer ' + $scope.api_token;

    $scope.getTotalFromArray = function(array) {
      var total = 0;
      for(var v=0; v<array.length; v++) {
        total =+ array[v];
      }
      return total;
    };

    //Volume chart options
    $scope.chart_daily_volume_opts = {
      type:'bar',
      height:'45px',
      barColor:'#31708F',
      barSpacing:'1px',
      barWidth:'10px'
    };

    $scope.chart_daily_success_opts = {
      type:'bar',
      height:'45px',
      barColor:'#3C763D',
      barSpacing:'1px',
      barWidth:'10px'
    };

    $scope.chart_daily_failure_opts = {
      type:'bar',
      height:'45px',
      barColor:'#A94442',
      barSpacing:'1px',
      barWidth:'10px'
    };

     $scope.chart_weekly_volume_opts = {
      type:'bar',
      height:'45px',
      barColor:'#31708F',
      barSpacing:'2px',
      barWidth:'35px'
    };

    $scope.chart_weekly_success_opts = {
      type:'bar',
      height:'45px',
      barColor:'#3C763D',
      barSpacing:'2px',
      barWidth:'35px'
    };

    $scope.chart_weekly_failure_opts = {
      type:'bar',
      height:'45px',
      barColor:'#A94442',
      barSpacing:'2px',
      barWidth:'35px'
    };

    //Default values
    $scope.weekly_volume = [];
    $scope.weekly_volume_total = 0;
    $scope.weekly_success = [];
    $scope.weekly_success_total = 0;
    $scope.weekly_failure400 = [];
    $scope.weekly_failure400_total = 0;
    $scope.weekly_failure500 = [];
    $scope.weekly_failure500_total = 0;
    $scope.weekly_filtered = [];
    $scope.weekly_filtered_total = 0;
    $scope.weekly_deliverability = '100';
    $scope.weekly_failure_total = 0;

    $scope.daily_volume = [];
    $scope.daily_volume_total = 0;
    $scope.daily_success = [];
    $scope.daily_success_total = 0;
    $scope.daily_failure400 = [];
    $scope.daily_failure400_total = 0;
    $scope.daily_failure500 = [];
    $scope.daily_failure500_total = 0;
    $scope.daily_filtered = [];
    $scope.daily_filtered_total = 0;
    $scope.daily_deliverability = '100';
    $scope.daily_failure_total = 0;

    $scope.queued_total = 0;
    $scope.pending_total = 0;

    $scope.year = moment().format("YYYY");
    $scope.month = moment().format("MM");
    $scope.day = moment().format("DD");
    $scope.hour = moment().format("HH");

    $scope.utc_hour = moment($scope.year + '-' + $scope.month + '-' + $scope.day + ' ' + $scope.hour + ':00','YYYY-MM-DD HH:mm').utc();
    $scope.utc_day = moment($scope.year + '-' + $scope.month + '-' + $scope.day + ' 00:00','YYYY-MM-DD HH:mm').utc();

    // Last 7 Day stats
    consumerService.getStats($scope.urlbase, $scope.apiversion, $scope.sub_account_id, $scope.application_id, $scope.bucket_id, $scope.input_id, moment(moment({hour: 0, minute: 0}).subtract('days',7)).utc().format('X'),moment(moment({hour: 0, minute: 0}).add('days',1)).utc().format('X'),'day').success(function(data) {
      $scope.summary = data.summary;
      $scope.detail = data.detail;

      $scope.weekly_volume_total = $scope.summary.outgoing_messages;
      $scope.weekly_success_total = $scope.summary.outgoing_successful;
      $scope.weekly_failure400_total = $scope.summary.outgoing_400;
      $scope.weekly_failure500_total = $scope.summary.outgoing_500;
      $scope.weekly_filtered_total = $scope.summary.filtered;

      for(var d=0;d<$scope.detail.length;d++){
        $scope.weekly_volume.push($scope.detail[d].outgoing_messages);
        $scope.weekly_success.push($scope.detail[d].outgoing_successful);
        $scope.weekly_failure400.push($scope.detail[d].outgoing_400);
        $scope.weekly_failure500.push($scope.detail[d].outgoing_500);
        $scope.weekly_filtered.push($scope.detail[d].filtered);
      }

      if(($scope.weekly_success_total + $scope.weekly_failure400_total + $scope.weekly_failure500_total) > 0) {
        $scope.weekly_deliverability = Math.round($scope.weekly_success_total / ($scope.weekly_success_total + $scope.weekly_failure400_total + $scope.weekly_failure500_total) * 100);
      }

      $scope.weekly_failure_total = $scope.weekly_failure400_total + $scope.weekly_failure500_total;

      $scope.queued_total = $scope.summary.queued;
      $scope.pending_total = $scope.summary.pending_retry;

    }).error(function(data) {
          $scope.message = data.message || "Request failed";
          $scope.messagedetails = data.message_detail;
          $scope.showError = true;
    });

    consumerService.getStats($scope.urlbase, $scope.apiversion, $scope.sub_account_id, $scope.application_id, $scope.bucket_id, $scope.input_id, moment(moment().subtract('hours',24)).utc().format('X'), moment(moment()).utc().format('X'), 'hour').success(function(data) {
      $scope.summary = data.summary;
      $scope.detail = data.detail;

      $scope.daily_volume_total = $scope.summary.outgoing_messages;
      $scope.daily_success_total = $scope.summary.outgoing_successful;
      $scope.daily_failure400_total = $scope.summary.outgoing_400;
      $scope.daily_failure500_total = $scope.summary.outgoing_500;
      $scope.daily_filtered_total = $scope.summary.filtered;

      for(var d=0;d<$scope.detail.length;d++){
        $scope.daily_volume.push($scope.detail[d].outgoing_messages);
        $scope.daily_success.push($scope.detail[d].outgoing_successful);
        $scope.daily_failure400.push($scope.detail[d].outgoing_400);
        $scope.daily_failure500.push($scope.detail[d].outgoing_500);
        $scope.daily_filtered.push($scope.detail[d].filtered);
      }

      if(($scope.daily_success_total + $scope.daily_failure400_total + $scope.daily_failure500_total) > 0) {
        $scope.daily_deliverability = Math.round($scope.daily_success_total / ($scope.daily_success_total + $scope.daily_failure400_total + $scope.daily_failure500_total) * 100);
      }

      $scope.daily_failure_total = $scope.daily_failure400_total + $scope.daily_failure500_total;


    }).error(function(data) {
          $scope.message = data.message || "Request failed";
          $scope.messagedetails = data.message_detail;
          $scope.showError = true;
    });
    
      

  }])



// ===================================================================
// Introduction Controller
// ===================================================================
    .controller('IntroductionCtrl', ['$scope', '$location', '$http', 'consumerService', function($scope, $location, $http, consumerService) {

    consumerService.getIntroductionText($scope.introduction_url).success(function(data) {
        $scope.intro_text = $scope.parseMarkdown(data);
      }).error(function(data) {
            $scope.intro_text = "<p>Introduction text not available.</p>";
      });





  }])



// ===================================================================
// Log Controller
// ===================================================================
    .controller('LogCtrl', ['$scope', '$location', '$http', 'consumerService', function($scope, $location, $http, consumerService) {

    // Default authorization
    $http.defaults.headers.common.Authorization = 'client-token-bearer ' + $scope.api_token;


    $scope.start_date = moment(moment().subtract('hours',24)).utc();
    $scope.end_date = moment(moment()).utc();

    $scope.date_range_opts = {
      format: 'YYYY-MM-DD',
      startDate:$scope.start_date,
      endDate:$scope.end_date,
      showDropdowns: true,
      showWeekNumbers: true,
      timePicker: true,
      timePickerIncrement: 15,
      timePicker12Hour: true,
      ranges: {
        'Last 10 Minutes': [moment(moment().subtract('minutes',10)), moment(moment())],
        'Last 30 Minutes': [moment(moment().subtract('minutes',30)).utc(), moment(moment()).utc()],
        'Last Hour': [moment(moment().subtract('hours',1)).utc(), moment(moment()).utc()],
        'Last 24 Hours': [moment(moment().subtract('hours',24)).utc(), moment(moment()).utc()],
        'Last 48 Hours': [moment(moment().subtract('hours',48)).utc(), moment(moment()).utc()],
        'Last 7 Days': [moment(moment({hour: 0, minute: 0}).subtract('days',7)).utc(),moment(moment({hour: 0, minute: 0}).add('days',1)).utc()],
      },
      opens: 'left',
      
    };

    $scope.$watch('date_range', function(newVal) {
        if (newVal) {
              consumerService.getLog($scope.urlbase, $scope.apiversion, $scope.sub_account_id, $scope.bucket_id, $scope.input_id, moment($scope.start_date).format('X'), moment($scope.end_date).format('X')).success(function(data) {
                $scope.requests = data.results.requests;
              }).error(function(data) {
                    $scope.message = data.message || "Request failed";
                    $scope.messagedetails = data.message_detail;
                    $scope.showError = true;
              });
        }
   });

    $scope.date_range = moment($scope.start_date).format('MMMM Do YYYY HH:mm UTC') + ' - ' + moment($scope.end_date).format('MMMM Do YYYY HH:mm UTC');



  }])



// ===================================================================
// Message Controller
// ===================================================================
    .controller('MessageCtrl', ['$scope', '$location', '$http', 'consumerService', function($scope, $location, $http, consumerService) {

    // Default authorization
    $http.defaults.headers.common.Authorization = 'client-token-bearer ' + $scope.api_token;

    if($scope.passedid === undefined) {
      $scope.changePage('logs');
    } else {
      $scope.outgoing_message_id = $scope.passedid;
    }

    //Get the message detail:
    consumerService.getOutgoingMessage($scope.urlbase, $scope.apiversion, $scope.sub_account_id, $scope.outgoing_message_id).success(function(data) {
      $scope.message_details = data;
      if($scope.message_details.attempts.length > 0) {
        
        $scope.attempt_id = $scope.message_details.attempts[0].attempt_id;

        // Get the first attempt
        consumerService.getOutgoingMessageAttempt($scope.urlbase, $scope.apiversion, $scope.sub_account_id, $scope.attempt_id).success(function(data) {
          $scope.attempt_details = data.detail.response;
        }).error(function(data) {
              $scope.message = data.message || "Request failed";
              $scope.messagedetails = data.message_detail;
              $scope.showError = true;
        });
      }
    }).error(function(data) {
          $scope.message = data.message || "Request failed";
          $scope.messagedetails = data.message_detail;
          $scope.showError = true;
    });

    $scope.resend = function() {

        var postdata = $.param({
            outgoing_message_ids: $scope.outgoing_message_id
        });

        consumerService.resendOutgoingMessage($scope.urlbase, $scope.apiversion, $scope.sub_account_id, postdata).success(function(data) {
           
            $scope.showMessage({
                title: 'Success',
                text: 'Request has been resent as a new request.  Please refresh the log to pull an updated list'
            });
        }).error(function(data) {
            $scope.message = data.message || "Request failed";
            $scope.messagedetails = data.message_detail;
            $scope.showError = true;
        });
    };
   

  }])



// ===================================================================
// Destination Controller
// ===================================================================
    .controller('DestinationCtrl', ['$scope', '$location', '$http', 'consumerService', function($scope, $location, $http, consumerService) {

    // Default authorization
    $http.defaults.headers.common.Authorization = 'client-token-bearer ' + $scope.api_token;

    //Get the list of events:
    consumerService.getDestinations($scope.urlbase, $scope.apiversion, $scope.sub_account_id, $scope.input_id).success(function(data) {
      $scope.destinations = data.destinations;
    }).error(function(data) {
          $scope.message = data.message || "Request failed";
          $scope.messagedetails = data.message_detail;
          $scope.showError = true;
    });

  }])



// ===================================================================
// Destination Add Controller
// ===================================================================
  .controller('DestinationAddCtrl', ['$scope', '$location', '$http', 'consumerService', function($scope, $location, $http, consumerService) {

  // Default authorization
  $http.defaults.headers.common.Authorization = 'client-token-bearer ' + $scope.api_token;

  //Default event array;
  $scope.events = [];

  $scope.authproperties = {};
  $scope.deliveryoptions = [{option: 'random',name: 'Asynchronous'}];
  $scope.verify_ssl_options = [{option: 'true',name: 'Yes - ensure SSL cert is valid'}, {option: 'false',name: 'No - bypass validation checks on SSL cert'}];

  //Get Application Events
  consumerService.getAppVersions($scope.urlbase, $scope.apiversion, $scope.account_id, $scope.application_id).success(function(data) {
    $scope.versions = [];
    for(var v=0; v<data.versions.length; v++) {
      if(data.versions[v].active) {
        $scope.versions.push(data.versions[v]);
      }
    }
    $scope.application_version_id = $scope.versions[($scope.versions.length-1)].version_id;
  }).error(function(data) {
        $scope.message = data.message || "Request failed";
        $scope.messagedetails = data.message_detail;
        $scope.showError = true;
  });

  //Get Auth Options Events
  consumerService.getAuthOptions($scope.urlbase, $scope.apiversion, 'destination').success(function(data) {
      $scope.authoptionList = data;
      $scope.authoptions = [];
      for (var key in data) {
           data[key].type = key;
           $scope.authoptions.push(data[key]);
      }
  }).error(function(data) {
      $scope.message = data.message || "Request failed";
      $scope.messagedetails = data.message_detail;
      $scope.showError = true;
  });

  consumerService.getRetryPolicies($scope.urlbase, $scope.apiversion).success(function(data) {
        $scope.policies = data.policies;
        $scope.show_policy_details = false;
   }).error(function(data) {
        $scope.message = data.message || "Request failed";
        $scope.messagedetails = data.message_detail;
        $scope.showError = true;
   });


   $scope.$watch('version_id', function(newVal) {
        if (newVal) {
             for(var v=0; v<$scope.versions.length; v++) {
                if($scope.versions[v].version_id == newVal) {
                  for(var i=0; i<$scope.versions[v].version_json.events.options.length;i++) {
                    for(var x=0; x<$scope.versions[v].version_json.events.options[i].events.length;x++) {
                      $scope.events.push($scope.versions[v].version_json.events.options[i].events[x]);
                    }
                  }
                }
              }
        } else {
             $scope.events = [];
        }
   });


   $scope.$watch('authentication_type', function(newVal) {
        if (newVal && $scope.authoptionList[newVal].properties) {
             for(var i=0;i<$scope.authoptionList[newVal].properties.length;i++) {
                  if($scope.authoptionList[newVal].properties[i].options && Object.prototype.toString.call( $scope.authoptionList[newVal].properties[i].options ) === '[object Object]') {
              
                       $scope.authoptionList[newVal].properties[i].selectType = true;
              
                       $scope.authoptionList[newVal].properties[i].aOptions= [];
                       for (var key in $scope.authoptionList[newVal].properties[i].options) {
                            $scope.authoptionList[newVal].properties[i].options[key].option_id = key;
                            $scope.authoptionList[newVal].properties[i].aOptions.push($scope.authoptionList[newVal].properties[i].options[key]);
                       }

                  } else {
                       $scope.authoptionList[newVal].properties[i].selectType = false;
                  }
             }

             $scope.properties = $scope.authoptionList[newVal].properties;
             $scope.resizeFrame();
        } else {
             $scope.properties = [];
             $scope.resizeFrame();
        }
   });


   $scope.$watch('retry_policy_id', function(newVal) {
        $( '#form' ).parsley( 'removeItem', '#retry_count' );
        $( '#form' ).parsley( 'removeItem', '#retry_interval' );
        $( '#retry_count' ).parsley( 'removeConstraint', 'required' );
        $( '#retry_interval' ).parsley( 'removeConstraint', 'required' );
        $( '#retry_count' ).parsley( 'removeConstraint', 'number' );
        $( '#retry_interval' ).parsley( 'removeConstraint', 'number' );
        $( '#retry_count' ).parsley( 'removeConstraint', 'mincheck' );
        $( '#retry_count' ).parsley( 'removeConstraint', 'maxcheck' );
        $( '#retry_interval' ).parsley( 'removeConstraint', 'maxcheck' );
        if(newVal) {
             for(var i=0;i<$scope.policies.length;i++) {
                  if($scope.policies[i].policy_id == newVal) {
                       if($scope.policies[i].max_retry_count === null){
                            $scope.show_policy_details = false;
                            $scope.retry_count = '';
                            $scope.retry_interval = '';
                       } else {
                            $scope.show_policy_details = true;
                            $scope.retry_count_min = 1;
                            $scope.retry_count_max = $scope.policies[i].max_retry_count;
                            $scope.retry_interval_min = $scope.policies[i].min_interval;
                            $( '#form' ).parsley( 'addItem', '#retry_count' );
                            $( '#retry_count' ).parsley( 'addConstraint', { required: true , type: 'number', min: 1, max: $scope.policies[i].max_retry_count} );
                            $( '#retry_count' ).parsley( 'addConstraint', { maxcheck: $scope.policies[i].max_retry_count } );

                            $( '#form' ).parsley( 'addItem', '#retry_interval' );
                            $( '#retry_interval' ).parsley( 'addConstraint', { required: true, type: 'number', min: $scope.policies[i].min_interval } );
                       }
                  }
             }
             
        }
   });

    $scope.submit = function() {

          $scope.showError = false;

          if($('#form').parsley().isValid()) {

               $scope.returnproperties = [];
               for (var key in $scope.authproperties) {
                    $scope.returnproperties.push('{' + key + ':' + $scope.authproperties[key] + '}');
               }

               $scope.authproperties.type = $scope.authentication_type;
               $scope.transformation = '';

               //Set the params into a JSON string
               var postdata =  $.param({
                    bucket_key: $scope.bucket_key,
                    application_id: $scope.application_id,
                    application_version_id: $scope.application_version_id,
                    name: $scope.name,
                    endpoint_url : $scope.endpoint_url,
                    delivery_order : $scope.delivery_order,
                    transformation : $scope.transformation,
                    retry_policy_id : $scope.retry_policy_id,
                    retry_interval : $scope.retry_interval,
                    retry_count : $scope.retry_count,
                    authentication : $scope.authproperties,
                    verify_ssl : $scope.verify_ssl,
                    event_filters : $scope.event,
                    alert_on_failure : $scope.email_address
               });
               
               consumerService.createDestination($scope.urlbase, $scope.apiversion, $scope.sub_account_id, $scope.input_id, postdata).success(function(data) {
                    $scope.showMessage({title:'Success', text: 'The destination has been created!'});
                    $scope.changePage('destinations');
               }).error(function(data) {
                    $scope.message = data.message || "Request failed";
                    $scope.messagedetails = data.message_detail;
                    $scope.showError = true;
                    $scope.resizeFrame();
               });
          }
          
     };

    $scope.cancel = function() {
      $scope.changePage('destinations');
    };
  

  
    

  }])



// ===================================================================
// Destination Edit
// ===================================================================
.controller('DestinationEditCtrl', ['$scope', '$location', '$http', 'consumerService', function($scope, $location, $http, consumerService) {

  if($scope.passedid === undefined) {
    $scope.changePage('destinations');
  } else {
    $scope.destination_id = $scope.passedid;
  }

  // Default authorization
  $http.defaults.headers.common.Authorization = 'client-token-bearer ' + $scope.api_token;

  //Default event array;
  $scope.events = [];

  $scope.authproperties = {};
  $scope.deliveryoptions = [{option: 'random',name: 'Asynchronous'}];
  $scope.verify_ssl_options = [{option: 'true',name: 'Yes - ensure SSL cert is valid'}, {option: 'false',name: 'No - bypass validation checks on SSL cert'}];

  //Get Application Events
  consumerService.getAppVersions($scope.urlbase, $scope.apiversion, $scope.account_id, $scope.application_id).success(function(data) {
    $scope.versions = [];
    for(var v=0; v<data.versions.length; v++) {
      if(data.versions[v].active) {
        $scope.versions.push(data.versions[v]);
      }
    }


    //Get Auth Options Events
    consumerService.getAuthOptions($scope.urlbase, $scope.apiversion, 'destination').success(function(data) {
        $scope.authoptionList = data;
        $scope.authoptions = [];
        for (var key in data) {
             data[key].type = key;
             $scope.authoptions.push(data[key]);
        }

        //Get retry Policies
        consumerService.getRetryPolicies($scope.urlbase, $scope.apiversion).success(function(data) {
              $scope.policies = data.policies;
              $scope.show_policy_details = false;


              //Get Output
              consumerService.getDestination($scope.urlbase, $scope.apiversion, $scope.sub_account_id, $scope.destination_id).success(function(data) {
                    $scope.name = data.name;
                    $scope.version_id = data.application_version_id;
                    if(data.event_filters.length) {
                      $scope.event = data.event_filters[0];
                    }
                    $scope.email_address = data.alert_on_failure;
                    $scope.endpoint_url = data.endpoint_url;
                    $scope.delivery_order = data.delivery_order;
                    $scope.transformation = data.transformation;
                    $scope.retry_policy_id = data.retries.policy_id;
                    $scope.retry_count = data.retries.count;
                    $scope.retry_interval = data.retries.interval;
                    
                    if (data.verify_ssl !== undefined && data.verify_ssl !== null) {
                      if (data.verify_ssl === true) {
                          $scope.verify_ssl = "true";
                      } else {
                          $scope.verify_ssl = "false";
                      }
                    } else {
                        $scope.verify_ssl = "true";
                    }
                    $scope.authentication_type = data.authentication.type;
                    $scope.date_created = data.date_created;
                    $scope.date_updated = data.date_updated;
                    if(data.authentication.properties) {
                         for(var i=0; i < data.authentication.properties.length; i++) {
                              for(var property in data.authentication.properties[i]) {
                                   $scope.authproperties[property] = data.authentication.properties[i][property];
                              }
                         }
                    }
               }).error(function(data) {
                    $scope.message = data.message || "Request failed";
                    $scope.messagedetails = data.message_detail;
               });



         }).error(function(data) {
              $scope.message = data.message || "Request failed";
              $scope.messagedetails = data.message_detail;
              $scope.showError = true;
         });


    }).error(function(data) {
        $scope.message = data.message || "Request failed";
        $scope.messagedetails = data.message_detail;
        $scope.showError = true;
    });


  }).error(function(data) {
        $scope.message = data.message || "Request failed";
        $scope.messagedetails = data.message_detail;
        $scope.showError = true;
  });

  $scope.$watch('version_id', function(newVal) {
        if (newVal) {
             for(var v=0; v<$scope.versions.length; v++) {
                if($scope.versions[v].version_id == newVal) {
                  for(var i=0; i<$scope.versions[v].version_json.events.options.length;i++) {
                    for(var x=0; x<$scope.versions[v].version_json.events.options[i].events.length;x++) {
                      $scope.events.push($scope.versions[v].version_json.events.options[i].events[x]);
                    }
                  }
                }
              }
        } else {
             $scope.events = [];
        }
   });

   $scope.$watch('authentication_type', function(newVal) {
        if (newVal && $scope.authoptionList[newVal].properties) {
             for(var i=0;i<$scope.authoptionList[newVal].properties.length;i++) {
                  if($scope.authoptionList[newVal].properties[i].options && Object.prototype.toString.call( $scope.authoptionList[newVal].properties[i].options ) === '[object Object]') {
              
                       $scope.authoptionList[newVal].properties[i].selectType = true;
              
                       $scope.authoptionList[newVal].properties[i].aOptions= [];
                       for (var key in $scope.authoptionList[newVal].properties[i].options) {
                            $scope.authoptionList[newVal].properties[i].options[key].option_id = key;
                            $scope.authoptionList[newVal].properties[i].aOptions.push($scope.authoptionList[newVal].properties[i].options[key]);
                       }

                  } else {
                       $scope.authoptionList[newVal].properties[i].selectType = false;
                  }
             }

             $scope.properties = $scope.authoptionList[newVal].properties;
             $scope.resizeFrame();
        } else {
             $scope.properties = [];
             $scope.resizeFrame();
        }
   });


   $scope.$watch('retry_policy_id', function(newVal) {
        $( '#form' ).parsley( 'removeItem', '#retry_count' );
        $( '#form' ).parsley( 'removeItem', '#retry_interval' );
        $( '#retry_count' ).parsley( 'removeConstraint', 'required' );
        $( '#retry_interval' ).parsley( 'removeConstraint', 'required' );
        $( '#retry_count' ).parsley( 'removeConstraint', 'number' );
        $( '#retry_interval' ).parsley( 'removeConstraint', 'number' );
        $( '#retry_count' ).parsley( 'removeConstraint', 'mincheck' );
        $( '#retry_count' ).parsley( 'removeConstraint', 'maxcheck' );
        $( '#retry_interval' ).parsley( 'removeConstraint', 'maxcheck' );
        if(newVal) {
             for(var i=0; i<$scope.policies.length;i++) {
                  if($scope.policies[i].policy_id == newVal) {
                       if($scope.policies[i].max_retry_count === null){
                            $scope.show_policy_details = false;
                            $scope.retry_count = '';
                            $scope.retry_interval = '';
                       } else {
                            $scope.show_policy_details = true;
                            $scope.retry_count_min = 1;
                            $scope.retry_count_max = $scope.policies[i].max_retry_count;
                            $scope.retry_interval_min = $scope.policies[i].min_interval;
                            $( '#form' ).parsley( 'addItem', '#retry_count' );
                            $( '#retry_count' ).parsley( 'addConstraint', { required: true , type: 'number', min: 1, max: $scope.policies[i].max_retry_count} );
                            $( '#retry_count' ).parsley( 'addConstraint', { maxcheck: $scope.policies[i].max_retry_count } );

                            $( '#form' ).parsley( 'addItem', '#retry_interval' );
                            $( '#retry_interval' ).parsley( 'addConstraint', { required: true, type: 'number', min: $scope.policies[i].min_interval } );
                       }
                  }
             }
             
        }
   });

    $scope.submit = function() {

          $scope.showError = false;
          
          if($('#form').parsley().isValid()) {

               $scope.returnproperties = [];
               for (var key in $scope.authproperties) {
                    $scope.returnproperties.push('{' + key + ':' + $scope.authproperties[key] + '}');
               }

               $scope.authproperties.type = $scope.authentication_type;
               $scope.transformation = '';

               //Set the params into a JSON string
               var postdata =  $.param({
                    bucket_key: $scope.bucket_key,
                    application_version_id: $scope.version_id,
                    name: $scope.name,
                    endpoint_url : $scope.endpoint_url,
                    delivery_order : $scope.delivery_order,
                    transformation : $scope.transformation,
                    retry_policy_id : $scope.retry_policy_id,
                    retry_interval : $scope.retry_interval,
                    retry_count : $scope.retry_count,
                    authentication : $scope.authproperties,
                    verify_ssl : $scope.verify_ssl,
                    event_filters : $scope.event,
                    alert_on_failure : $scope.email_address
               });
               
               consumerService.updateDestination($scope.urlbase, $scope.apiversion, $scope.sub_account_id, $scope.destination_id, postdata).success(function(data) {
                    $scope.showMessage({title:'Success', text: 'The destination has been updated successfully!'});
                    $scope.changePage('destinations');
               }).error(function(data) {
                    $scope.message = data.message || "Request failed";
                    $scope.messagedetails = data.message_detail;
                    $scope.showError = true;
                    $scope.resizeFrame();
               });
          }
          
     };

    $scope.cancel = function() {
      $scope.changePage('destinations');
    };


    $scope.delete = function($destination_id) {
       consumerService.deleteDestination($scope.urlbase, $scope.apiversion, $scope.sub_account_id, $scope.destination_id).success(function(data) {
            $scope.showMessage({title:'Success', text: 'The destination has been deleted!'});
            $scope.changePage('destinations');
       }).error(function(data) {
            $scope.message = data.message || "Request failed";
            $scope.messagedetails = data.message_detail;
            $scope.showError = true;
            $scope.resizeFrame();
       });
    };
  
   

  
    

  }]);
