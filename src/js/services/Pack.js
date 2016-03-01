
(function(Plugin) {

	var stickerpipe;

	Plugin.Service.Pack = {

		init: function(_stickerpipe) {
			stickerpipe = _stickerpipe;
		},

		purchase: function(packName, pricePoint, isUnwatched, successCallback, failCallback) {
			isUnwatched = (typeof isUnwatched == 'undefined') ? true : isUnwatched;

			Plugin.Service.Api.purchasePack(packName, pricePoint, function(pack) {
				pack.isUnwatched = isUnwatched;

				var packContentIds = [];
				for (var i = 0; i < pack.stickers.length; i++) {
					var sticker = pack.stickers[i];
					sticker.pack = packName;

					Plugin.Service.Storage.setContentById(sticker.content_id, sticker);

					packContentIds.push(sticker.content_id);
				}

				pack.stickers = packContentIds;

				Plugin.Service.Storage.setPack(pack.pack_name, pack);

				if (stickerpipe && stickerpipe.view.isRendered) {
					stickerpipe.view.tabsView.renderPacks();
				}

				successCallback && successCallback(pack);
			}, function() {
				failCallback && failCallback();
			});
		},

		remove: function(packName, successCallback, failCallback) {
			Plugin.Service.Api.hidePack(packName, function() {

				var pack = Plugin.Service.Storage.getPack(packName);
				pack.user_status = 'hidden';
				Plugin.Service.Storage.setPack(packName, pack);

				if (stickerpipe && stickerpipe.view.isRendered) {
					stickerpipe.view.tabsView.renderPacks();
					stickerpipe.view.tabsView.controls.history.el.click();
				}

				successCallback && successCallback();
			}, function() {
				failCallback && failCallback();
			});
		},

		getMainIcon: function(packName, successCallback) {
			Plugin.Service.Api.getPackPreview(packName, function(pack) {
				var url = (pack && pack.main_icon && pack.main_icon[Plugin.Configs.stickerResolutionType]) || null;

				successCallback && successCallback(url);
			});
		},

		isHidden: function(pack) {
			return pack.user_status == 'hidden';
		}
	};

})(window.StickersModule);