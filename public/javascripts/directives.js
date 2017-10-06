(function () {
	angular.module('pizzasOn.directives', [])

	.directive('pizzasMuestra', function(){
		return {
			restrict: 'E',
			templateUrl: 'client/pizzas-muestra.ejs'
		}
	})

	.directive('recommendedItems', function(){
		return {
			restrict: 'E',
			templateUrl: 'client/recommended-items.ejs'
		}
	})

	.directive('categoryProducts', function(){
		return{
			restrict: 'E',
			templateUrl: 'client/category-products.ejs'
		}
	})
	.directive('sliderIndex', function(){
		return{
			restrict: 'E',
			templateUrl: 'client/slider-index.ejs'
		}
	})
	.directive('footerIndex', function(){
		return{
			restrict: 'E',
			templateUrl: 'client/footer-index.ejs'
		}
	})
	.directive('categoryTab', function(){
		return{
			restrict: 'E',
			templateUrl: 'client/category-tab.ejs'
		}
	});
})();