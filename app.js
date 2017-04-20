angular.module('WeatherApp', ['ngRoute', 'WeatherApp'])


.config(function ($routeProvider, $locationProvider){

	$routeProvider
		.when('/index', {
			controller: 'WeatherController',
			templateUrl: 'src/index.html'
		})
		.otherwise({
			redirectTo: '/index'
		})

});