
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
				canRemovePack: true
			});
		},

		downloadPack: function(packName, pricePoint) {
			Plugin.Service.Pack.purchase(packName, pricePoint, function() {

				Module.Controller.reloadStore();

				callStoreMethod('onPackDownloaded', {
					packName: packName
				});

			}, true);
		},

		goBack: function() {
			callStoreMethod('goBack');
		},

		reloadStore: function() {
			callStoreMethod('reload');
		},

		///////////////////////////////////////////
		// Callbacks
		///////////////////////////////////////////

		onPurchaseSuccess: function(packName, pricePoint) {
			this.downloadPack(packName, pricePoint);
		},

		onPurchaseFail: function() {
			callStoreMethod('hideActionProgress');
		},

		onScrollContent: function(yPosition) {
			callStoreMethod('onScrollContent', {
				yPosition: yPosition
			});
		}
	};

})(StickersModule, StickersModule.Module.Store);
