'use strict';

angular.module('etherac')
	.controller('MusicLibCtrl', function($rootScope, $scope, $http, $window) {

		$rootScope.pageTitle = $rootScope.currentUser.fullname + '| Music Library';
		$scope.errorMessage = '';
		$scope.tasks = [];

		var read = function () {
			$http.get('/song').success(function (songlibrary) {
				if (songlibrary === '0') {
					$scope.songlibrary= [];
					$scope.errorMessage ='There\'s no songs in the library.';
				} else {
					$scope.songlibrary = songlibrary;
					$scope.errorMessage ='';
				}
			}).error(function (error, status) {
					$scope.errorMessage = error + ' (code:' + status + ')';
			});
		};

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

		$scope.edit = function (songId, songName) {
			var prompt = $window.prompt('New song name :', songName);
			if(prompt !== null) {
				$http.put('/song/'+songId, {name: prompt}).success(function () {
					read();
				}).error(function (error, status) {
					$scope.errorMessage = error + ' (code:' + status + ')';
				});
			}
		};

		/*
		$scope.delete = function (songId) {
			$http.delete('/song/'+songId).success(function () {
				read();
			}).error(function (error, status) {
				$scope.errorMessage = error + ' (code:' + status + ')';
			});
		};
		*/

		read();

	});
