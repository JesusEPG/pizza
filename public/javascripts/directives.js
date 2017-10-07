(function () {
	angular.module('pizzasOn.directives', [])

	.directive('pizzasMuestra', function(){
		return {
			restrict: 'E',
			templateUrl: 'client/partials/pizzas-muestra.ejs'
		}
	})

	.directive('recommendedItems', function(){
		return {
			restrict: 'E',
			templateUrl: 'client/partials/recommended-items.ejs'
		}
	})

	.directive('categoryProducts', function(){
		return{
			restrict: 'E',
			templateUrl: 'client/partials/category-products.ejs'
		}
	})
	.directive('sliderIndex', function(){
		return{
			restrict: 'E',
			templateUrl: 'client/partials/slider-index.ejs'
		}
	})
	.directive('footerIndex', function(){
		return{
			restrict: 'E',
			templateUrl: 'client/partials/footer-index.ejs'
		}
	})
	.directive('categoryTab', function(){
		return{
			restrict: 'E',
			templateUrl: 'client/partials/category-tab.ejs'
		}
	});
})();