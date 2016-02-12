
(function(Plugin) {


	Plugin.Service.Sticker = {

		parseStickerId: function(text) {
			if (!text) {
				return null;
			}

			var stickerId = null,
				formatV1 = text.match(/\[\[(\S+)_(\S+)\]\]/),
				formatV2 = text.match(/\[\[(\d+)\]\]/);

			if (formatV1) {
				stickerId = formatV1[1] + '_' + formatV1[2];
			} else if (formatV2) {
				stickerId = formatV2[1];
			}

			return stickerId;
		},

		parse: function(text, callback) {

			var stickerId = this.parseStickerId(text);

			if (!stickerId) {
				callback && callback(null);
				return;
			}

			Plugin.Service.Sticker.getById(stickerId, function(sticker) {
				var url = sticker.image && sticker.image[Plugin.Configs.stickerResolutionType];

				callback && callback({
					id: stickerId,
					url: url,
					html: '<img src="' + url + '" class="stickerpipe-sticker" data-sticker-id="' + stickerId + '">'
				});
			});
		},

		getById: function(contentId, successCallback) {
			var sticker = Plugin.Service.Storage.getContentById(contentId);

			if (sticker) {
				successCallback && successCallback(sticker);
				return;
			}

			Plugin.Service.Api.getContentById(contentId, function(sticker) {
				Plugin.Service.Storage.setContentById(contentId, sticker);
				successCallback && successCallback(sticker);
			});
		},

		isSticker: function(text) {
			return !!this.parseStickerId(text);
		}
	};
})(window.StickersModule);