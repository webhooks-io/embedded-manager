'use strict';

/* Controllers */

angular.module('webhooksio.controllers', [])
  .controller('WebhookCtrl', ['$scope', '$location', '$http', '$templateCache', 'consumerService', function($scope, $location, $http, $templateCache, consumerService) {

  $scope.getURLParams = function() {

    $scope.params = {};
    var urlparams = window.location.search.split("?")[1].split("&");

    for(var i = 0; i < urlparams.length; i++){
      var parr = urlparams[i].split("=");
      $scope.params[decodeURIComponent(parr[0])] = decodeURIComponent(parr[1]);
    }

  }

  // handles resizing the window if anything changes...
  $scope.$watch(function() {
    $scope.resizeFrame();
  });


  $.listen('parsley:form:validated', function(){
    $scope.resizeFrame();
  })

  
  $scope.changePage = function($page, $id) {
    $scope.passedid = $id;
    $scope.currentview = $page;
  }

  //Get URL Parameters
  $scope.getURLParams();

//Default Values
  if(!$scope.params.url_base){
    $scope.urlbase = 'http://api.dev.webhooks.io';
  }else{
    $scope.urlbase = $scope.params.url_base;
  }

  if(!$scope.params.api_version){
    $scope.apiversion = 'v1';
  }else{
    $scope.apiversion = $scope.params.api_version;
  }

  if($scope.params.show_introduction == 'no-destinations'){
    $scope.show_introduction = true;
  }else if($scope.params.show_introduction){
    if($scope.params.show_introduction === "true"){
      $scope.show_introduction = true;
    }else{
      $scope.show_introduction = false;
    }
  }else if(!$scope.params.show_introduction){
    $scope.show_introduction = true;
  }else{
    $scope.show_introduction = true;
  }

  if((!$scope.params.default_tab || $scope.params.default_tab == 'introduction') && !$scope.show_introduction){
    $scope.params.default_tab = 'dashboard';
  }

  if(!$scope.params.default_tab){
    $scope.currentview = 'introduction';
  }else{
    $scope.currentview = $scope.params.default_tab;
  }

  $scope.account_id = $scope.params.account_id;
  $scope.application_id = $scope.params.application_id;
  $scope.consumer_id = $scope.params.consumer_id;
  $scope.api_token = $scope.params.token;
  $scope.bucket_key = $scope.params.bucket_key;


  // Default authorization
  $http.defaults.headers.common.Authorization = 'client-token-bearer ' + $scope.api_token;

  
  	

  }])
  .controller('DestinationCtrl', ['$scope', '$location', '$http', 'consumerService', function($scope, $location, $http, consumerService) {

  // Default authorization
  $http.defaults.headers.common.Authorization = 'client-token-bearer ' + $scope.api_token;

  //Get the list of events:
  consumerService.getOutputs($scope.urlbase, $scope.apiversion, $scope.account_id, $scope.application_id, $scope.consumer_id, $scope.bucket_key).success(function(data) {
    console.log(data);
    $scope.outputs = data.outputs; 
  }).error(function(data) {
        $scope.message = data.message || "Request failed";
        $scope.messagedetails = data.message_detail;
        $scope.showError = true;
  });

  

  
    

  }])
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
  consumerService.getAuthOptions($scope.urlbase, $scope.apiversion).success(function(data) {
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
                       if($scope.policies[i].max_retry_count == null){
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
               
               consumerService.createOutput($scope.urlbase, $scope.apiversion, $scope.account_id, $scope.application_id, $scope.consumer_id, postdata).success(function(data) {
                    $scope.showMessage({title:'Success', text: 'The output has been created!'});
                    $scope.changePage('destinations');
               }).error(function(data) {
                    $scope.message = data.message || "Request failed";
                    $scope.messagedetails = data.message_detail;
                    $scope.showError = true;
                    $scope.resizeFrame();
               });
          }
          
     }

    $scope.cancel = function() {
      $scope.changePage('destinations');
    }
  

  
    

  }])
.controller('DestinationEditCtrl', ['$scope', '$location', '$http', 'consumerService', function($scope, $location, $http, consumerService) {

  if($scope.passedid === undefined) {
    $scope.changePage('destinations');
  } else {
    $scope.output_id = $scope.passedid;
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
    consumerService.getAuthOptions($scope.urlbase, $scope.apiversion).success(function(data) {
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
              consumerService.getOutput($scope.urlbase, $scope.apiversion, $scope.account_id, $scope.application_id, $scope.consumer_id, $scope.bucket_key, $scope.output_id).success(function(data) {
                    $scope.name = data.name;
                    $scope.version_id = data.application_version_id;
                    if(data.event_filters.length) {
                      $scope.event = data.event_filters[0];
                    }
                    $scope.email_address = data.alert_on_failure;
                    $scope.endpoint_url = data.endpoint_url;
                    $scope.delivery_order = data.delivery_order;
                    $scope.transformation = data.transformation;
                    $scope.retry_policy_id = data.retry_policy_id;
                    $scope.retry_count = data.retry_count;
                    $scope.retry_interval = data.retry_interval;
                    
                    if(data.verify_ssl){
                         $scope.verify_ssl = data.verify_ssl;
                    }else{
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
                       if($scope.policies[i].max_retry_count == null){
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
               
               consumerService.updateOutput($scope.urlbase, $scope.apiversion, $scope.account_id, $scope.application_id, $scope.consumer_id, $scope.output_id, postdata).success(function(data) {
                    $scope.showMessage({title:'Success', text: 'The output has been updated successfully!'});
                    $scope.changePage('destinations');
               }).error(function(data) {
                    $scope.message = data.message || "Request failed";
                    $scope.messagedetails = data.message_detail;
                    $scope.showError = true;
                    $scope.resizeFrame();
               });
          }
          
     }

    $scope.cancel = function() {
      $scope.changePage('destinations');
    }


    $scope.delete = function($output_id) {
       consumerService.deleteOutput($scope.urlbase, $scope.apiversion, $scope.account_id, $scope.application_id, $scope.consumer_id, $output_id).success(function(data) {
            $scope.showMessage({title:'Success', text: 'The destination has been deleted!'});
            $scope.changePage('destinations');
       }).error(function(data) {
            $scope.message = data.message || "Request failed";
            $scope.messagedetails = data.message_detail;
            $scope.showError = true;
            $scope.resizeFrame();
       });
    }
  
   

  
    

  }]);
