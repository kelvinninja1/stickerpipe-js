
(function(Module) {

	// todo: rewrite
	Module.StoreApiInterface = Module.Class({

		config: null,
		service: null,

		_constructor: function(config, service) {
			this.config = config;
			this.service = service;

			window.addEventListener('message', (function(e) {

				e.data = JSON.parse(e.data);

				if (e.data.action) {
					return;
				}

				try {
					this[e.action].apply(this, e.data.attrs);
				} catch(e) {
					console && console.error(e.message, e);
				}

			}).bind(this));
		},

		showPackCollections: function(packName) {
			// todo remove functions
			this.config.functions.showPackCollection(packName);
		},

		downloadPack: function(packName, callback) {
			this.service.updatePacks((function() {
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
			return this.service.isExistPackInStorage(packName);
		}
	});

})(StickersModule);
