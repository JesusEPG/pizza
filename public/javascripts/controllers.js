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
	      var alertPopup = alert( "Login failed!" + errMsg);
	    });
	  };

	  $scope.signup = function() {
	    AuthService.register($scope.user).then(function(msg) {
	      $state.go('register');
	     alert( "'Register success!'" + msg );
	    }, 
	    function(errMsg) {
	      var alertPopup = alert("'Register failed!'" + errMsg);
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
	    $state.go('login');
	  };
	})
	 
	.controller('AppCtrl', function($scope, $state, AuthService, AUTH_EVENTS) {
	  $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
	    AuthService.logout();
	    $state.go('login');
	     alert("Session Lost! Sorry, You have to login again");
	  });
	});
	
	
})();

