// public/js/services/NerdService.js
angular.module('PizzaService', []).factory('Pizza', ['$http', function($http) {

    return {
        // call to get all nerds
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

}]);