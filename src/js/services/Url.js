
(function(Plugin) {

	Plugin.Service.Url = {

		buildStoreUrl: function(uri) {
			uri = uri || '';

			var platform = 'JS',
				style = platform,
				primaryColor = Plugin.Configs.primaryColor;

			if (Plugin.Service.Helper.getMobileOS() == 'ios' || navigator.appVersion.indexOf('Mac') != -1) {
				style = 'ios';
			}

			if (primaryColor.charAt(0) == '#') {
				primaryColor = primaryColor.substr(1);
			}

			var params = {
				apiKey: Plugin.Configs.apiKey,
				platform: platform,
				userId: Plugin.Configs.userId,
				density: Plugin.Configs.resolution,
				priceB: Plugin.Configs.priceB,
				priceC: Plugin.Configs.priceC,
				is_subscriber: (Plugin.Configs.userPremium ? 1 : 0),
				localization: Plugin.Configs.lang,
				style: style,
				primaryColor: primaryColor
			};

			var url = Plugin.Configs.storeUrl || this.buildApiUrl('/web');

			url += ((url.indexOf('?') == -1) ? '?' : '&')
				+ Plugin.Service.Helper.urlParamsSerialize(params)
				+ '#/' + uri;

			return url;
		},

		buildApiUrl: function(uri) {
			uri = uri || '';

			return Plugin.Configs.apiUrl + '/api/v' + Plugin.Service.Api.getApiVersion() + uri;
		},

		getUserPacksUrl: function() {
			var url = this.buildApiUrl('/shop/my');

			if (Plugin.Configs.userPremium) {
				url += '?is_subscriber=1';
			}

			return url;
		},

		getPackPreviewUrl: function(packName) {
			var url = this.buildApiUrl('/packs/' + packName);

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

		getPurchaseUrl: function(packName, pricePoint) {

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
			var url = this.buildApiUrl('/packs/' + packName);
			url += '?' + Plugin.Service.Helper.urlParamsSerialize({
					purchase_type: purchaseType
				});

			return url;
		},

		getContentByIdUrl: function(contentId) {
			return this.buildApiUrl('/content/' + contentId);
		},

		getHidePackUrl: function(packName) {
			return this.buildApiUrl('/packs/' + packName);
		},

		getStoreUrl: function() {
			return this.buildStoreUrl('store/');
		},

		getStorePackUrl: function(packName) {
			return this.buildStoreUrl('packs/' + packName);
		}

	};
})(window.StickersModule);