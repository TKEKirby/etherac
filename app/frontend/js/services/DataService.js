'use strict';

angular.module('etherac').service('DataService', ['$q', '$http', 'ApiService',function ($q,$http,ApiService) {
	return {

		/*
		* Description:
		* Get weather data using Api service.
		* Params: userlocation - The location object containing lat and lon (fixed point)
		* Return: formatted weather object
		*/
		getWeather:function(userlocation){
			var deferred = $q.defer();
			var weather = {};
			ApiService.getweather(userlocation).then(function (response) {
				weather = response;
				weather.currently.apparentTemperature = weather.currently.apparentTemperature.toFixed([1]);
				weather.currently.icon = '../img/weatherIcons/' + weather.currently.icon + '.png';
				deferred.resolve(weather);
			});
			return deferred.promise;
		},

		/*
		* Description:
		*
		* Params:
		* Return:
		*/
		getSunInfo:function(dayData){
			var sunData = {};
			//Sunrise
			var date = new Date(dayData.sunriseTime*1000);
			var hours = date.getHours();
			var minutes = '0' + date.getMinutes();
			sunData.sunriseTime = hours + ':' + minutes.substr(-2);
			//Sunset
			date = new Date(dayData.sunsetTime*1000);
			hours = date.getHours();
			minutes = '0' + date.getMinutes();
			sunData.sunsetTime = hours + ':' + minutes.substr(-2);

			return sunData;
		},

		/*
		* Description:
		* Get the time for display
		* Params: none
		* Return: formatted time object
		*/
		getTime:function(){
			var time = {};
			var t = new Date();
			time.hours = t.getHours().toString();
			if (t.getMinutes() < 10) {
				time.min = '0';
				time.min += t.getMinutes().toString();
			}
			else {
				time.min = t.getMinutes().toString();
			}
			if (t.getSeconds() < 10) {
				time.sec = '0';
				time.sec += t.getSeconds().toString();
			}
			else {
				time.sec = t.getSeconds().toString();
			}
			if (time.hours > 12) {
				time.hours = time.hours - 12;
				time.meridiem = 'PM';
			}
			else {
				time.meridiem = 'AM';
			}
			return time;
		},

		/*
		* Description:
		* Get the day for display
		* Params: none
		* Return: formatted day of the week (string)
		*/
		getDay:function(){
			var day;
			switch (new Date().getDay()) {
				case 0:
				day = 'Sunday';
				break;
				case 1:
				day = 'Monday';
				break;
				case 2:
				day = 'Tuesday';
				break;
				case 3:
				day = 'Wednesday';
				break;
				case 4:
				day = 'Thursday';
				break;
				case 5:
				day = 'Friday';
				break;
				case 6:
				day = 'Saturday';
				break;
			}
			return day;
		},

		/*
		* Description:
		* Get the number of the day for display
		* Params: none
		* Return: formatted number of current day (int)
		*/
		getDayNumber:function(){
			var dayNumber = new Date().getDate();
			return dayNumber;
		},

		/*
		* Description:
		* Get the month for display
		* Params: none
		* Return: formatted month of the year (string)
		*/
		getMonth:function(){
			var month;
			switch (new Date().getMonth()) {
				case 0:
				month = 'January';
				break;
				case 1:
				month = 'February';
				break;
				case 2:
				month = 'March';
				break;
				case 3:
				month = 'April';
				break;
				case 4:
				month = 'May';
				break;
				case 5:
				month = 'June';
				break;
				case 6:
				month = 'July';
				break;
				case 7:
				month = 'August';
				break;
				case 8:
				month = 'September';
				break;
				case 9:
				month = 'October';
				break;
				case 10:
				month = 'November';
				break;
				case 11:
				month = 'December';
				break;
			}
			return month;
		},

		/*
		* Description:
		* Get the year for display
		* Params: none
		* Return: formatted year (int)
		*/
		getYear:function(){
			var year = new Date().getFullYear();
			return year;
		}
	};
}]);
