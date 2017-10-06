/*factory('Pizza', ['$http', function($http) {

		    var Pizza = {
		    async: function() {
		      // $http returns a promise, which has a then function, which also returns a promise
		      var promise = $http.get('/api/pizzas').then(function (response) {
		        // The then function here is an opportunity to modify the response
		        console.log(response);
		        // The return value gets picked up by the then in the controller.
		        return response.data;
		      });
		      // Return the promise to the controller
		      return promise;
		    }
		  };
		  return Pizza;



		    return {
		        // call to get all nerds
		        get : function() {
		        	console.log('Hola en servicio');
		            return $http.get('/api/pizzas');
		        },

		                // these will work when more API routes are defined on the Node side of things
		        // call to POST and create a new pizza
		        create : function(pizzaData) {
		            return $http.post('/api/pizzas', pizzaData);
		        },

		        // call to DELETE a pizza
		        delete : function(id) {
		            return $http.delete('/api/pizzas/' + id);
		        }
		    }       
		}]);*/
		

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
	
})();