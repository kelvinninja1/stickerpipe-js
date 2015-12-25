
(function(Plugin, Module) {

	function buildStoreUrl(uri) {
		var params = {
			apiKey: Module.Configs.apiKey,
			platform: 'JS',
			userId: Module.Configs.userId,
			density: Module.Configs.stickerResolutionType,
			priceB: Module.Configs.priceB,
			priceC: Module.Configs.priceC,
			isPremium: Module.Configs.userPremium,
			localization: Module.Configs.lang
		};

		return Module.Configs.storeUrl + ((Module.Configs.storeUrl.indexOf('?') == -1) ? '?' : '&')
			+ Module.StickerHelper.urlParamsSerialize(params) + '#/' + uri;
	}

	function getCdnUrl() {
		return Module.Configs.cdnUrl + '/stk/';
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
			var url = getApiUrl('client-packs');

			if (Module.Configs.userId !== null) {
				url = getApiUrl('user/packs');
			}

			Module.Http.get(url, {
				success: successCallback
			});
		},

		sendStatistic: function(statistic) {
			Module.Http.post(getApiUrl('track-statistic'), statistic);
		},

		updateUserData: function(userData) {
			return Module.Http.ajax({
				type: 'PUT',
				url: getApiUrl('user'),
				data: userData,
				headers: {
					'Content-Type': 'application/json'
				}
			});
		},

		changeUserPackStatus: function(packName, status, pricePoint, callbacks) {
			var url = getApiUrl('user/pack/' + packName),
				purchaseType = 'free';

			if (pricePoint == 'B') {
				purchaseType = 'oneoff';
				if (Module.Configs.userPremium) {
					purchaseType = 'subscription';
				}
			} else if (pricePoint == 'C') {
				purchaseType = 'oneoff';
			}

			url += '?' + Module.StickerHelper.urlParamsSerialize({
					purchase_type: purchaseType
				});

			Module.Http.post(url, {
				status: status
			}, callbacks, {
				'Content-Type': 'application/json'
			});
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