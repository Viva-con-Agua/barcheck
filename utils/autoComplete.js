app.controller("TestCtrl", ['$state', '$scope', 'locationService', 'historyService', function($state, $scope, locationService,
	historyService) {

	$scope.result1 = ''; // result of query
	$scope.options1 = {
		country: ['de', 'at', 'ch'], // filter based on country
		types: 'establishment', // filter based on company
		strictBounds: true
	};
	$scope.details1 = ''; // complete address in detail

	// latitude and longitude of the result
	$scope.lat = undefined;
	$scope.lng = undefined;
	
	$scope.showNavigation(true);
	// saves the location info before moving forward
	$scope.save = function() {
		if ($scope.details1.name === undefined || locationService.convertGoogleAddressToObjectAddress($scope.details1.address_components) === undefined) {
			$state.go('address-not-found');
		} else {
			locationService.setSearchName($scope.details1.name);
			locationService.setLocationName($scope.details1.name);
			var address = locationService.convertGoogleAddressToObjectAddress($scope.details1.address_components);
			locationService.setAddress(address);
			locationService.setGeoPosition($scope.details1.geometry.location.lat(), $scope.details1.geometry.location.lng());
			$state.go('locations-search-result');
		}
	
	};

	// back navigation logic
	$scope.goBack = function() {
		historyService.setNavigatedBack(1);
		$state.go(historyService.getPreviousState());
	};

}]);