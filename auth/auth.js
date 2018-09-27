app.controller('LoginCtrl', ['scope', '$state', '$mdDialog', '$rootScope', 'AUTH_EVENTS', function($scope, $state, $mdDialog, $rootScope, AUTH_EVENTS) {

  $scope.login = function() {
    var email = $scope.email;
    var password = $scope.password;
    firebase.auth().signInWithEmailAndPassword(email, password).then(function(user) {
      console.log(firebase.auth().currentUser);
      $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
    }, function(error) {
      console.log(error.code);
      console.log(error.message);
    	if (error.code === 'auth/wrong-password') {
    		alert('Wrong credentials. Please try again or contact info@vivaconagua.org to reset your Pool User.');
		} else {
    		alert(error.message);
		} 
      console.log(error);

    });
  };
  
  $scope.submit = function(){ 
    if ($scope.form.$valid) { 
        // actually submit form data to server.
    }
};


}]);

app.constant('AUTH_EVENTS', {
  loginSuccess : 'auth-login-success',
  loginFailed : 'auth-login-failed',
  logoutSuccess : 'auth-logout-success'
});