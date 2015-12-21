
(function(Module) {

	Module.Service.Store = {

		stickerpipe: null,

		init: function(stickerpipe) {
			this.stickerpipe = stickerpipe;
			return this;
		},

		showPackCollections: function(data) {
			this.stickerpipe.storeView.close();
			this.stickerpipe.open(data.attrs.packName);
		},

		downloadPack: function(data) {
			this.service.updatePacks((function() {
				this.config.functions.showPackCollection(packName);
				callback && callback();
			}).bind(this));
		},

		purchasePackInStore: function(data) {
			this.config.callbacks.onPurchase(packTitle, packProductId, packPrice, packName);
		},

		isPackActive: function(data) {
			return this.isPackExistsInStorage(data);
		},

		isPackExistsInStorage: function(data) {
			var exist = Module.BaseService.isExistPackInStorage(data.attrs.packName);
			this.stickerpipe.storeView._sendReturn(exist, data);
		}
	};

})(StickersModule);
