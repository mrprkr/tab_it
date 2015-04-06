var data = data;
var transactions = transactions;

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

app.filter('dateSuffix', function($filter) {
  var suffixes = ["th", "st", "nd", "rd"];
  return function(input) {
    var dtfilter = $filter('date')(input, 'MMMM dd');
    var day = parseInt(dtfilter.slice(-2));
    var relevantDigits = (day < 30) ? day % 20 : day % 30;
    var suffix = (relevantDigits <= 3) ? suffixes[relevantDigits] : suffixes[0];
    return dtfilter+suffix;
  };
});

app.controller('homepage-controller', function($scope, $http, $location, $timeout){
	// $scope.balance = 13.40;
	$scope.formState = "collapsed";


	$scope.user = {
		_id : Number,
		name: String,
		email: String
	}
	$scope.user = {
			_id: 12345,
			name: "Michael",
			email: "p88@me.com"
		};

	$scope.transactions = transactions;

	$scope.findBalance = function(){
		var yourExpenses = 0;
		var yourLiabilites = 0;
		for(t in $scope.transactions){
			if($scope.transactions[t].payer._id === $scope.user._id){
				yourExpenses += $scope.transactions[t].amount*$scope.transactions[t].split;	
			}
			else{
				yourLiabilites += $scope.transactions[t].amount*$scope.transactions[t].split;
			}
		}
		console.log("Your liabilities are: "+yourLiabilites);
		console.log("Your expenses are: "+yourExpenses);
		$scope.balance = yourExpenses-yourLiabilites;
		console.log("Tab balance is :"+$scope.balance);
	}

	$scope.$watchCollection('transactions', function(){
		$scope.findBalance();
	})


	$scope.toggleExpand = function(){
		if($scope.formState === "collapsed"){
			$scope.newTransaction = {};
			$scope.formState = "expanded";
			$scope.createButton = {'border':'2px solid #fff', 'cursor':'default'};
		}
		else {
			$scope.formState = "collapsed";
			$scope.createButton = {'border':'2px solid #111', 'cursor':'pointer'};
		}
	}

	$scope.clearDollars = function(){
		if($scope.newTransaction.amount){
			$scope.newTransaction.amount = $scope.newTransaction.amount.replace("$", "");
		}
	}

	$scope.addExpense = function(){
		$scope.formState = "collapsed"
		$scope.createButton = {'border':'2px solid #111','cursor':'pointer'};
		var randomID = Math.floor((Math.random() * 5000) + 1);
		$scope.newTransaction._id = randomID;
		$scope.newTransaction.amount = $scope.newTransaction.amount.replace("$", "");
		$scope.newTransaction.payer = $scope.user;
		$scope.newTransaction.split /= 100;
		$scope.newTransaction.date = Date.now();
		$scope.transactions.push($scope.newTransaction);
	}

	$scope.resetBalance = function(){
		$scope.balance = Math.floor($scope.balance);
		$scope.balance = 0;
	}
})

app.controller('house-controller', function($scope, $routeParams, $http){

})