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
	})

	.controller("cartController", function($scope, $state, $shop, $http, $stateParams, Pizza, socket, CheckoutService){

		$scope.isDisabled = false;
		
		Pizza.get()
            .then(function(response) {
                $scope.pizzas = response.data;
                $scope.product = _.find($scope.pizzas, {_id: $stateParams.id});
            }, function errorCallback(response) {
			    // called asynchronously if an error occurs
			    // or server returns response with an error status.
			    console.log(response);
			  });

		/**
		* @desc - añade x cantidad de un producto al carrito
		* @return - object - si es nueva inserción devuelve insert, en otro caso update
		*/
		$scope.add = function(producto)
		{
			//alert(producto.total); return;
			var product = {};
			product.id = producto.id;
			product.price = producto.price;
			product.name = producto.name;
			product.picture = producto.picture;
			product.category = producto.category;
			product.qty = parseInt(producto.total || 1,10);
			$shop.add(product);
		}

		/**
		* @desc - elimina un producto del carrito por su id
		*/
		$scope.remove = function(id)
		{
			if($shop.remove(id))
			{
				alert("Producto eliminado correctamente");
				return;
			}
			else
			{
				alert("Ha ocurrido un error eliminando el producto, seguramente porqué no existe");
				return;
			}
		}

		/**
		* @desc - elimina el contenido del carrito
		*/
		$scope.destroy = function()
		{
			$shop.destroy();
		}

		/**
		* @desc - redondea el precio que le pasemos con dos decimales
		*/
		$scope.roundCurrency = function(total)
		{
			return total.toFixed(2);
		}

		/**
		* @desc - formulario de paypal preparado para printar
		*/
		$scope.paypalData = function()
		{
			$shop.dataPayPal(userDataPayPal());
		}

		$scope.submit = function(htmlForm) {
	    
	    $scope.isDisabled = true;
	    //se debe sustituir tobi por los datos del formulario
	    socket.emit('validacion', {"name": "jesus", "lastname": "pernia"}, function (data) {
	        console.log(data.persona); // data will be 'woot'
	        if (data.error) { // Problem!
	            // Show the errors on the form
	   
	            console.log('error');
	            alert(data.message);
	            $scope.isDisabled = false; // Vuelve a habilitar el boton de comprar, para que se arreglen los errores

	        } else { 

	            //Aqui se hace las cosas cuando aprueba el banco

	            console.log('No hubo error!');

	            CheckoutService.checkout({'nombre': 'jesus2', 'apellido': 'pernia2'})
	            	.then(function(response) {
		                console.log(response.data);
		                $state.go('outside');
		            }, function errorCallback(response) {
					    // called asynchronously if an error occurs
					    // or server returns response with an error status.
					    console.log(response);
					  });

	            // Submit the form:
	            //return $http.get('/#!/outside');
	            //$state.go('outside');

	        }
	    });

	}
				
	})

  	.controller('detailController', ['$scope', '$stateParams','$shop','Pizza',
    	function($scope, $stateParams, $shop, Pizza) {

      	Pizza.get()
            .then(function(response) {
                $scope.pizzas = response.data;
                $scope.product = _.find($scope.pizzas, {_id: $stateParams.id});
            }, function errorCallback(response) {
			    // called asynchronously if an error occurs
			    // or server returns response with an error status.
			    console.log(response);
			  });
        $scope.add = function(producto)
			 {
				 //alert(producto.total); return;
				 var prod = {};
				 prod.id = producto._id;
				 prod.price = producto.price;
				 prod.nombre = producto.nombre;
				 prod.img = producto.img;
				 prod.ing = producto.ing;
				 prod.qty = parseInt(producto.total || 1,10);
				 $shop.add(prod);
				 console.log(producto);
				
			 }
 
		 /**
		 * @desc - elimina un producto del carrito por su id
		 */
		 $scope.remove = function(id)
		 	{
				 if($shop.remove(id))
				 {
				 alert("Producto eliminado correctamente");
				 return;
				 }
				 else
				 {
				 alert("Ha ocurrido un error eliminando el producto, seguramente porqué no existe");
				 return;
		 		}
		 	}
		 
		 /**
		 * @desc - elimina el contenido del carrito
		 */
		 $scope.destroy = function()
			 {
				 $shop.destroy();
			 }
		 
		 /**
		 * @desc - redondea el precio que le pasemos con dos decimales
		 */
		 $scope.roundCurrency = function(total)
			 {
			 	return total.toFixed(2);
			 }
		
    }]);

	 	
})();

