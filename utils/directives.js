app.directive('sideBar', function() {
  return {
    restrict: 'E',
    templateUrl: 'directives/sidebar-component.html'
  }
});

app.directive('personInfoForm', function() {
  return {
    restrict: 'AE',
    scope: {
      nameModel: '=',
      vornameModel: '=',
      streetModel: '=',
      postcodeModel: '=',
      cityModel: '=',
      emailModel: '=',
      telefonModel: '=',
      stpauliModel: '=',
      jobModel: '='
    },
    templateUrl: 'directives/person-info-component.html'
  }

});

app.directive('locationInfoForm', function() {
  return {
    restrict: 'AE',
    scope: {
      streetModel: '=',
      postcodeModel: '=',
      additionaladdressModel: '=',
      cityModel: '=',
      formName: '='
    },
    templateUrl: 'directives/location-info-component.html'
  }

});

app.directive('supportComponent', function() {
  return {
    restrict: 'AE',
    scope: {
      interestReasons: '=',
      noInterestReasons: '=',
      decisionValueModel: '='
    },
    templateUrl: 'directives/support-component.html'
  }
});

app.directive('communicationHistory', function() {
  return {
    restrict: 'AE',
    scope: {
      conversations: '='
    },
    templateUrl: 'directives/communication-history-component.html'
  };
});

app.directive('locationHeader', function() {
  return {
    restrict: 'AE',
    scope: {
    	location: '=',
    	categoryName: '=',
    	source: '='
    },
    templateUrl: 'directives/location-header-component.html'
  };
});

app.directive('noteList', function() {
  return {
    restrict: 'AE',
    scope: {
      notes: '='
    },
    templateUrl: 'directives/note-list-component.html'
  };
});
