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

	$scope.createHouse = function(itemName){
		$http.post('/api/house/new', {name: itemName}).success(function(data){
			console.log(data)
		}).
		error(function(err){
			console.log(err)
		})
	};
	
	$scope.delete = function(itemId){
		$http.delete('/api/house/'+itemId).success(function(data){
			console.log(data)
		}).
		error(function(err){
			console.log(err)
		});
	}

})

app.controller('house-controller', function($scope, $routeParams, $http){

})