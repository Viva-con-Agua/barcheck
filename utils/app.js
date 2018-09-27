// initialize the AngularJS App
var app = angular.module('VivaConAgua', [
	'ngMaterial',
	'ui.router',
	'uiGmapgoogle-maps',
	'ngGeolocation',
	'ngAutocomplete',
	'gm',
	'ngMap',
	'multipleSelection'
]);

// routine for backtracking logic
app.run(['$rootScope', '$state', 'historyService', function($rootScope, $state, historyService) {
	
	// catch the event that is triggered when $state changes
	$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState) {
		$state.previous = fromState;
		historyService.addStateToHistory($state);
		historyService.setNavigatedBack(0);
	});
}]);