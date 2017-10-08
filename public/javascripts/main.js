
$(document).ready(function(){
	$(function () {
		$.scrollUp({
	        scrollName: 'scrollUp', // Element ID
	        scrollDistance: 300, // Distance from top/bottom before showing element (px)
	        scrollFrom: 'top', // 'top' or 'bottom'
	        scrollSpeed: 300, // Speed back to top (ms)
	        easingType: 'linear', // Scroll to top easing (see http://easings.net/)
	        animation: 'fade', // Fade, slide, none
	        animationSpeed: 200, // Animation in speed (ms)
	        scrollTrigger: false, // Set a custom triggering element. Can be an HTML string or jQuery object
					//scrollTarget: false, // Set a custom target element for scrolling to the top
	        scrollText: '<i class="fa fa-angle-up"></i>', // Text for element, can contain HTML
	        scrollTitle: false, // Set a custom <a> title if required.
	        scrollImg: false, // Set true to use image
	        activeOverlay: false, // Set CSS color to display scrollUp active point, e.g '#00FFFF'
	        zIndex: 2147483647 // Z-Index for the overlay
		});
	});
});

(function(){
	var app1 = angular.module('pizzasOn', [
		'ngRoute',
		'pizzasOn.controllers',
		'pizzasOn.directives',
		'PizzaService',
		'Constants',
		"ui.router"
		]);

	app1.config(['$routeProvider','$stateProvider', '$urlRouterProvider', function($routeProvider, $stateProvider, $urlRouterProvider){
		$routeProvider
			.when("/",{
				templateUrl: 'client/view/pizzas-online.ejs',
				controller: 'PizzasController'
			})
			.when("/cart",{
				templateUrl:'client/view/cart.ejs'

			})
			.when("/checkout",{
				templateUrl:'client/view/checkout.ejs'
			})
			.when("/contact-us",{
				templateUrl:'client/view/contact-us.ejs'
			})
			.when("/login",{
				templateUrl:'client/view/login.ejs'
			})
			.when("/product-details",{
				templateUrl:'client/view/product-details.ejs',
				controller: 'PizzasController'
			})
			.when("/404",{
				templateUrl:'client/view/404.ejs'
			})


			.otherwise({
        		redirectTo: "/"
    		});

    	$stateProvider
    	/* .state('home', {
		    url: '/',
		    templateUrl: 'client/view/pizzas-online.ejs',
		    controller: 'PizzasController'
		  })
		  .state('cart', {
		    url: '/cart',
		    templateUrl: 'client/view/cart.ejs',
		    //controller: 'PizzasController'
		  })
		  .state('checkout', {
		    url: '/checkout',
		    templateUrl: 'client/view/checkout.ejs',
		    //controller: 'PizzasController'
		  })
		  .state('product-details', {
		    url: '/product-details',
		    templateUrl: 'client/view/product-details.ejs',
		    controller: 'PizzasController'
		  })*/
		  .state('outside.login', {
		    url: '/login',
		    templateUrl: 'client/view/login.ejs',
		    controller: 'LoginCtrl'
		  })
		  .state('outside.register', {
		    url: '/register',
		    templateUrl: 'client/view/register.ejs',
		    controller: 'RegisterCtrl'
		  })
		  .state('inside', {
		    url: '/inside',
		    templateUrl: 'client/view/inside.ejs',
		    controller: 'InsideCtrl'
		  });
		 
		//$urlRouterProvider.otherwise('/outside/login');
		
	}])


	app1.run(function ($rootScope, $state, AuthService, AUTH_EVENTS) {
	  $rootScope.$on('$stateChangeStart', function (event,next, nextParams, fromState) {
	    if (!AuthService.isAuthenticated()) {
	      console.log(next.name);
	      if (next.name !== 'outside.login' && next.name !== 'outside.register') {
	        event.preventDefault();
	        $state.go('outside.login');
	      }
	    }
	  });
	});
	
})();

