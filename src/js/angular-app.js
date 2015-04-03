var data = data;

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

app.controller('main-controller', function($scope){
	$scope.test = "hello world"
})

app.controller('house-controller', function($scope, $routeParams, $http){
	$scope.houseId = $routeParams.id
	$scope.userId = 0;

	$http.get('/data').success(function(data){
		console.log(data)
		$scope.transactions = data.transactions;
		console.log($scope.transactions)
	})

})