'use strict';

angular.module('etherac')

.controller('MusicLibCtrl', ['$rootScope', '$scope', '$http', '$timeout', '$window', '$modal', 'SpeechService', 'MusicService', 'Upload', function($rootScope, $scope, $http, $timeout, $window, $modal, SpeechService, MusicService, Upload) {

	$rootScope.pageTitle = $rootScope.currentUser.fullname + '| Music Library';
	$scope.errorMessage = '';
	$scope.songlibrary = [];
	$scope.playlists = [];

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
				speed:'1', // talk normally
				executionKeyword:'would you kindly'
			});
			SpeechService.setupSpeech();
		},250);
	}

	/*
	* Description:
	* Read the music library and return it as an array
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
	* Read the playlists and return it as an array
	* Params: none
	* Return: the playlists as an arry of objects with a name and song array
	*/
	var readPlaylists = function (){
		MusicService.readPlaylists().then(function (res) {
			if (res !== 'error') {
				$scope.playlists = res;
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
						$scope.songlibrary = res;
					}
				});
			},250);
		});
	};

	/*
	* Description:
	*
	* Params: none
	* Return: none
	*/
	$scope.AddtoPlaylistModal = function (song) {
		var uploadModal = $modal.open({
			templateUrl:'AddtoPlaylist.html',
			controller: 'AddtoPlaylistCtrl',
			size: 'sm',
			resolve: {
				song:  function () {
					return song;
				},
				playlists: function () {
					readPlaylists();
					return $scope.playlists;
				}
			}
		});
		uploadModal.result.then(function () {
		}, function () {
			setTimeout(function(){
				MusicService.readLibrary().then(function (res) {
					if (res !== 'error') {
						$scope.songlibrary = res;
					}
				});
			},250);
		});
	};

	/*
	* Description:
	*
	* Params: none
	* Return: none
	*/
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
				readLibrary();
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

	readPlaylists();
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


angular.module('etherac')
.controller('AddtoPlaylistCtrl',function ($scope,$modalInstance,$http,song,playlists) {
	$scope.song = song;
	$scope.playlists = playlists;
	$scope.playlistSelect = 'newPL';
	console.log($scope.playlistSelect);

	$scope.selectPlaylist = function (list) {
		$scope.playlistSelect = list;
	};

	$scope.addtoPL = function (song, plist) {
		if (plist==='newPL') {
			if ($scope.newPlaylistTitle) {
				plist=$scope.newPlaylistTitle;
			}
			else {
				$scope.errorMessage = 'Enter New PLaylist Name';
			}
		}
		console.log(plist);
		if (plist) {
			$http.put('/song/'+song._id, {playlist: plist}).success(function () {
				$modalInstance.dismiss('Success');
			}).error(function (error, status) {
				$scope.errorMessage = error + ' (code:' + status + ')';
			});
		}
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
});
