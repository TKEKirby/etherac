'use strict';

angular.module('etherac').service('ApiService', ['$q', '$http',function ($q,$http) {
	return {
		getweather:function(userlocation){
			var options = {
				method: 'GET',
				url: 'http://api.openweathermap.org/data/2.5/weather?lat=' + userlocation.lat + '&lon=' + userlocation.lon + '&APPID=996ec6ab54f154e527d67560677fe374',
				headers: {
					'content-type': 'application/json'
				}
			};
			var deferred = $q.defer();
			$http(options).success(function (data) {
				deferred.resolve(data);
			}).error(function (data) {
				deferred.reject(data);
			});
			return deferred.promise;
		}
	};
}
]);
