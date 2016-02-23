
(function(Plugin, Module) {

	function callStoreMethod(action, attrs) {
		var iframe = Module.View.iframe;

		iframe && iframe.contentWindow.postMessage(JSON.stringify({
			action: action,
			attrs: attrs
		}), Plugin.Service.Helper.getDomain(Plugin.Service.Url.buildStoreUrl('/')));
	}

	Module.Controller = {

		onPurchaseCallback: null,

		configureStore: function() {
			callStoreMethod('configure', {
				canShowPack: true,
				canRemovePack: true
			});
		},

		downloadPack: function(packName, pricePoint) {
			Plugin.Service.Pack.purchase(packName, pricePoint, true, function() {
				callStoreMethod('onPackPurchaseSuccess');
			}, function() {
				callStoreMethod('onPackPurchaseFail');
			});
		},

		removePack: function(packName) {
			Plugin.Service.Pack.remove(packName, function() {
				callStoreMethod('onPackRemoveSuccess');
			}, function() {
				callStoreMethod('onPackRemoveFail');
			});
		},

		goBack: function() {
			callStoreMethod('goBack');
		},

		///////////////////////////////////////////
		// Callbacks
		///////////////////////////////////////////

		onPurchaseSuccess: function(packName, pricePoint) {
			this.downloadPack(packName, pricePoint);
		},

		onPurchaseFail: function() {
			callStoreMethod('onPackPurchaseFail');
		},

		onScrollContent: function(yPosition) {
			callStoreMethod('onScrollContent', {
				yPosition: yPosition
			});
		}
	};

})(StickersModule, StickersModule.Module.Store);
