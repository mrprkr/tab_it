var tabs = tabs;

var app = angular.module('app', ['ngRoute', 'templatescache', 'ngTouch']);

app.config(['$routeProvider', '$locationProvider',
	function($routeProvider, $locationProvider) {
		$routeProvider

			.when('/', {
				templateUrl: 'homepage.html',
				controller: 'homepage-controller'
			})

			.when('/tabs', {
				templateUrl: 'your_tabs.html',
				controller: 'summary-controller'
			})

			.when('/tab/:id', {
				templateUrl: 'tab_overview.html',
				controller: 'tab-controller'
			})

		$locationProvider.html5Mode(true);
		$locationProvider.hashPrefix('!');
}])

// app.run(['$location', function AppRun($location) {
//     debugger; // -->> here i debug the $location object to see what angular see's as URL
// }]);


// focuses input when creating a new expense
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

// allows the user to hit enter to submit form
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

// adds a suffix to the date when using ngDate
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

app.controller('homepage-controller', function($scope){
	
})
// controller for the homepage
app.controller('summary-controller', function($scope){
	// manually assiging the tabs to scope;
	// API should request the list here and assign it to scope
	$scope.tabs = tabs;

})

// Controller for the tab-overview page
app.controller('tab-controller', function($scope, $http, $location, $timeout, $routeParams){

	// Temp manually set the user
	$scope.user = {
			_id: 12345,
			name: "Michael",
			email: "p88@me.com"
		};

	// temp lookup based on the ID in route params
	// In dist will use API to request list
	for(tab in tabs){
		if(tabs[tab]._id === $routeParams.id){
			$scope.tab = tabs[tab];
			$scope.transactions = $scope.tab.transactions;
		}
	}

	//temp calculating balance on front end. 
	//dist will request balance from API
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
		// console.log("Your liabilities are: "+yourLiabilites);
		// console.log("Your expenses are: "+yourExpenses);
		$scope.balance = yourExpenses-yourLiabilites;
		// console.log("Tab balance is: "+$scope.balance);
	}

	//watch for new objects in transactions
	//re-runs digest cycle
	//in DIST this should re-request transactions and balance from API
	$scope.$watchCollection('transactions', function(){
		$scope.findBalance();
	})


	//Form functions for animation
	$scope.formState = "collapsed";
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


	//creates a new expense and pushes to array
	$scope.addExpense = function(){
		if($scope.newTransaction.amount && $scope.newTransaction.desc){
			// var randomID = Math.floor((Math.random() * 5000) + 1);
			// $scope.newTransaction._id = randomID;
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


})