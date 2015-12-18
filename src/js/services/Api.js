
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

	function getCdnUrl() {
		return Module.Configs.cdnUrl + '/' + Module.Configs.baseFolder + '/';
	}

	Module.Api = {

		getStickerUrl: function(packName, stickerName) {
			return getCdnUrl() + packName + '/' + stickerName +
				'_' + Module.Configs.stickerResolutionType + '.png';
		},

		getPackTabIconUrl: function(packName) {
			return getCdnUrl() + packName + '/' +
				'tab_icon_' + Module.Configs.tabResolutionType + '.png';
		},

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