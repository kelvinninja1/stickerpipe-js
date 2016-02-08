
(function(Plugin) {

	Plugin.Module.Store = {

		init: function(stickerpipe) {
			Plugin.Module.Store.View.init();
			Plugin.Module.Store.ApiListener.init();
			Plugin.Module.Store.Controller.init(stickerpipe);
		},

		open: function(contentId) {
			Plugin.Module.Store.View.open(contentId);
		},

		close: function() {
			Plugin.Module.Store.View.close();
		},

		setOnPurchaseCallback: function(callback) {
			Plugin.Module.Store.Controller.onPurchaseCallback = callback;
		},

		purchaseSuccess: function(packName, pricePoint) {
			Plugin.Module.Store.Controller.onPurchaseSuccess(packName, pricePoint);
		},

		purchaseFail: function() {
			Plugin.Module.Store.Controller.onPurchaseFail();
		}
	};

})(StickersModule);
