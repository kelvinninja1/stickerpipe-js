
(function(Plugin) {

	Plugin.Service.Url = {

		buildStoreUrl: function(uri) {
			uri = uri || '';

			var params = {
				apiKey: Plugin.Configs.apiKey,
				platform: 'JS',
				userId: Plugin.Configs.userId,
				density: Plugin.Configs.stickerResolutionType,
				priceB: Plugin.Configs.priceB,
				priceC: Plugin.Configs.priceC,
				is_subscriber: (Plugin.Configs.userPremium ? 1 : 0),
				localization: Plugin.Configs.lang
			};

			return Plugin.Configs.storeUrl + ((Plugin.Configs.storeUrl.indexOf('?') == -1) ? '?' : '&')
				+ Plugin.Service.Helper.urlParamsSerialize(params) + '#/' + uri;
		},

		buildCdnUrl: function(uri) {
			uri = uri || '';

			return Plugin.Configs.cdnUrl + '/stk/' + uri;
		},

		buildApiUrl: function(uri) {
			uri = uri || '';

			return Plugin.Configs.apiUrl + '/api/v' + Plugin.Service.Api.getApiVersion() + uri;
		},

		getStickerUrl: function(packName, stickerName) {
			return this.buildCdnUrl(
				packName + '/' + stickerName +
				'_' + Plugin.Configs.stickerResolutionType + '.png'
			);
		},

		getPackTabIconUrl: function(packName) {
			return this.buildCdnUrl(
				packName + '/' +
				'tab_icon_' + Plugin.Configs.tabResolutionType + '.png'
			);
		},

		getPacksUrl: function() {
			var url = this.buildApiUrl('/shop/my');

			if (Plugin.Configs.userPremium) {
				url += '?is_subscriber=1';
			}

			return url;
		},

		getStatisticUrl: function() {
			return this.buildApiUrl('/statistics');
		},

		getUserDataUrl: function() {
			return this.buildApiUrl('/user');
		},

		getUserPackUrl: function(packName, pricePoint) {

			// detect purchase type
			var purchaseType = 'free';
			if (pricePoint == 'B') {
				purchaseType = 'oneoff';
				if (Plugin.Configs.userPremium) {
					purchaseType = 'subscription';
				}
			} else if (pricePoint == 'C') {
				purchaseType = 'oneoff';
			}

			// build url
			var url = this.buildApiUrl('/user/pack/' + packName);
			url += '?' + Plugin.Service.Helper.urlParamsSerialize({
					purchase_type: purchaseType
				});

			return url;
		},

		getStoreUrl: function() {
			return this.buildStoreUrl('store/');
		},

		getStorePackUrl: function(packName) {
			return this.buildStoreUrl('packs/' + packName);
		}

	};
})(window.StickersModule);