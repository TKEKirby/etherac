'use strict';

angular.module('etherac').service('SpeechService', ['$rootScope','MusicService','DataService', function ($rootScope, MusicService, DataService) {

	var titlePlayCommandList = [];
	var titleAddCommandList = [];
	var artistCommandList = [];

	/*
	* Description:
	*
	* Params:
	* Return:
	*/
	function getTitleAddCommands() {
		var titles = [];
		MusicService.readLibrary().then(function (res) {
			for (var i = 0; i < res.length; i++) {
				if (titles.indexOf(res[i].title.toString()) === -1)  {
					var songTitle = res[i].title.toString().toLowerCase();
					songTitle = formatString(songTitle);
					titles.push(songTitle);
				}
			}
			for (var j = 0; j < titles.length; j++) {
				titleAddCommandList[j] = 'Add ' + titles[j].toString();
			}
		});
	}

	/*
	* Description:
	*
	* Params:
	* Return:
	*/
	function getTitlePlayCommands() {
		var titles = [];
		MusicService.readLibrary().then(function (res) {
			for (var i = 0; i < res.length; i++) {
				if (titles.indexOf(res[i].title.toString()) === -1)  {
					var songTitle = res[i].title.toString().toLowerCase();
					songTitle = formatString(songTitle);
					titles.push(songTitle);
				}
			}
			for (var j = 0; j < titles.length; j++) {
				titlePlayCommandList[j] = 'Play ' + titles[j].toString();
			}
		});
	}


	/*
	* Description:
	*
	* Params:
	* Return:
	*/
	function getArtistCommands() {
		var artists = [];
		MusicService.readLibrary().then(function (res) {
			for (var i = 0; i < res.length; i++) {
				if (artists.indexOf(res[i].artist.toString()) === -1)  {
					artists.push(res[i].artist.toString());
				}
			}
			for (var j = 0; j < artists.length; j++) {
				artistCommandList[j] = 'Play all the songs by ' + artists[j].toString();
			}
		});
	}

	/*
	* Description:
	*
	* Params:
	* Return:
	*/
	function formatString(str) {
		str = str.toString().toLowerCase();
		str = str.toString().split(' (', 1);
		str = str.toString().split(' ft', 1);
		str = str.toString().split(' ft.', 1);
		str = str.toString().split(' feat', 1);
		str = str.toString().split(' with', 1);
		str = str.toString().split(' w-', 1);
		str = str.toString().replace(',', '');
		return str;
	}

	return {

		setupSpeech:function(){

			getTitlePlayCommands();
			getTitleAddCommands();
			getArtistCommands();

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

				{
					indexes:['show voice options'],
					action:function(){

						var voices = artyom.getVoices();

						for(var i = 0;i < voices.length;i++){
							var voice = voices[i];
							console.log(voice.name);
						}
						artyom.say('Here you are');
					}
				},

				/*
				* Command Description:
				* Command:
				* Response:

				{
					indexes:['Alice'],
					action:function(){
						artyom.newPrompt({
							question:'Yes, sir?',
							smart:true,
							options:['nevermind','report on the weather','access *'],
							beforePrompt:function(){
								//console.log('Before ask');
							},
							onStartPrompt:function(){
								//console.log('The prompt is being executed');
							},
							onEndPrompt:function(){
								//console.log('The prompt has been executed succesfully');
							},
							onMatch:function(i,wildcard){
								var action;
								if (i===0) {
									var exitStatement = [
										'Ok let me know if I can be of service.',
										'I am here for your support.',
										'I am here if you need me.',
										'Nothing is true, everything is permitted',
										'Wake me when you need me.',
										'You don\'t even care, do you?'
									];
									action = function(){
										artyom.sayRandom(exitStatement);
									};
								}

								if (i===1) {
									var currently;
									var today;
									if (navigator.geolocation) {
										navigator.geolocation.getCurrentPosition(function(position){
											$rootScope.$apply(function(){
												var pos = {
													lat : position.coords.latitude.toFixed(),
													lon : position.coords.longitude.toFixed()
												};
												DataService.getWeather(pos).then(function (response) {
													currently = response.currently;
													today = response.daily.data[0];
													tomorrow = response.daily.data[1];
													sunData = DataService.getSunInfo(today);
												});
											});
										});
										var temp = parseInt(currently.apparentTemperature);
										action = function(){
											artyom.say('Good Morning, Sir.');
											artyom.say('Todays forcast is ' + today.summary);
											artyom.say('There is an expected high of ' + today.temperatureMax.toFixed() + ' and a low of ' + today.temperatureMin.toFixed());
											artyom.say('The current temperature is ' + temp + ' degrees');
										};
								}

								if (i===2) {

								}

								return action;
							}
						});
					}
				},
				*/


				/*
				* Command Description:
				* Command:
				* Response:
				*/
				{
					indexes:['Are you awake','You up','Are you there','Are you up'],
					action:function(){
						artyom.newPrompt({
							question:'For you sir, always.  How may I be of service?',
							//smart:true,
							options:['How is it today','When is sunset','When is sunrise','How is it looking for tomorrow','Do you have free will','Nevermind'],
							beforePrompt:function(){
								//console.log('Before ask');
							},
							onStartPrompt:function(){
								//console.log('The prompt is being executed');
							},
							onEndPrompt:function(){
								//console.log('The prompt has been executed succesfully');
							},
							onMatch:function(i){//,wildcard
								var action;
								var currently;
								var today;
								var tomorrow;
								var sunData;
								if (navigator.geolocation) {
									navigator.geolocation.getCurrentPosition(function(position){
										$rootScope.$apply(function(){
											var pos = {
												lat : position.coords.latitude.toFixed(),
												lon : position.coords.longitude.toFixed()
											};
											DataService.getWeather(pos).then(function (response) {
												currently = response.currently;
												today = response.daily.data[0];
												tomorrow = response.daily.data[1];
												sunData = DataService.getSunInfo(today);
											});
										});
									});
								}
								if(i === 0){
									var temp = parseInt(currently.apparentTemperature);
									action = function(){
										artyom.say('Good Morning, Sir.');
										artyom.say('Todays forcast is ' + today.summary);
										artyom.say('There is an expected high of ' + today.temperatureMax.toFixed() + ' and a low of ' + today.temperatureMin.toFixed());
										artyom.say('The current temperature is ' + temp + ' degrees');
									};
								}
								if(i === 1){
									action = function(){
										artyom.say('Sunset is at ' + sunData.sunsetTime + 'PM');
									};
								}
								if(i === 2){
									action = function(){
										artyom.say('Sunrise is at ' + sunData.sunriseTime + 'AM');
									};
								}
								if(i === 3){
									action = function(){
										artyom.say(tomorrow.summary);
									};
								}
								if(i === 4){
									action = function(){
										artyom.say('A man chooses, a slave obeys.');
									};
								}
								if(i === 5){
									var exitStatement = [
										'Ok let me know if I can be of service.',
										'I am here for your support.',
										'I am here if you need me.',
										'Nothing is true, everything is permitted',
										'Wake me when you need me.',
										'You don\'t even care, do you?'
									];
									action = function(){
										artyom.sayRandom(exitStatement);
									};
								}
								return action;
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
					indexes:['I am up','I\'m up','I am awake','I\'m awake'],
					action:function(){
						if (navigator.geolocation) {
							navigator.geolocation.getCurrentPosition(function(position){
								$rootScope.$apply(function(){
									var pos = {
										lat : position.coords.latitude.toFixed(),
										lon : position.coords.longitude.toFixed()
									};
									DataService.getWeather(pos).then(function (response) {
										var currently = response.currently;
										var today = response.daily.data[0];
										var temp = parseInt(currently.apparentTemperature);
										artyom.say('Good Morning, Sir.');
										artyom.say('Todays forcast is ' + today.summary);
										artyom.say('There is an expected high of ' + today.temperatureMax.toFixed() + ' and a low of ' + today.temperatureMin.toFixed());
										artyom.say('The current temperature is ' + temp + ' degrees');
									});
								});
							});
						}
					}
				},

				/*
				* Command Description:
				* Command:
				* Response:
				*/
				{
					indexes:['What time is sunset','When is sunset','When will the sun be setting today'],
					action:function(){
						if (navigator.geolocation) {
							navigator.geolocation.getCurrentPosition(function(position){
								$rootScope.$apply(function(){
									var pos = {
										lat : position.coords.latitude.toFixed(),
										lon : position.coords.longitude.toFixed()
									};
									DataService.getWeather(pos).then(function (response) {
										var today = response.daily.data[0];
										var sunData = DataService.getSunInfo(today);
										artyom.say('Sunset is at ' + sunData.sunsetTime + 'PM');
									});
								});
							});
						}
					}
				},

				/*
				* Command Description:
				* Command:
				* Response:
				*/
				{
					indexes:['What time is sunrise','When is sunrise','When will the sun be rising today'],
					action:function(){
						if (navigator.geolocation) {
							navigator.geolocation.getCurrentPosition(function(position){
								$rootScope.$apply(function(){
									var pos = {
										lat : position.coords.latitude.toFixed(),
										lon : position.coords.longitude.toFixed()
									};
									DataService.getWeather(pos).then(function (response) {
										var today = response.daily.data[0];
										var sunData = DataService.getSunInfo(today);
										artyom.say('Sunrise is at ' + sunData.sunriseTime + 'AM');
									});
								});
							});
						}
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
						if (navigator.geolocation) {
							navigator.geolocation.getCurrentPosition(function(position){
								$rootScope.$apply(function(){
									var pos = {
										lat : position.coords.latitude.toFixed(),
										lon : position.coords.longitude.toFixed()
									};
									DataService.getWeather(pos).then(function (response) {
										var weather = response.currently;
										artyom.say('It is ' + parseInt(weather.apparentTemperature) + 'degrees outside right now.');
									});
								});
							});
						}
					}
				},

				/*
				* Command Description:
				* Command:
				* Response:
				*/
				{
					indexes:['What\'s the forecast today', 'What is the forecast today'],
					action:function(){
						if (navigator.geolocation) {
							navigator.geolocation.getCurrentPosition(function(position){
								$rootScope.$apply(function(){
									var pos = {
										lat : position.coords.latitude.toFixed(),
										lon : position.coords.longitude.toFixed()
									};
									DataService.getWeather(pos).then(function (response) {
										var today = response.daily.data[0];
										artyom.say(today.summary);
									});
								});
							});
						}
					}
				},

				/*
				* Command Description:
				* Command:
				* Response:
				*/
				{
					indexes:['What\'s the forecast tomorrow', 'What is the forecast tomorrow'],
					action:function(){
						if (navigator.geolocation) {
							navigator.geolocation.getCurrentPosition(function(position){
								$rootScope.$apply(function(){
									var pos = {
										lat : position.coords.latitude.toFixed(),
										lon : position.coords.longitude.toFixed()
									};
									DataService.getWeather(pos).then(function (response) {
										var tomorrow = response.daily.data[1];
										artyom.say(tomorrow.summary);
									});
								});
							});
						}
					}
				},

				/*
				* Command Description:
				* Command:
				* Response:
				*/
				{
					indexes:['What\'s the forecast this week', 'What is the forecast this week'],
					action:function(){
						if (navigator.geolocation) {
							navigator.geolocation.getCurrentPosition(function(position){
								$rootScope.$apply(function(){
									var pos = {
										lat : position.coords.latitude.toFixed(),
										lon : position.coords.longitude.toFixed()
									};
									DataService.getWeather(pos).then(function (response) {
										var thisWeek = response.daily;
										artyom.say(thisWeek.summary);
									});
								});
							});
						}
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
						var curTime = DataService.getTime();
						artyom.say('It is ' + curTime.hours + ' ' + curTime.min + curTime.meridiem);
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
					indexes:titlePlayCommandList,
					action:function(i){
						var str = titlePlayCommandList[i].toString().replace('Play ', '');
						MusicService.readLibrary().then(function (res) {
							if (res !== 'error') {
								for (var i = 0; i < res.length; i++) {
									var title = formatString(res[i].title);
									if (title === str) {
										MusicService.addPlayToNowPlaying(res[i]);
									}
								}
							}else{
								artyom.say('That is not an song I have in the library.');
								//artyom.say('No');
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
					indexes:titleAddCommandList,
					action:function(i){
						var str = titleAddCommandList[i].toString().replace('Add ', '');
						MusicService.readLibrary().then(function (res) {
							if (res !== 'error') {
								for (var i = 0; i < res.length; i++) {
									var title = formatString(res[i].title);
									if (title === str) {
										MusicService.addToNowPlaying(res[i]);
									}
								}
							}else{
								artyom.say('That is not an song I have in the library.');
								//artyom.say('No');
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
					indexes:artistCommandList,
					action:function(i){
						var str = artistCommandList[i].toString().replace('Play all the songs by ', '');
						MusicService.readLibrary().then(function (res) {
							if (res !== 'error') {
								for (var i = 0; i < res.length; i++) {
									if (res[i].artist === str) {
										MusicService.addToNowPlaying(res[i]);
									}
								}
								MusicService.playNowPlaying();
							}else{
								artyom.say('That is not an Artist I have in the library.');
								//artyom.say('No');
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
					indexes:['Yo dj spin that'],
					action:function(){
						MusicService.readLibrary().then(function (res) {
							if (res !== 'error') {
								for (var i = 0; i < res.length; i++) {
									MusicService.addToNowPlaying(res[i]);
								}
								MusicService.shuffleNowPlaying();
								MusicService.playNowPlaying();
							}else{
								artyom.say('I don\'t see, to have any songs');
								//artyom.say('No');
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
					indexes:['play now playing'],
					action:function(){
						MusicService.playNowPlaying();
					}
				},

				/*
				* Command Description:
				* Command:
				* Response:
				*/
				{
					indexes:['clear playlist', 'clear now playing', 'start a new playlist', 'empty now playing'],
					action:function(){
						MusicService.clearNowPlaying();
					}
				},

				/*
				* Command Description:
				* Command:
				* Response:
				*/
				{
					indexes:['shuffle playlist', 'shuffle now playing', 'mix it up', 'randomize'],
					action:function(){
						MusicService.shuffleNowPlaying();
					}
				}
			]);
		}
	};
}
]);
