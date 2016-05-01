'use strict';

angular.module('etherac')

.controller('MusicLibCtrl', ['$rootScope', '$scope', '$http', '$timeout', '$window', '$modal', 'SpeechService', 'MusicService', function($rootScope, $scope, $http, $timeout, $window, $modal, SpeechService, MusicService) {

	$rootScope.pageTitle = $rootScope.currentUser.fullname + '| Music Library';
	$scope.errorMessage = '';
	$scope.songlibrary = [];

	/*
	* Set up jPlayerPlaylist variables
	*/

	$(document).ready(function(){

		$rootScope.nowPlaying = new jPlayerPlaylist({
			jPlayer: '#jquery_jplayer_1',
			cssSelectorAncestor: '#jp_container_1'
		},
		$scope.songlibrary,
		{
			playlistOptions: {
				enableRemoveControls: true
			},
			swfPath: '/bower_components/jPlayer/dist/jplayer/jquery.jplayer.swf',
			supplied: 'webmv, ogv, m4v, oga, mp3',
			useStateClassSkin: true,
			autoBlur: false,
			smoothPlayBar: true,
			keyEnabled: true,
			audioFullScreen: true
		});
	});

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
	var readLibrary = function (){
		MusicService.readLibrary().then(function (res) {
			if (res !== 'error') {
				$scope.songlibrary = res;
			}
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


	/*
	* Description:
	* Call Music service function to add song to now playing
	* Params: songId of song to play
	* Return: none
	*/
	$scope.addToNowPlaying = function (song) {
		MusicService.addToNowPlaying(song);
	};




	/*
	* Description:
	*
	* Params: none
	* Return: none
	*/
	$scope.uploadSongModal = function () {
		var uploadModal = $modal.open({
			templateUrl:'songUpload.html',
			controller: 'SongUploadCtrl',
			size: 'sm'
		});
		uploadModal.result.then(function () {
		}, function () {
			setTimeout(function(){
				MusicService.readLibrary().then(function (res) {
					if (res !== 'error') {
						console.log(res);
						$scope.songlibrary = res;
					}
				});
			},250);
			console.log('Modal dismissed at: ' + new Date());
		});
	};

	readLibrary();
	startContinuousArtyom();
	
}]);

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





angular.module('etherac')
.controller('SongUploadCtrl',function ($scope,$modalInstance,$http,$window,$timeout,Upload) {
	$scope.uploadFiles = function (files) {
		var data = {
			songs: files
		};
		data.songs.forEach( function (song, index) {
			data.songs[index].filename = song.name;
			data.songs[index].fieldname = 'songs';
		});
		$scope.files = files;
		Upload.upload({
			url: '/song/uploadSongs',
			arrayKey: '',
			data: data
		}).then(function (response) {
			$timeout(function () {
				$scope.result = response.data;
				$modalInstance.dismiss('done');
			});
		}, function (response) {
			if (response.status > 0) {
				$scope.errorMsg = response.status + ': ' + response.data;
			}
		}, function (evt) {
			$scope.progress =
			Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
		});
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
});
