
(function(Plugin) {


	Plugin.Service.Sticker = {
		parse: function(text) {
			// todo: add method isSticker
			var result = {
					isSticker: false,
					url: ''
				},
				matchData = text.match(/\[\[(\S+)_(\S+)\]\]/);

			if (matchData) {
				result.isSticker = true;
				result.url = Plugin.Service.Url.getStickerUrl(matchData[1], matchData[2]);


				result.pack = matchData[1];
				result.name = matchData[2];
			}

			return result;
		}
	};
})(window.StickersModule);