(function () {
	angular.module('pizzasOn.controllers', [])

	.controller('PizzasController', function ($scope, Pizza) {
		
		Pizza.get()
            .then(function(response) {
                $scope.pizzas = response.data;
            }, function errorCallback(response) {
			    // called asynchronously if an error occurs
			    // or server returns response with an error status.
			    console.log(response);
			  });

            /*$http.get('/api/pizzas').then(function(response) {
                $scope.pizzas = response.data;
            }, function errorCallback(response) {
			    // called asynchronously if an error occurs
			    // or server returns response with an error status.
			    console.log(response);
			  });*/
	})

	.controller('LoginCtrl', function($scope, AuthService, $state) {
	  $scope.user = {
	    name: '',
	    password: ''
	  };
	 
	  $scope.login = function() {
	    AuthService.login($scope.user).then(function(msg) {
	      $state.go('inside');
	    }, function(errMsg) {
	      var alertPopup = alert({
	        title: 'Login failed!',
	        template: errMsg
	      });
	    });
	  };
	})
	 
	.controller('RegisterCtrl', function($scope, AuthService, $ionicPopup, $state) {
	  $scope.user = {
	    name: '',
	    password: ''
	  };
	 
	  $scope.signup = function() {
	    AuthService.register($scope.user).then(function(msg) {
	      $state.go('outside.login');
	      var alertPopup = alert({
	        title: 'Register success!',
	        template: msg
	      });
	    }, function(errMsg) {
	      var alertPopup = alert({
	        title: 'Register failed!',
	        template: errMsg
	      });
	    });
	  };
	})
	 
	.controller('InsideCtrl', function($scope, AuthService, $http, $state) {
	  $scope.destroySession = function() {
	    AuthService.logout();
	  };
	 
	  $scope.getInfo = function() {
	    $http.get('/api/memberinfo').then(function(result) {
	      $scope.memberinfo = result.data.msg;
	    });
	  };
	 
	  $scope.logout = function() {
	    AuthService.logout();
	    $state.go('outside.login');
	  };
	})
	 
	.controller('AppCtrl', function($scope, $state, AuthService, AUTH_EVENTS) {
	  $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
	    AuthService.logout();
	    $state.go('outside.login');
	    var alertPopup = alert({
	      title: 'Session Lost!',
	      template: 'Sorry, You have to login again.'
	    });
	  });
	});
	
	
})();

