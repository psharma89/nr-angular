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



3. NRQL queries:
```
SELECT average(renderTime) FROM PageAction FACET url SINCE 1 hour AGO TIMESERIES
SELECT average(appTime) FROM PageAction FACET url SINCE 1 hour AGO TIMESERIES
SELECT average(appTime), average(renderTime) FROM PageAction WHERE url='/menu/pizza' SINCE 1 hour AGO TIMESERIES
```