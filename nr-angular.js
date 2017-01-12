

(function(angular, NREUM) {

  if (typeof NREUM === 'undefined' && typeof NREUM.interaction !== 'function' ) {
    console.log('api missing');
    return;
  }
  var myInteraction;

  function debounce(fn, delay) {
    var timer = null;
    return function () {
      var context = this, args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(context, args);
      }, delay);
    };
  };

  var NewrelicTiming = function() {
    this.marks = {};
    this.NREUM = NREUM;
    var _this = this;
    this.debounceTime = 500;
    this.mark = function(name) {
      this.marks[name] = +new Date();
    };

    this.measure = function(markName, against) {
      var compareTime, referenceTime;

      if (against) {
        referenceTime = this.marks[against];
        compareTime = this.marks[markName];
      } else {
        referenceTime = this.marks[markName];
        compareTime = +new Date();
      }

      return compareTime - referenceTime;
    };

    this.sendNRBeacon = function(fragmentName) {
      if (!this.checkBeaconRequirements()) {
        return;
      }

      fragmentName || (fragmentName = window.location.hash.substring(1));

      fragmentName = fragmentName.replace(/\/[0-9]+\//g, '/*/').replace(/\/[0-9]+$/, '/*');
      myInteraction.setName(fragmentName);
      var navEnd = this.measure('navEnd', 'navStart');
      var renderTime = this.measure('pageRendered', 'navStart');
      myInteraction.setAttribute('appTime', navEnd);
      myInteraction.setAttribute('renderTime', renderTime - this.debounceTime);
      this.marks['navStart'] = null;
    };


  };

  if (typeof angular === 'undefined' || angular === null || typeof angular.module !== 'function') {
    return;
  }

  

  

 

  var newrelicTiming = new NewrelicTiming();
  var module = angular.module('newrelic-timing', []).factory('$exceptionHandler', function() {
    return function(exception, cause) {
      exception.message += ' (caused by "' + cause + '")';
      console.log("Caught error: " + exception);
      NREUM.noticeError(exception);
    };
  });
  
  // var module = angular.module('newrelic-timing', []).
  //   config(function($httpProvider) {
  //     $httpProvider.interceptors.push(function($q) {
  //       return {

  //         response: function (response) {
  //           return response || $q.when(response);
  //         },

  //         // On response failture
  //         responseError: function (rejection) {
  //           // console.log(rejection);
  //           return $q.reject(rejection);
  //         }
  //       };
  //     });
  // });

  if (typeof module.run !== 'function') {
    return;
  }

  module.run(['$rootScope', '$location', function($rootScope, $location) {
    

    function changeStart(){
      myInteraction = newrelic.interaction();
      newrelicTiming.mark('navStart');
    }
    function changeSuccess() {
      newrelicTiming.mark('navEnd');
    }
    // ngRoute
    $rootScope.$on('$routeChangeStart', changeStart);
    $rootScope.$on('$routeChangeSuccess', changeSuccess);

    // ui-router
  
    $rootScope.$on('$stateChangeStart', changeStart);
    $rootScope.$on('$stateChangeSuccess', changeSuccess);

    //debounced render

    var loaded = debounce(function(){
      newrelicTiming.mark('pageRendered');
      newrelicTiming.sendNRBeacon($location.path());
    }, newrelicTiming.debounceTime);
    $rootScope.$on('$viewContentLoaded', loaded);
    
   
    

  }]);





    

})(window.angular, window.NREUM);