
(function(Module) {

	Module.Service.Store = {

		stickerpipe: null,

		onPurchaseCallback: null,

		init: function(stickerpipe) {
			this.stickerpipe = stickerpipe;
		},

		setOnPurchaseCallback: function(onPurchaseCallback) {
			this.onPurchaseCallback = onPurchaseCallback;
		},

		showPackCollections: function(packName) {
			this.stickerpipe.storeView.close();
			this.stickerpipe.open(packName);
		},

		downloadPack: function(packName) {
			var self = this;
			Module.Api.changeUserPackStatus(packName, true, {
				success: function () {
					self.stickerpipe.fetchPacks(function() {
						self.showPackCollections(packName);
					});
				}
			});
		},

		purchaseSuccess: function(packName) {
			this.downloadPack(packName);
		},

		api: {
			showPackCollections: function(data) {
				Module.Service.Store.showPackCollections(data.attrs.packName);
			},

			downloadPack: function(data) {
				Module.Service.Store.downloadPack(data.attrs.packName);
			},

			purchasePack: function(data) {
				var callback = Module.Service.Store.onPurchaseCallback;

				callback && callback(
					data.attrs.packName,
					data.attrs.packTitle,
					data.attrs.pricePoint
				);
			},

			isPackActive: function(data) {
				return this.isPackExistsInStorage(data);
			},

			isPackExistsInStorage: function(data) {
				var exist = Module.BaseService.isExistPackInStorage(data.attrs.packName);
				Module.Service.Store.stickerpipe.storeView._sendReturn(exist, data);
			}
		}
	};

})(StickersModule);
