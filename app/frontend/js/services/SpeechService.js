'use strict';

angular.module('etherac').service('SpeechService', ['$rootScope','MusicService', function ($rootScope, MusicService) {

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
					songTitle = songTitle.toString().split(' (', 1);
					songTitle = songTitle.toString().split(' ft', 1);
					songTitle = songTitle.toString().split(' ft.', 1);
					songTitle = songTitle.toString().split(' feat', 1);
					songTitle = songTitle.toString().split(' with', 1);
					songTitle = songTitle.toString().split(' w-', 1);
					songTitle = songTitle.toString().replace(',', '');
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
					songTitle = songTitle.toString().split(' (', 1);
					songTitle = songTitle.toString().split(' ft', 1);
					songTitle = songTitle.toString().split(' ft.', 1);
					songTitle = songTitle.toString().split(' feat', 1);
					songTitle = songTitle.toString().split(' with', 1);
					songTitle = songTitle.toString().split(' w-', 1);
					songTitle = songTitle.toString().replace(',', '');
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
