
(function(Module) {

	function sendAPIMessage(action, attrs) {
		var iframe = Module.Service.Store.stickerpipe.storeView.iframe;

		iframe && iframe.contentWindow.postMessage(JSON.stringify({
			action: action,
			attrs: attrs
		}), Module.StickerHelper.getDomain(Module.Configs.storeUrl));
	}

	Module.Service.Store = {

		stickerpipe: null,

		onPurchaseCallback: null,

		init: function(stickerpipe) {
			this.stickerpipe = stickerpipe;
		},

		showCollections: function(packName) {
			this.stickerpipe.storeView.close();
			this.stickerpipe.open(packName);
		},

		downloadPack: function(packName, pricePoint) {
			Module.Api.changeUserPackStatus(packName, true, pricePoint, {
				success: (function () {
					this.stickerpipe.fetchPacks((function() {
						sendAPIMessage('onPackDownloaded', {
							packName: packName
						});
					}).bind(this));
				}).bind(this)
			});
		},

		purchaseSuccess: function(packName, pricePoint) {
			this.downloadPack(packName, pricePoint);
		},

		api: {
			showCollections: function(data) {
				Module.Service.Store.showCollections(data.attrs.packName);
			},

			purchasePack: function(data) {
				var packName = data.attrs.packName,
					packTitle = data.attrs.packTitle,
					pricePoint = data.attrs.pricePoint;

				if (pricePoint == 'A' || (pricePoint == 'B' && Module.Configs.userPremium)) {
					Module.Service.Store.downloadPack(packName, pricePoint);
				} else {
					var onPurchaseCallback = Module.Service.Store.onPurchaseCallback;

					onPurchaseCallback && onPurchaseCallback(packName, packTitle, pricePoint);
				}
			},

			resizeStore: function(data) {
				Module.Service.Store.stickerpipe.storeView.resize(data.attrs.height);
			}
		}
	};

})(StickersModule);
