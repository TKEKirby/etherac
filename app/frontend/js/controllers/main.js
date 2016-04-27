'use strict';

angular.module('etherac')
.controller('MainCtrl', ['$rootScope', '$interval', 'ApiService', 'DataService', 'SpeechService', function ($rootScope,$interval,ApiService,DataService,SpeechService) {

  var getTimeString = function(t){
    console.log(t);
    var time = new Date(t);
    console.log(time);
    return new Date(time);
  };


  /*
	* Description:
	* Kill previous Artyom instances and start fresh
	* Params: none
	* Return: none
	*/
  function startContinuousArtyom(){
    artyom.fatality();// use this to stop any of

    setTimeout(function(){// if you use artyom.fatality , wait 250 ms to initialize again.
      artyom.initialize({
        lang:'en-US',// A lot of languages are supported. Read the docs !
        continuous:true,// Artyom will listen forever
        listen:true, // Start recognizing
        debug:true, // Show everything in the console
        speed:'1' // talk normally
      });
      SpeechService.setupSpeech();
    },250);
  }


  /*
	* Description:
	* If the location can be provided by the browser get weather data.
	* Params: geolocation from chrome browser
	* Return: none
	*/
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position){
      $rootScope.$apply(function(){
        var pos = {
          lat : position.coords.latitude.toFixed(), //latitude
          lon : position.coords.longitude.toFixed() //longitude
        };
        DataService.getWeather(pos).then(function (response) {
          $rootScope.weather = response.currently;
          $rootScope.today = response.daily.data[0];
          $rootScope.tomorrow = response.daily.data[1];

          $rootScope.sunrise = getTimeString($rootScope.today.sunriseTime);
          $rootScope.sunset = getTimeString($rootScope.today.sunsetTime);
        });
      });
    });
  }


  /*
	* Description:
	* Keep the date and time current
	* Params: none
	* Return: none
	*/
  $interval(
    function() {
      var d = new Date();
      $rootScope.curTime.time = DataService.getTime();
      $rootScope.curTime.day = DataService.getDay();
      $rootScope.curTime.dayNumber = DataService.getDayNumber();
      $rootScope.curTime.month = DataService.getMonth();
      $rootScope.curTime.year = DataService.getYear();
      $rootScope.curTime.fullDate = d.toString();
    }, 1000
  );


  $rootScope.pageTitle = 'Homepage';
  $rootScope.curTime = {};
  $rootScope.curTime.time = DataService.getTime();
  $rootScope.curTime.day = DataService.getDay();
  $rootScope.curTime.dayNumber = DataService.getDayNumber();
  $rootScope.curTime.month = DataService.getMonth();
  $rootScope.curTime.year = DataService.getYear();


  startContinuousArtyom();

}]);
