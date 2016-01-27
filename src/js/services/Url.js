
(function(Module) {

	Module.Service.Url = {

		buildStoreUrl: function(uri) {
			uri = uri || '';

			var params = {
				apiKey: Module.Configs.apiKey,
				platform: 'JS',
				userId: Module.Configs.userId,
				density: Module.Configs.stickerResolutionType,
				priceB: Module.Configs.priceB,
				priceC: Module.Configs.priceC,
				is_subscriber: (Module.Configs.userPremium ? 1 : 0),
				localization: Module.Configs.lang
			};

			return Module.Configs.storeUrl + ((Module.Configs.storeUrl.indexOf('?') == -1) ? '?' : '&')
				+ Module.Service.Helper.urlParamsSerialize(params) + '#/' + uri;
		},

		buildCdnUrl: function(uri) {
			uri = uri || '';

			return Module.Configs.cdnUrl + '/stk/' + uri;
		},

		buildApiUrl: function(uri) {
			uri = uri || '';

			return Module.Configs.apiUrl + '/api/v' + Module.Service.Api.getApiVersion() + '/' + uri;
		},

		getStickerUrl: function(packName, stickerName) {
			return this.buildCdnUrl(
				packName + '/' + stickerName +
				'_' + Module.Configs.stickerResolutionType + '.png'
			);
		},

		getPackTabIconUrl: function(packName) {
			return this.buildCdnUrl(
				packName + '/' +
				'tab_icon_' + Module.Configs.tabResolutionType + '.png'
			);
		},

		getPacksUrl: function() {
			var url = this.buildApiUrl('client-packs');

			if (Module.Configs.userId !== null) {
				url = this.buildApiUrl('packs');

				if (Module.Configs.userPremium) {
					url += '?is_subscriber=1';
				}
			}

			return url;
		},

		getStatisticUrl: function() {
			return this.buildApiUrl('track-statistic');
		},

		getUserDataUrl: function() {
			return this.buildApiUrl('user');
		},

		getUserPackUrl: function(packName, pricePoint) {

			// detect purchase type
			var purchaseType = 'free';
			if (pricePoint == 'B') {
				purchaseType = 'oneoff';
				if (Module.Configs.userPremium) {
					purchaseType = 'subscription';
				}
			} else if (pricePoint == 'C') {
				purchaseType = 'oneoff';
			}

			// build url
			var url = this.buildApiUrl('user/pack/' + packName);
			url += '?' + Module.Service.Helper.urlParamsSerialize({
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