(function () {
	angular.module('pizzasOn.controllers', [])

	.controller('PizzasController', function ($scope, Pizza, $state) {
		
		Pizza.get()
            .then(function(response) {
                $scope.pizzas = response.data;
            }, function errorCallback(response) {
			    // called asynchronously if an error occurs
			    // or server returns response with an error status.
			    console.log(response);
			  });
	})

	.controller('HeaderController', function ($scope, Pizza, $state) {
		
		$scope.checkout = function(){
        	Pizza.getCheckout()
            .then(function(response) {
                $state.go('checkout');
            }, function errorCallback(response) {
			    // called asynchronously if an error occurs
			    // or server returns response with an error status.
			    console.log(response);
			    $state.go('login');
			  });
        }

        $scope.profile = function(){
        	Pizza.getProfile()
            .then(function(response) {
            	$state.go('profile', {orders: response.data});
            }, function errorCallback(response) {
			    // called asynchronously if an error occurs
			    // or server returns response with an error status.
			    console.log(response);
			    $state.go('login');
			  });
        }
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
	      var alertPopup = swal( "Inicio de sesión falló!", errMsg, 'error');
	    });
	  };

	  $scope.signup = function() {
	    AuthService.register($scope.user).then(function(msg) {
	      $state.go('register');
	     alert('Registro exitoso!', msg, 'success');
	    }, 
	    function(errMsg) {
	      var alertPopup = swal('Registro falló!', errMsg, "warning");
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
	     swal('Sesión Perdida!', 'Por favor, vuelva a iniciar sesión', 'info');
	  });
	})

	.controller("cartController", function($scope, $state, $shop, $http, $stateParams, Pizza, socket, CheckoutService, $rootScope, AuthService){

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

        $http.get('/api/memberinfo').then(function(result) {
	      $scope.memberinfo = result.data.msg;
	    });

	   	$scope.logout = function() {
	   	 	AuthService.logout();
	   		$state.go('login');
	  	};

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


		$scope.submit = function(htmlForm) {
	    
		    $scope.isDisabled = true;

			var tdcData = {
				"name": $scope.nombre,
				"numeroTDC": $scope.numeroTDC, 
				"nombreTDC": $scope.nombreTDC, 
				"numerosSeguridad": $scope.numerosSeguridad, 
				"fechaVencimiento": $scope.fechaVencimiento
			}
			
		    socket.emit('validacion', tdcData, function (data) {
		        if (data.error) { 
		            swal(data.message, 'Verifique nuevamente sus datos', 'error');
		            $scope.isDisabled = false; // Vuelve a habilitar el boton de comprar, para que se arreglen los errores

		        } else { 
	         
	            	var cart = {
					productos: $rootScope.udpShopContent,
					precioTotal: $rootScope.udpShopTotalPrice,
					cantidadProductos: $rootScope.udpShopTotalProducts
				}

		            data = {
		            	name: $scope.nombre,
		            	cart: cart,
	                    address: $scope.direccion
		            };

		            CheckoutService.checkout(data)
		            	.then(function(response) {
			                console.log(response.data);
			                $shop.destroy();
			                swal('Gracias por su compra!', 'Su orden ha sido procesada', 'success');
			                $state.go('outside');
			            }, function errorCallback(response) {
						    // called asynchronously if an error occurs
						    // or server returns response with an error status.
						    console.log(response);
						  });
	        }
	    });

	}
				
	})

	.controller('ProfileController', function ($scope, Pizza, $state, $stateParams) {
		
		$scope.orders = $stateParams.orders;

	})

  	.controller('detailController', ['$scope', '$stateParams','$shop','Pizza','$state',
    	function($scope, $stateParams, $shop, Pizza, $state) {

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
		$scope.agregarExtra = function (newIng1) {
		    
		       $scope.product.ing.push({ing: newIng1});
		       $scope.product.price= $scope.product.price + 8;

		     
		    }

		$scope.checkout = function(){
        	Pizza.getCheckout()
            .then(function(response) {
                $state.go('checkout');
            }, function errorCallback(response) {
			    // called asynchronously if an error occurs
			    // or server returns response with an error status.
			    console.log(response);
			    $state.go('login');
			  });
        }

		
    }]);

	 	
})();

