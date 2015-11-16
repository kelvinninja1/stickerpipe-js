
(function(Plugin, BaseService) {

	Plugin.JsApiInterface = {

		config: null,

		_setConfigs: function(Config) {
			this.config = Config;
		},

		showPackCollections: function(packName) {
			this.config.functions.showPackCollection(packName);
		},

		downloadPack: function(packName, callback) {
			var services = new BaseService(this.config);
			services.updatePacks((function() {
				this.config.functions.showPackCollection(packName);
				callback && callback();
			}).bind(this));
		},

		purchasePackInStore: function(packTitle, packProductId, packPrice, packName) {
			this.config.callbacks.onPurchase(packTitle, packProductId, packPrice, packName);
		},

		isPackActive: function(packName) {
			return this.isPackExistsAtUserLibrary(packName);
		},

		isPackExistsAtUserLibrary: function(packName) {
			var services = new BaseService(this.config);
			return services.isExistPackInStorage(packName);
		}
	};

})(window, StickersModule.BaseService);
