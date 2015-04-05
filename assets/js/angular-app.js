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

app.directive('focusInput', function($timeout) {
  return {
    link: function(scope, element, attrs) {
      element.bind('click', function() {
        $timeout(function() {
          element.parent().parent().find('input')[0].focus();
        });
      });
    }
  };
});

app.controller('homepage-controller', function($scope, $http, $location, $timeout){
	$scope.test = "hello world";

	$scope.balance = 13.40;
	$scope.formState = "collapsed";

	$scope.toggleExpand = function(){
		if($scope.formState === "collapsed"){
			$scope.formState = "expanded";
			$scope.createButton = {'border':'2px solid #fff', 'cursor':'default'};
		}
		else {
			$scope.formState = "collapsed";
			$scope.createButton = {'border':'2px solid #111', 'cursor':'pointer'};
		}
	}

	$scope.addExpense = function(){
		$scope.formState = "collapsed"
		$scope.createButton = {'border':'2px solid #111','cursor':'pointer'};
	}

	$scope.resetBalance = function(){
		$scope.balance = Math.floor($scope.balance);
		$scope.balance = 0;
	}
})

app.controller('house-controller', function($scope, $routeParams, $http){

})