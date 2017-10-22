// public/js/services/NerdService.js
angular.module('PizzaService', [])

    .factory('Pizza', ['$http', function($http) {
      

    return {

        get : function() {
            console.log('Hola Servicio');
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

    }])
 
    .service('AuthService', function($q, $http) {
      var LOCAL_TOKEN_KEY = 'yourTokenKey';
      var isAuthenticated = false;
      var authToken;
     
      function loadUserCredentials() {
        var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
        if (token) {
          useCredentials(token);
        }
      }
     
      function storeUserCredentials(token) {
        window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
        useCredentials(token);
      }
     
      function useCredentials(token) {
        isAuthenticated = true;
        authToken = token;
     
        // Set the token as header for your requests!
        $http.defaults.headers.common.Authorization = authToken;
      }
     
      function destroyUserCredentials() {
        authToken = undefined;
        isAuthenticated = false;
        $http.defaults.headers.common.Authorization = undefined;
        window.localStorage.removeItem(LOCAL_TOKEN_KEY);
      }
     
      var register = function(user) {
        return $q(function(resolve, reject) {
          $http.post('/api/signup', user).then(function(result) {
            if (result.data.success) {
              resolve(result.data.msg);
            } else {
              reject(result.data.msg);
            }
          });
        });
      };
     
      var login = function(user) {
        return $q(function(resolve, reject) {
          $http.post('/api/authenticate', user).then(function(result) {
            if (result.data.success) {
              storeUserCredentials(result.data.token);
              resolve(result.data.msg);
            } else {
              reject(result.data.msg);
            }
          });
        });
      };
     
      var logout = function() {
        destroyUserCredentials();
      };
     
      loadUserCredentials();
     
      return {
        login: login,
        register: register,
        logout: logout,
        isAuthenticated: function() {return isAuthenticated;},
      };
    })
    .service('CheckoutService', function($q, $http) {
         
        return {

          checkout : function(data) {
              console.log('Hola Servicio Checkout');
              return $http.post('/checkout', data);
          }
    } 
    })
 
    .factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
      return {
        responseError: function (response) {
          $rootScope.$broadcast({
            401: AUTH_EVENTS.notAuthenticated,
          }[response.status], response);
          return $q.reject(response);
        }
      };
    })

    .factory('socket', function($rootScope) {

        var socket = io.connect('http://localhost:3000');

        return {
            emit: function(eventName, data, callback) {
                socket.emit(eventName, data, function() {
                    var args = arguments;
                    $rootScope.$apply(function() {
                        if (callback) {
                            callback.apply(socket, args);
                        }
                    });
                });
            }
        };
    })
 
    .config(function ($httpProvider) {
      $httpProvider.interceptors.push('AuthInterceptor');
    });