'use strict';

angular.module('etherac').service('SpeechService', ['$rootScope','MusicService', function ($rootScope, MusicService) {
	return {
		setupSpeech:function(){

			/*
			* Description:
			* Add commands to artyom
			*/
			artyom.addCommands([
				/*
				* Command Description:
				* Command:
				* Response:
				*/
				{
					indexes:['Say something robot'],
					action:function(){
						artyom.say('Something robot');
					}
				},

				/*
				* Command Description:
				* Command:
				* Response:
				*/
				{
					indexes:['Are you awake','You up','Are you there','Are you up'],
					action:function(){
						artyom.say('For you sir always');
					}
				},

				/*
				* Command Description:
				* Command:
				* Response:
				*/
				{
					indexes:['What time is sunset'],
					action:function(){
						artyom.say('Sunset is at ' + $rootScope.weather.sunset.hours + ' ' + $rootScope.weather.sunset.min + 'PM');
					}
				},

				/*
				* Command Description:
				* Command:
				* Response:
				*/
				{
					indexes:['What time is sunrise'],
					action:function(){
						artyom.say('Sunrise is at ' + $rootScope.weather.sunrise.hours + ' ' + $rootScope.weather.sunrise.min + 'AM');
					}
				},

				/*
				* Command Description:
				* Command:
				* Response:
				*/
				{
					indexes:['What\'s the temperature', 'What is the temperature'],
					action:function(){
						artyom.say('It is ' + parseInt($rootScope.weather.main.temp) + 'degrees outside right now.');
					}
				},

				/*
				* Command Description:
				* Command:
				* Response:
				*/
				{
					indexes:['What time is it'],
					action:function(){
						artyom.say('It is ' + $rootScope.curTime.time.hours + ' ' + $rootScope.curTime.time.min + $rootScope.curTime.time.meridiem);
					}
				},

				/*
				* Command Description:
				* Command:
				* Response:
				*/
				{
					indexes:['What should the dogs do right now'],
					action:function(){
						artyom.say('The dogs should, calm, the fuck down');
					}
				},

				/*
				* Begin Music Commands
				*/

				/*
				* Command Description:
				* Command:
				* Response:
				*/
				{
					smart:true,
					indexes:['play *'],
					action:function(i,wildcard){
						console.log(i,wildcard);
						var str = wildcard.toString();
						var musicLib = [];
						str = str.toLowerCase();
						str = str.replace(/-/g, ' ');
						MusicService.readLibrary().then(function (res) {
							if (res !== 'error') {
								for (var i = 0; i < res.length; i++) {
									musicLib[i] = res[i].title.toLowerCase();
								}
								console.log(str);
								if(musicLib.indexOf(str.trim()) === -1){
									artyom.say('That is not a Song I have in the library.');
									//artyom.say('No');
								}else{
									MusicService.addPlayToNowPlaying(res[musicLib.indexOf(str.trim())]);
								}
							}
						});
					}
				},

				/*
				* Command Description:
				* Command:
				* Response:
				*/
				{
					smart:true,
					indexes:['add *'],
					action:function(i,wildcard){
						var musicLib = [];
						wildcard = wildcard.toLowerCase();
						wildcard = wildcard.replace(/-/g, ' ');
						MusicService.readLibrary().then(function (res) {
							if (res !== 'error') {
								for (var i = 0; i < res.length; i++) {
									musicLib[i] = res[i].title.toLowerCase();
								}
								if(musicLib.indexOf(wildcard.trim()) === -1){
									artyom.say('That is not a Song I have in the library.');
								}else{
									MusicService.addToNowPlaying(res[musicLib.indexOf(wildcard.trim())]);
								}
							}
						});
					}
				},

				/*
				* Command Description:
				* Command:
				* Response:
				*/
				{
					indexes:['pause', 'stop'],
					action:function(){
						MusicService.pauseNowPlaying();
					}
				},

				/*
				* Command Description:
				* Command:
				* Response:
				*/
				{
					indexes:['next song', 'next'],
					action:function(){
						MusicService.nextNowPlaying();
					}
				},

				/*
				* Command Description:
				* Command:
				* Response:
				*/
				{
					indexes:['play'],
					action:function(){
						MusicService.playNowPlaying();
					}
				}


				/*
				* Command Description:
				* Command:
				* Response:
				{
					smart:true,
					indexes:['play'],
					action:function(){

					}
				}
				*/


			]);

		}
	};
}
]);
