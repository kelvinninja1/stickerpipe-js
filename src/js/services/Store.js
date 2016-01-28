
(function(Plugin) {

	function sendAPIMessage(action, attrs) {
		var iframe = Plugin.Service.Store.stickerpipe.storeView.iframe;

		iframe && iframe.contentWindow.postMessage(JSON.stringify({
			action: action,
			attrs: attrs
		}), Plugin.Service.Helper.getDomain(Plugin.Configs.storeUrl));
	}

	Plugin.Service.Store = {

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
			Plugin.Service.Pack.activateUserPack(packName, pricePoint, function() {
				sendAPIMessage('reload');
				sendAPIMessage('onPackDownloaded', {
					packName: packName
				});
			});
		},

		purchaseSuccess: function(packName, pricePoint) {
			this.downloadPack(packName, pricePoint);
		},

		purchaseFail: function() {
			sendAPIMessage('hideActionProgress');
		},

		goBack: function() {
			sendAPIMessage('goBack');
		},

		api: {
			showCollections: function(data) {
				Plugin.Service.Store.showCollections(data.attrs.packName);
			},

			purchasePack: function(data) {
				var packName = data.attrs.packName,
					packTitle = data.attrs.packTitle,
					pricePoint = data.attrs.pricePoint;

				if (pricePoint == 'A' || (pricePoint == 'B' && Plugin.Configs.userPremium)) {
					Plugin.Service.Store.downloadPack(packName, pricePoint);
				} else {
					var onPurchaseCallback = Plugin.Service.Store.onPurchaseCallback;

					onPurchaseCallback && onPurchaseCallback(packName, packTitle, pricePoint);
				}
			},

			resizeStore: function(data) {
				Plugin.Service.Store.stickerpipe.storeView.resize(data.attrs.height);
			},

			showBackButton: function(data) {
				var modal = Plugin.Service.Store.stickerpipe.storeView.modal;

				if (data.attrs.show) {
					modal.backButton.style.display = 'block';
				} else {
					modal.backButton.style.display = 'none';
				}
			}
		}
	};

})(StickersModule);
