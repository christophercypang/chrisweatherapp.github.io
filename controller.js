angular.module('WeatherApp')

.controller('WeatherController', function($scope, $rootScope, $http, $interval) {


	var vm = this; 

	var chosenCity = '';

	var currTempC = '';
	var currTempF = '';

	var forecast = [];

	var tempDay = '';
	var tempMonth = '';
	var date = '';

	var tempTemperatureC = [];
	var tempTemperatureF = [];
	var tempIconArr = [];


	$scope.search = function(searchText) {
		var city = searchText;

		if(city == null || city == ''){
				$rootScope.currentCity = "City Not Found";
				$rootScope.currTemp = '';
				$rootScope.unit = '';
				$rootScope.weatherIcon = '';
				$rootScope.forecastArray = '';
				$rootScope.forecastWeatherIcon = '';
				$rootScope.countryAbbrev = '';

		} else {
			$scope.clickedCity(city);
		}

	}

	$scope.clickedCity = function(param){
		chosenCity = param;
		//$rootScope.currentCity = chosenCity;
		var forecastDays = 7;
		var countryCode = 'CA';

		$http.get('http://api.openweathermap.org/data/2.5/forecast/daily?q=' + chosenCity + ',' + countryCode + '&cnt=' + forecastDays +'&APPID=a261d0b5f91d49be3dc6b16ab109b71b')
		.success(function(forecastData) {
			//console.log(forecastData);
			//$rootScope.currentCity = forecastData.name;

			for (var i = 0; i < forecastDays; i++){
				var tempWeather = [];

				var generateDate = new Date(new Date().getTime() + (24 * 60 * 60 * 1000) * (i+1));
				var tempDay = generateDate.getDay();
				var tempMonth = (generateDate.getMonth()) + 1;
				var tempDate = generateDate.getDate();

				var day = '';

				switch (tempDay) {
					case 0:
					day = 'Sun';
					break;
					case 1:
					day = 'Mon';
					break;
					case 2:
					day = 'Tue';
					break;
					case 3:
					day = 'Wed';
					break;
					case 4:
					day = 'Thu';
					break;
					case 5:
					day = 'Fri';
					break;
					case 6:
					day = 'Sat';
					break;
					default:
					day = '';
				}

				var fullDate = day + ' ' + tempMonth + '/' + tempDate;	
				tempTemperatureC[i] = ((Math.round(((forecastData.list[i].temp.day) - 273.15) * 10) / 10) + '\u00B0C');
				tempTemperatureF[i] = ((Math.round(((forecastData.list[i].temp.day) * 9/5 - 459.67) * 10) / 10) + '\u00B0F');

				tempWeather.push(fullDate);
				tempWeather.push(tempTemperatureC[i]);
				//tempWeather.push(Math.round(((forecastData.list[i].temp.day) * 9/5 - 459.67) * 10) / 10);
				//tempWeather.push(forecastData.list[i].weather[0].main);
				

				forecast[i] = tempWeather;

				var tempWeatherIcon = forecastData.list[i].weather[0].main;
				//console.log(tempWeatherIcon);

				switch(tempWeatherIcon){
					case 'Rain':
					tempIcon = 'wi wi-rain';
					break;
					case 'Thunderstorm':
					tempIcon = 'wi wi-thunderstorm';
					break;
					case 'Drizzle':
					tempIcon = 'wi wi-sprinkle';
					break;
					case 'Snow':
					tempIcon = 'wi wi-snow';
					break;
					case 'Atmosphere':
					tempIcon = 'wi wi-fog';
					break;
					case 'Clear':
					tempIcon = 'wi wi-day-sunny';			
					break;
					case 'Clouds':
					tempIcon = 'wi wi-cloudy';
					break;
					default:
					tempIcon = 'wi wi-na';
				}
			//console.log(tempIcon);

				tempIconArr[i] = tempIcon;

		}
		//console.log(tempIconArr[0]);

		$rootScope.forecastWeatherIcon = tempIconArr;
		//console.log($rootScope.forecastWeatherIcon);


		$rootScope.forecastArray = forecast;
		//console.log($rootScope.forecastArray);

	})




		var openweatherlink = 'http://api.openweathermap.org/data/2.5/weather?q=' + chosenCity + ',CA&APPID=a261d0b5f91d49be3dc6b16ab109b71b'

		$http.get(openweatherlink) 
		.success(function(data) {
			console.log(data);

			$rootScope.countryAbbrev = ', ' + data.sys.country;
			$rootScope.currentCity = data.name;


			if(data.cod == 404){
				$rootScope.currentCity = "City Not Found";
				$rootScope.currTemp = '';
				$rootScope.unit = '';
				$rootScope.weatherIcon = '';
				$rootScope.forecastArray = '';
				$rootScope.forecastWeatherIcon = '';
				$rootScope.countryAbbrev = '';

			}


			currTempC = Math.round(((data.main.temp) - 273.15) * 10) / 10;
			currTempF = Math.round(((data.main.temp) * 9/5 - 459.67) * 10) / 10;
			//console.log(currTempF);
			$rootScope.currTemp = currTempC;

			$rootScope.unit = '\u00B0C';

			var currWeather = data.weather[0].main;
			//console.log(currWeather);

			

			today = new Date();
			var tempHour = today.getHours();
			

			var icon = '';

			switch(currWeather){
				case 'Rain':
				icon = 'wi wi-rain';
				break;
				case 'Thunderstorm':
				icon = 'wi wi-thunderstorm';
				break;
				case 'Drizzle':
				icon = 'wi wi-sprinkle';
				break;
				case 'Snow':
				icon = 'wi wi-snow';
				break;
				case 'Atmosphere':
				icon = 'wi wi-fog';
				break;
				case 'Clear':
				if(tempHour >= 7 && tempHour <= 19 ){
					icon = 'wi wi-day-sunny';
				} else {
					icon = 'wi wi-night-clear';
				}				
				break;
				case 'Clouds':
				icon = 'wi wi-cloudy';
				break;
				default:
				icon = 'wi wi-na';
			}
			//console.log(icon);


			$rootScope.weatherIcon = icon;
			


		})
		setTimeout(function() {
			angular.element("html, body").animate({ scrollTop: $("#thisWeatherInfo").position().top });
		}, 500);
	}


	var tick = function() {
		$scope.clock = Date.now();
	}

	tick();
	$interval(tick, 1000);


	$scope.switchTemp = function(param) {
		if(param == '\u00B0C') {
			$rootScope.unit = '\u00B0F';
			$rootScope.currTemp = currTempF;

			for (var i = 0; i < tempTemperatureF.length; i++){
				$rootScope.forecastArray[i][1] = tempTemperatureF[i];
			}

		} else {
			$rootScope.unit = '\u00B0C';
			$rootScope.currTemp = currTempC;

			for (var i = 0; i < tempTemperatureC.length; i++){
				$rootScope.forecastArray[i][1] = tempTemperatureC[i];
			}
		}
	}



	$scope.getCurrDate = function(){
		var today = new Date();
		tempDay = today.getDay();
		date = today.getDate();
		tempMonth = today.getMonth();
		var year = today.getFullYear();

		var day = '';

		switch (tempDay) {
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
			default:
			day = '';
		}	

		var month = '';

		switch(tempMonth) {
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

			case 11 :
			month = 'December';
			break;

			default:
			month = '';
		}

		var currentDate = day + ', ' + month + ' ' + date + ' ' + year;
		//console.log(currentDate);
		$rootScope.dateToday = currentDate;

	}
	

	/*$scope.scrollFunction = function() {
		setTimeout(function() {
		angular.element("html, body").animate({ scrollTop: $(document).height()-$(window).height() });
		}, 500);
	}*/


	$scope.threeDay = true;
	$scope.sevenDay = false;

	$scope.kelowna = false;
	$scope.vancouver = false;
	$scope.victoria = false;



	/*$scope.cities = {
		availableOptions: [
		{name: 'Vancouver'},
		{name: 'Kelowna'},
		{name: 'Victoria'}
		],
		selectedOption: {name: 'Vancouver'}
	};*/

});