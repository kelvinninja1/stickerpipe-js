
(function(Plugin, Module) {

	var stickerpipe;

	Module.Api= {

		init: function(_stickerpipe) {
			stickerpipe = _stickerpipe;
		},

		showCollections: function(data) {
			Module.View.close();
			stickerpipe.open(data.attrs.packName);
		},

		purchasePack: function(data) {
			var packName = data.attrs.packName,
				packTitle = data.attrs.packTitle,
				pricePoint = data.attrs.pricePoint;

			if (pricePoint == 'A' || (pricePoint == 'B' && Plugin.Configs.userPremium)) {
				Module.Controller.downloadPack(packName, pricePoint);
			} else {
				Module.Controller.onPurchaseCallback &&
				Module.Controller.onPurchaseCallback(packName, packTitle, pricePoint);
			}
		},

		showPagePreloader: function(data) {
			Module.View.showPagePreloader(data.attrs.show);
		},

		removePack: function(data) {
			Plugin.Service.Pack.remove(data.attrs.packName, function() {
				Module.Controller.reloadStore();
			});
		},

		showBackButton: function(data) {
			Module.View.showBackButton(data.attrs.show);
		},

		setYScroll: function(data) {
			Module.View.setYScroll(data.attrs.yPosition);
		},

		keyUp: function(data) {
			var ESC_CODE = 27;

			if (data.attrs.keyCode == ESC_CODE) {
				Module.View.close();
			}
		}
	};

})(StickersModule, StickersModule.Module.Store);
