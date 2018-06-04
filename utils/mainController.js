app.controller('MainController', ['$state', '$scope', '$mdDialog', '$timeout', '$state', '$mdSidenav', 'locationService', '$rootScope',
	'progressService', '$http', 'AUTH_EVENTS',
	function($state, $scope, $mdDialog, $timeout, $state, $mdSidenav, locationService, $rootScope, progressService, $http, AUTH_EVENTS) {
		
		
		//var show_dialog = false;
		/*
			This option is for development mode only!
			Remove my commit from May 28 2018 before deployment!
		*/
		
		
		var showLoginDialog = function(ev) {
			$mdDialog.show({
				controller: 'LoginCtrl',
				templateUrl: 'auth/login.html',
				escapeToClose: false,
				parent: angular.element(document.body),
				targetEvent: ev
			});
		};

		var setCurrentUser = function() {
			$scope.currentUser = $rootScope.currentUser;
			// if ($scope.currentUser) {
			// 	$scope.currentUser = $rootScope.currentUser;	
			// } else {
			// 	$scope.currentUser = "DEV: NO USER";
			// }
			$state.go('home'); //home
			$mdDialog.hide();
		};
		// initial start

		$state.go('start'); //home
		
		function switchBackground(to) {
			if (to === 'dark') {
				$scope.myStyle = {'background-image': 'url(sources/img/Background_dunkel.jpg)',
            		'background-size' : 'cover'

				};

			} else {
					$scope.myStyle = {'background-image': 'url(sources/img/Background_hell.jpg)',
            		'background-size' : 'cover'
					};
				
			}
			
		}

		switchBackground("dark");

		//showLoginDialog()

		$scope.logout = function() {
			firebase.auth().signOut().then(function() {
				$rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
			}).catch(function(error) {
				// TBD
			});
			// if (show_dialog == true) {
			// 	firebase.auth().signOut().then(function() {
			// 		$rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
			// 	}).catch(function(error) {
			// 		// TBD
			// 	});	
			// } else {
			// 	$rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
			// }
		};

		$scope.toggleLeft = buildToggler('left');

		function buildToggler(componentId) {

			return function() {
				locationService.oLocation = {};
				$mdSidenav(componentId).toggle();
			};
		}
		
		$scope.navigation = true; // default visibility state

        $scope.showNavigation = function(show) {
            $scope.navigation = show;
        };
		
		$scope.showNavigation(true);

		$rootScope.$on(AUTH_EVENTS.logoutSuccess, showLoginDialog);
		$rootScope.$on(AUTH_EVENTS.loginSuccess, setCurrentUser);

		// for progress bar
		$rootScope.$on('$stateChangeStart',
			function(event, toState, toParams, fromState, fromParams) {

				if (toState.name == 'home' || toState.name == 'start') {
					switchBackground('dark');	
				} else {
					switchBackground('light');
				}
				progressService.getProgressAtState(fromState);
			});

	}
]);

app.controller('HomeHelp', ['$scope', '$mdDialog', '$timeout', '$state', '$mdSidenav', 'locationService', '$rootScope', 'progressService',
	'historyService', '$http', 'AUTH_EVENTS',
	function($scope, $mdDialog, $timeout, $state, $mdSidenav, locationService, $rootScope, progressService, historyService, $http,
		AUTH_EVENTS) {}
]);