angular.module("templatescache", []).run(["$templateCache", function($templateCache) {$templateCache.put("admin.html","\n<h1>This is the admin panel</h1>\n<button>with buttons</button>\n<form>\n  <input type=\"text\" placeholder=\"and forms\"/>\n</form>");
$templateCache.put("dev_tools.html","\n<div class=\"admin\">\n  <h5>Dev tools:</h5>\n  <button ng-click=\"balance = balance-20\">-$20</button>\n  <button ng-click=\"balance = balance-1\">-$1</button>\n  <button ng-click=\"balance = balance+1\">+$1</button>\n  <button ng-click=\"balance = balance+20\">+$20</button><br/>\n  <button ng-click=\"balance = 13.40\" style=\"width: 100%; margin-top: 4px\">Reset</button>\n</div>");
$templateCache.put("homepage.html","<h1>homepage</h1>\n<hr>\n<form>\n	<input type=\"email\" placeholder=\"email\">\n	<input type=\"password\" placeholder=\"password\">\n	<button> Login</button>\n</form>\n\n<div ng-include=\" \'admin.html\' \"></div>");
$templateCache.put("house.html","<h2>{{house.name}}\n");
$templateCache.put("house_overview.html","\n<div class=\"toolbar noselect\">\n  <p>Tom\'s Tab</p>\n</div>\n<div class=\"balance-container\">\n  <div class=\"your-balance-label noselect\">\n    <h4>Your Balance </h4>\n  </div>\n  <div class=\"your-balance\">\n    <h2 class=\"polarity noselect\"><span ng-if=\"balance &gt; 0\">+</span><span ng-if=\"balance &lt; 0\">-</span></h2>\n    <h2 class=\"balance\">{{balance | currency: $}}</h2>\n  </div>\n</div>\n<div class=\"create-expense-container\">\n  <button href=\"#\" ng-click=\"toggleExpand()\" ng-style=\"createButton\" focus-input=\"focus-input\" class=\"create-new-expense noselect\">create new expense</button>\n</div>\n<div ng-class=\"formState\" class=\"new-expense-form\">\n  <form ng-enter=\"addExpense()\">\n    <input type=\"number\" placeholder=\"How much?\" ng-model=\"newTransaction.amount\"/>\n    <input type=\"text\" placeholder=\"For what?\" ng-model=\"newTransaction.desc\"/>\n    <input type=\"number\" placeholder=\"% split?\" ng-model=\"newTransaction.split\" ng-value=\"100\"/>\n    <h4><span ng-if=\"newTransaction.amount &amp;&amp; newTransaction.desc &amp;&amp; newTransaction.split == null\" ng-click=\"addExpense()\" class=\"add\">Add {{newTransaction.amount | currency: $}} to tab</span><span ng-if=\"newTransaction.amount &amp;&amp; newTransaction.desc &amp;&amp; newTransaction.split\" ng-click=\"addExpense()\" class=\"add\">Add {{(newTransaction.amount*(newTransaction.split/100)) | currency: $}} to tab</span></h4>\n  </form>\n</div><br/>\n<hr class=\"transaction-hr\"/>\n<div class=\"transactions-container\">\n  <h5>Your transactions</h5>\n  <div class=\"transactions noselect\">\n    <div ng-repeat=\"transaction in transactions | orderBy: \'-date\'\" class=\"transaction no-touch\"><span ng-if=\"transaction.payer._id === user._id\" class=\"time\">You </span><span ng-if=\"transaction.payer._id !== user._id\" class=\"time\">{{transaction.payer.name}} </span><span class=\"time\">added {{transaction.split * 100}}% of {{transaction.amount | currency : $}} on {{transaction.date | date: \'EEEE, dd of MMMM\'}}</span><span class=\"detail\">{{transaction.amount * transaction.split | currency : $}} for {{transaction.desc}}</span></div>\n  </div>\n</div>");
$templateCache.put("start.html","<h1>Tab it</h1>\n<hr>\n\n");}]);