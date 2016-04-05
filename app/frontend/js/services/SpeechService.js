'use strict';

angular.module('etherac').service('SpeechService', ['$rootScope',function ($rootScope) {
	return {
		setupSpeech:function(){
			artyom.addCommands([
		    {
		      indexes:['Say something robot'],
		      action:function(i){
		        console.log(i);//Contains the index of the recognized command in the indexes property
		        artyom.say('Something robot');
		      }
		    },
		    {
		      indexes:['Are you awake','You up','Are you there'],
		      action:function(i){
		        console.log(i);//Contains the index of the recognized command in the indexes property
		        artyom.say('For you sir always');
		      }
		    },
		    {
		      indexes:['What time is sunset'],
		      action:function(i){
		        console.log(i);//Contains the index of the recognized command in the indexes property
		        artyom.say('Sunset is at ' + $rootScope.weather.sunset.hours + ' ' + $rootScope.weather.sunset.min + 'PM');
		      }
		    },
		    {
		      indexes:['What time is sunrise'],
		      action:function(i){
		        console.log(i);//Contains the index of the recognized command in the indexes property
		        artyom.say('Sunrise is at ' + $rootScope.weather.sunrise.hours + ' ' + $rootScope.weather.sunrise.min + 'AM');
		      }
		    },
		    {
		      indexes:['What\'s the temperature', 'What is the temperature'],
		      action:function(i){
		        console.log(i);//Contains the index of the recognized command in the indexes property
		        artyom.say('It is ' + parseInt($rootScope.weather.main.temp) + 'degrees outside right now.');
		      }
		    },
		    {
		      indexes:['What time is it'],
		      action:function(i){
		        console.log(i);//Contains the index of the recognized command in the indexes property
		        artyom.say('It is ' + $rootScope.curTime.time.hours + ' ' + $rootScope.curTime.time.min + $rootScope.curTime.time.meridiem);
		      }
		    },
		    {
		      indexes:['What should the dogs do right now'],
		      action:function(i){
		        console.log(i);//Contains the index of the recognized command in the indexes property
		        artyom.say('The dogs should, calm, the fuck down');
		      }
		    }
		  ]);
		}
	};
}
]);
