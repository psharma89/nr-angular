# nr-angular
Angular - NR Insights integration for timing data



1. Add nr-angular.js
	```
	<script src="../nr-angular.js"></script>
	```
2. Add newrelic-timing module

	```
	var app = angular.module( "app", [
        'breeze.angular',
        'ui.router',
        'newrelic-timing',
        'ui.bootstrap' ] );
	```