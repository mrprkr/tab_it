var data = data;
var transactions = transactions;

var app = angular.module('app', ['ngRoute', 'templatescache', 'ngTouch', 'ng-currency']);

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

app.directive('ngEnter', function() {
        return function(scope, element, attrs) {
            element.bind("keydown keypress", function(event) {
                if(event.which === 13) {
                    scope.$apply(function(){
                        scope.$eval(attrs.ngEnter, {'event': event});
                    });

                    event.preventDefault();
                }
            });
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

	$scope.addExpense = function(){
		if($scope.newTransaction.amount && $scope.newTransaction.desc){
			var randomID = Math.floor((Math.random() * 5000) + 1);
			$scope.newTransaction._id = randomID;
			$scope.newTransaction.payer = $scope.user;
			if($scope.newTransaction.split){
				$scope.newTransaction.split /= 100;
			}
			else {
				$scope.newTransaction.split = 1;
			}
			$scope.newTransaction.date = Date.now();
			$scope.transactions.push($scope.newTransaction);
			$scope.formState = "collapsed"
			$scope.createButton = {'border':'2px solid #111','cursor':'pointer'};
		}
	}

	$scope.resetBalance = function(){
		$scope.balance = Math.floor($scope.balance);
		$scope.balance = 0;
	}
})

app.controller('house-controller', function($scope, $routeParams, $http){

})