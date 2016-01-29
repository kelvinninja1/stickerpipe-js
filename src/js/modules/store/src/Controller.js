
(function(Plugin, Module) {

	function callStoreMethod(action, attrs) {
		var iframe = Module.View.iframe;

		iframe && iframe.contentWindow.postMessage(JSON.stringify({
			action: action,
			attrs: attrs
		}), Plugin.Service.Helper.getDomain(Plugin.Configs.storeUrl));
	}

	Module.Controller = {

		stickerpipe: null,

		onPurchaseCallback: null,

		init: function(stickerpipe) {
			this.stickerpipe = stickerpipe;
		},

		showCollections: function(packName) {
			Module.View.close();
			this.stickerpipe.open(packName);
		},

		downloadPack: function(packName, pricePoint) {
			Plugin.Service.Pack.activateUserPack(packName, pricePoint, function() {
				callStoreMethod('reload');
				callStoreMethod('onPackDownloaded', {
					packName: packName
				});
			});
		},

		purchasePack: function(packName, packTitle, pricePoint) {
			if (pricePoint == 'A' || (pricePoint == 'B' && Plugin.Configs.userPremium)) {
				this.downloadPack(packName, pricePoint);
			} else {
				this.onPurchaseCallback && this.onPurchaseCallback(packName, packTitle, pricePoint);
			}
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
			callStoreMethod('hideActionProgress');
		}
	};

})(StickersModule, StickersModule.Module.Store);
