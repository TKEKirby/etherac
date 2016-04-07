'use strict';

angular.module('etherac').service('MusicService', ['$rootScope', '$http', '$q', function ($rootScope, $http, $q) {
	return {

		/*
		* Description:
		* Read the music library into an return it as an array
		* Params: none
		* Return: the music library as an arry of objects
		*/
		readLibrary:function () {
			var deferred = $q.defer();
			$http.get('/song').success(function (songlibrary) {
				if (songlibrary === '0') {
					songlibrary = [];
					deferred.resolve(songlibrary);
				} else {
					deferred.resolve(songlibrary);
				}
			}).error(function (error) {
				deferred.reject(error);
			});
			return deferred.promise;
		},

		/*
		* Description:
		* Add song to now playing list
		* Params: none
		* Return: none
		*/
		addToNowPlaying:function(song){
			$rootScope.nowPlaying.add({
				title:song.title,
				artist:song.artist,
				mp3: '../songs/' + song.artist + '/' + song.album + '/' + song.file,
				poster:''
			});
		},

		/*
		* Description:
		* Add song to now playing list and play immediately
		* Params: none
		* Return: none
		*/
		addPlayToNowPlaying:function(song){
			$rootScope.nowPlaying.add({
				title:song.title,
				artist:song.artist,
				mp3: '../songs/' + song.artist + '/' + song.album + '/' + song.file,
				poster:'',
			},true);
		},

		/*
		* Description:
		*
		* Params: none
		* Return: none
		*/
		pauseNowPlaying:function(){
			$rootScope.nowPlaying.pause();
		},

		/*
		* Description:
		*
		* Params: none
		* Return: none
		*/
		nextNowPlaying:function(){
			$rootScope.nowPlaying.next();
		},

		/*
		* Description:
		*
		* Params: none
		* Return: none
		*/
		playNowPlaying:function(){
			$rootScope.nowPlaying.play();
		}

};
}]);
