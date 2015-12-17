
(function(Plugin, Module) {

	function buildStoreUrl(uri) {
		var params = {
			apiKey: Module.Configs.apikey,
			platform: 'JS',
			userId: Module.Configs.userId,
			density: Module.Configs.stickerResolutionType
		};

		return Module.Configs.storeUrl + ((Module.Configs.storeUrl.indexOf('?') == -1) ? '?' : '&')
			+ Module.StickerHelper.urlParamsSerialize(params) + '#/' + uri;
	}
	Module.Api = {

		store: {
			getStoreUrl: function() {
				return buildStoreUrl('store/');
			},

			getPackUrl: function(packName) {
				return buildStoreUrl('packs/' + packName);
			}
		}

	};
})(window, window.StickersModule);