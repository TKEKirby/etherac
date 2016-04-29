'use strict';

angular.module('etherac').service('ApiService', ['$q', '$http',function ($q,$http) {
	return {

		/*
		* Description:
		* Get weather from openweathermap.org.
		* Params: userlocation - The location object containing lat and lon (fixed point)
		* Return: response
		*/
		getweather:function(userlocation){
			var deferred = $q.defer();
			$http.post('/forecast/', userlocation).success(function (forecastRes) {
				deferred.resolve(forecastRes);
			}).error(function (error) {
				deferred.reject(error);
			});
			return deferred.promise;
		}


		/*
		* Description:
		* Get weather from openweathermap.org.
		* Params: userlocation - The location object containing lat and lon (fixed point)
		* Return: response
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
		*/

	};
}
]);
