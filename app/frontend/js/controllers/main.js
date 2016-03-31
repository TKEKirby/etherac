'use strict';

angular.module('etherac')
.controller('MainCtrl', ['$rootScope', '$interval', 'ApiService', 'SpeechService', function ($rootScope,$interval,ApiService,SpeechService) {

  $rootScope.pageTitle = 'Homepage';

  function startContinuousArtyom(){
    artyom.fatality();// use this to stop any of

    setTimeout(function(){// if you use artyom.fatality , wait 250 ms to initialize again.
      artyom.initialize({
        lang:"en-US",// A lot of languages are supported. Read the docs !
        continuous:true,// Artyom will listen forever
        listen:true, // Start recognizing
        debug:true, // Show everything in the console
        speed:1 // talk normally
      });
      SpeechService.setupSpeech();
    },250);
  }


  $interval(
    function() {
      var d = new Date();
      $rootScope.curTime.time = getTime();
      $rootScope.curTime.day = getDay();
      $rootScope.curTime.dayNumber = getDayNumber();
      $rootScope.curTime.month = getMonth();
      $rootScope.curTime.year = getYear();
      $rootScope.curTime.fullDate = d.toString();
    }, 1000
  );

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position){
      $rootScope.$apply(function(){
        var pos = {
          lat : position.coords.latitude.toFixed(),
          lon : position.coords.longitude.toFixed()
        };
        ApiService.getweather(pos).then(function (response) {
          $rootScope.weather = response;
          $rootScope.weather.sunrise = {};
          $rootScope.weather.sunset = {};
          $rootScope.weather.main.temp = $rootScope.weather.main.temp * 9 / 5 - 459.67;
          $rootScope.weather.main.temp = $rootScope.weather.main.temp.toFixed([1]);
          var r = new Date($rootScope.weather.sys.sunrise * 1000);
          $rootScope.weather.sunrise.hours = r.getHours();
          if (r.getMinutes() < 10) {
            $rootScope.weather.sunrise.min = '0';
            $rootScope.weather.sunrise.min += r.getMinutes().toString();
          }
          else {
            $rootScope.weather.sunrise.min = r.getMinutes().toString();
          }
          var s = new Date($rootScope.weather.sys.sunset * 1000);
          $rootScope.weather.sunset.hours = s.getHours() - 12;
          $rootScope.weather.sunset.min = s.getMinutes();
          if (s.getMinutes() < 10) {
            $rootScope.weather.sunset.min = '0';
            $rootScope.weather.sunset.min += s.getMinutes().toString();
          }
          else {
            $rootScope.weather.sunset.min = s.getMinutes().toString();
          }
          $rootScope.weather.icon = 'frontend/img/weatherIcons/' + $rootScope.weather.weather[0].icon + '.png';
        });
      });
    });
  }

  function getYear() {
    var year = new Date().getFullYear();
    return year;
  }

  function getDayNumber() {
    var dayNumber = new Date().getDate();
    return dayNumber;
  }

  function getTime() {
    var time = {};
    var t = new Date();
    time.hours = t.getHours().toString();
    if (t.getMinutes() < 10) {
      time.min = '0';
      time.min += t.getMinutes().toString();
    }
    else {
      time.min = t.getMinutes().toString();
    }
    if (t.getSeconds() < 10) {
      time.sec = '0';
      time.sec += t.getSeconds().toString();
    }
    else {
      time.sec = t.getSeconds().toString();
    }
    if (time.hours > 12) {
      time.hours = time.hours - 12;
      time.meridiem = 'PM';
    }
    else {
      time.meridiem = 'AM';
    }
    return time;
  }

  function getDay() {
    var day;
    switch (new Date().getDay()) {
      case 0:
      day = 'Sunday';
      break;
      case 1:
      day = 'Monday';
      break;
      case 2:
      day = 'Tuesday';
      break;
      case 3:
      day = 'Wednesday';
      break;
      case 4:
      day = 'Thursday';
      break;
      case 5:
      day = 'Friday';
      break;
      case 6:
      day = 'Saturday';
      break;
    }
    return day;
  }

  function getMonth() {
    var month;
    switch (new Date().getMonth()) {
      case 0:
      month = 'January';
      break;
      case 1:
      month = 'February';
      break;
      case 2:
      month = 'March';
      break;
      case 3:
      month = 'April';
      break;
      case 4:
      month = 'May';
      break;
      case 5:
      month = 'June';
      break;
      case 6:
      month = 'July';
      break;
      case 7:
      month = 'August';
      break;
      case 8:
      month = 'September';
      break;
      case 9:
      month = 'October';
      break;
      case 10:
      month = 'November';
      break;
      case 11:
      month = 'December';
      break;
    }
    return month;
  }

  $rootScope.curTime = {};
  $rootScope.curTime.time = getTime();
  $rootScope.curTime.day = getDay();
  $rootScope.curTime.dayNumber = getDayNumber();
  $rootScope.curTime.month = getMonth();
  $rootScope.curTime.year = getYear();

  startContinuousArtyom();


}
]);
