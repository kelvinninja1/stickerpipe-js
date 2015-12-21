
(function(Module) {

	Module.Service.Store = Module.Class({

		stickerpipe: null,

		window: null,
		hasEventListener: false,

		_constructor: function(stickerpipe) {
			this.stickerpipe = stickerpipe;
		},

		_return: function(value, data) {
			this.window.postMessage(JSON.stringify({
				action: data.action,
				value: value,
				hashKey: data.hashKey
			}), document.location.origin);
		},

		_setWindow: function(_window) {
			this.window = _window;

			if (!this.hasEventListener) {
				window.addEventListener('message', (function(e) {
					var data = JSON.parse(e.data);

					if (!data.action) {
						return;
					}

					try {
						this[data.action].call(this, data);
					} catch(ex) {
						console && console.error(ex.message, ex);
					}

				}).bind(this));

				this.hasEventListener = true;
			}
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
			return this.isPackExistsInStorage(packName);
		},

		isPackExistsInStorage: function(data) {
			var exist = Module.BaseService.isExistPackInStorage(data.attrs.packName);
			this._return(exist, data);
		}
	});

})(StickersModule);
