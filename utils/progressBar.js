app.config(function($mdThemingProvider) {
  })
  app.controller('AppCtrl', ['$scope', '$interval', function($scope, $interval) {
    var self = this, j= 0, counter = 0;

    self.mode = 'query';
    self.activated = true;
    self.determinateValue0 = 0;
    self.determinateValue1 = 25;
    self.determinateValue2 = 50;
    self.determinateValue3 = 75;
    self.determinateValue4 = 100;
    

    self.showList = [ ];

 
  }]);