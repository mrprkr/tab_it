var data = data;

var app = angular.module('app', ['ngRoute', 'templatescache']);

app.config(['$routeProvider', '$locationProvider',
	function($routeProvider, $locationProvider) {
		$routeProvider

			.when('/', {
				templateUrl: 'house_overview.html',
				controller: 'homepage-controller'
			})

			.when('/house/:id', {
				templateUrl: 'house_overview.html',
				controller: 'house-controller'
			})
}])

app.controller('homepage-controller', function($scope, $http){
	$scope.test = "hello world";
	
	$scope.balance = 13.40;
})

app.controller('house-controller', function($scope, $routeParams, $http){

})