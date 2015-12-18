
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

	function getApiUrl(uri) {
		return Module.Configs.apiUrl + '/api/v1/' + uri;
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

		getPacks: function(successCallback) {
			var options = {
				url: getApiUrl('client-packs'),
				header: []
			};

			if (Module.Configs.userId !== null) {
				options.url = getApiUrl('user/packs');
				options.header['UserId'] = Module.StickerHelper.md5(Module.Configs.userId + Module.Configs.apikey);
			}

			Module.Http.get(options.url, {
				success: successCallback
			}, options.header);
		},

		sendStatistic: function(statistic) {
			Module.Http.post(getApiUrl('track-statistic'), statistic);
		},

		changeUserPackStatus: function(packName, status, callback) {
			var url = getApiUrl('user/pack/' + packName),
				headers = {
					UserId: Module.StickerHelper.md5(Module.Configs.userId + Module.Configs.apikey)
				};

			// todo: rewrite callback

			Module.Http.post(url, {
				status: status
			}, {
				success: callback
			}, headers);
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