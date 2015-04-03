var app = angular.module('app', ['ngRoute', 'templatescache']);

app.config(['$routeProvider', '$locationProvider',
	function($routeProvider, $locationProvider) {
		$routeProvider

			.when('/', {
				templateUrl: 'start.html',
				controller: 'main-controller'
			})

			.when('/house/:id', {
				templateUrl: 'house.html',
				controller: 'house-controller'
			})
}])

app.controller('main-controller', function($scope, $http){
	$scope.test = "hello world";
	$http.get('/api/houses').success(function(data, status){
		$scope.houses = data;
	})
	.error(function(err){
		console.log(err)
	})
})

app.controller('house-controller', function($scope, $routeParams, $http){

})