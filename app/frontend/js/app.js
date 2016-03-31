'use strict';

var app = angular.module('etherac', [
  'ngRoute',
  'ngResource',
  'ngCookies',
  'ngTouch',
  'ngSanitize',
  'ui.bootstrap'
]);


app.config(['$routeProvider', '$locationProvider', '$httpProvider',

  function ($routeProvider, $locationProvider, $httpProvider) {


    var isLoggedIn = function ($q, $timeout, $http, $rootScope, $location) {
        var deferred = $q.defer();
        $http.get('/signedin').success(function (user) {
            if (user !== '0') {
                $rootScope.isSignedIn = true;
                $rootScope.currentUser = user;
                $timeout(deferred.resolve, 0);
            } else {
                $rootScope.isSignedIn = false;
                $rootScope.currentUser = {};
                $timeout(function() { deferred.reject();}, 0);
                $location.url('/');
            }
        });
        return deferred.promise;
    };


  $httpProvider.interceptors.push('InterceptorService');


  $routeProvider
    .when('/', {
      templateUrl: 'views/main.html',
      controller: 'MainCtrl'
    })
    .when('/404', {
      templateUrl: 'views/404.html',
      controller: '404Ctrl'
    })
    .when('/admin', {
      templateUrl: 'views/admin.html',
      controller: 'AdminCtrl',
      resolve: {loggedin: isLoggedIn}
    })
    .otherwise({
      redirectTo: '/404'
    });


  $locationProvider.html5Mode(true);

}]);
