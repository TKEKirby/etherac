'use strict';

angular.module('etherac')
.controller('MusicLibCtrl', ['$rootScope', '$scope', '$http', '$window', 'SpeechService', function($rootScope, $scope, $http, $window, SpeechService) {

	$rootScope.pageTitle = $rootScope.currentUser.fullname + '| Music Library';
	$scope.errorMessage = '';
	$scope.songlibrary = [];


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
	* Read the music library into an return it as an array
	* Params: none
	* Return: the music library as an arry of objects
	*/
	var readLibrary = function () {
		$http.get('/song').success(function (songlibrary) {
			if (songlibrary === '0') {
				$scope.errorMessage ='There\'s no songs in the library.';
				$scope.songlibrary = [];
			} else {
				$scope.errorMessage ='';
				$scope.songlibrary = songlibrary;
			}
		}).error(function (error, status) {
			return error + ' (code:' + status + ')';
		});
	};


	/*
	* Description:
	* Edit a song data in the database
	* Params: Song an object containing the song data
	* Return: The new library or the error message
	*/
	$scope.editSong = function (songId, songName) {
		var prompt = $window.prompt('New song name :', songName);
		if(prompt !== null) {
			$http.put('/song/'+songId, {name: prompt}).success(function () {
				readLibrary();
			}).error(function (error, status) {
				$scope.errorMessage = error + ' (code:' + status + ')';
			});
		}
	};


	readLibrary();
	startContinuousArtyom();


	/*
	* Description:
	* Prepare the jPlayer on page load
	* Params: none
	* Return: none
	*/
	$(document).ready(function(){
		$('#jquery_jplayer_1').jPlayer({
			ready: function () {
				$(this).jPlayer('setMedia', {});
			},
			cssSelectorAncestor: '#jp_container_1',
			swfPath: '/js',
			supplied: 'mp3',
			useStateClassSkin: true,
			autoBlur: false,
			smoothPlayBar: true,
			keyEnabled: true,
			remainingDuration: true,
			toggleDuration: true
		});
	});

	/*
	* Set up playlist variables and initiate new jPlayerPlaylist
	*/
	var cssSelector = { jPlayer: '#jquery_jplayer_1', cssSelectorAncestor: '#jp_container_1' };
	var playlist = [];
	var options = { swfPath: '/js', supplied: 'ogv, m4v, oga, mp3' };
	var myPlaylist = new jPlayerPlaylist(cssSelector, playlist, options);


	/*
	* Description:
	* Use jPlayer to play audio files
	* Params: songId of song to play
	* Return:
	*/
	$scope.addToNowPlaying = function (song) {
		myPlaylist.add({
			title:song.title,
			artist:song.artist,
			mp3: '../songs/' + song.artist + '/' + song.album + '/' + song.file,
			poster:''
		});
		console.log('../songs/' + song.artist + '/' + song.album + '/' + song.file);
	};


	/*
	* Description:
	*
	* Params:
	* Return:
	*/
	/*
	$scope.create = function () {
	var prompt = $window.prompt('Create a new task :', 'Task Name');
	if (prompt !== null ) {
	$http.post('/task', {name: prompt}).success(function () {
	read();
}).error(function (error, status) {
$scope.errorMessage = error + ' (code:' + status + ')';
});
}
};
*/

/*
* Description:
*
* Params:
* Return:
*/
/*
$scope.delete = function (songId) {
$http.delete('/song/'+songId).success(function () {
read();
}).error(function (error, status) {
$scope.errorMessage = error + ' (code:' + status + ')';
});
};
*/

}]);
