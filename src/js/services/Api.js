
(function(Plugin) {

	var API_VERSION = 2;

	Plugin.Service.Api = {

		getApiVersion: function() {
			return API_VERSION;
		},

		getPacks: function(successCallback) {
			var url = Plugin.Service.Url.getPacksUrl();

			Plugin.Service.Ajax({
				type: 'get',
				url: url,
				success: function(response) {
					response = response || {};
					response.meta = response.meta || {};
					response.meta.shop_last_modified = response.meta.shop_last_modified || 0;

					Plugin.Service.Storage.setStoreLastModified(response.meta.shop_last_modified * 1000);

					successCallback && successCallback(response.data);
				}
			});
		},

		sendStatistic: function(statistic) {
			Plugin.Service.Ajax({
				type: 'post',
				url: Plugin.Service.Url.getStatisticUrl(),
				data: statistic
			});
		},

		updateUserData: function(userData) {
			return Plugin.Service.Ajax({
				type: 'put',
				url: Plugin.Service.Url.getUserDataUrl(),
				data: userData,
				headers: {
					'Content-Type': 'application/json'
				}
			});
		},

		purchasePack: function(packName, pricePoint, successCallback) {
			Plugin.Service.Ajax({
				type: 'post',
				url: Plugin.Service.Url.getPurchaseUrl(packName, pricePoint),
				success: function(response) {
					successCallback && successCallback(response.data);
				},
				error: function() {
					var pr = Plugin.Service.PendingRequest;
					pr.add(pr.tasks.purchasePack, {
						packName: packName,
						pricePoint: pricePoint
					});
				}
			});
		},

		getContentById: function(contentId, successCallback) {
			Plugin.Service.Ajax({
				type: 'get',
				url: Plugin.Service.Url.getContentByIdUrl(contentId),
				success: function(response) {
					successCallback && successCallback(response.data);
				}
			});
		},

		hidePack: function(packName, successCallback) {
			return Plugin.Service.Ajax({
				type: 'DELETE',
				url: Plugin.Service.Url.getHidePackUrl(packName),
				success: function(response) {
					successCallback && successCallback(response.data);
				}
			});
		}
	};
})(window.StickersModule);