
(function(Plugin, Module) {

	var stickerpipe;

	function isPackHidden(packName) {
		var packs = Plugin.Service.Storage.getPacks();

		for (var i = 0; i < packs.length; i++) {
			if (packs[i].pack_name == packName) {
				return Plugin.Service.Pack.isHidden(packs[i]);
			}
		}

		return false;
	}

	Module.Api= {

		init: function(_stickerpipe) {
			stickerpipe = _stickerpipe;
		},

		showPack: function(data) {
			Module.View.close();
			stickerpipe.open(data.attrs.packName);
		},

		purchasePack: function(data) {
			var packName = data.attrs.packName,
				packTitle = data.attrs.packTitle,
				pricePoint = data.attrs.pricePoint;

			var isHidden = isPackHidden(packName);

			if (pricePoint == 'A' || (pricePoint == 'B' && Plugin.Configs.userPremium) || isHidden) {
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
			Module.Controller.removePack(data.attrs.packName);
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
