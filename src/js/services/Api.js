
(function(Plugin) {

	var API_VERSION = 2;

	Plugin.Service.Api = {

		getApiVersion: function() {
			return API_VERSION;
		},

		getPacks: function(successCallback) {
			var url = Plugin.Service.Url.getPacksUrl();

			Plugin.Service.Http.get(url, {
				success: function(response) {
					successCallback && successCallback(response.data);
				}
			});
		},

		sendStatistic: function(statistic) {
			Plugin.Service.Http.post(Plugin.Service.Url.getStatisticUrl(), statistic);
		},

		updateUserData: function(userData) {
			return Plugin.Service.Http.ajax({
				type: 'PUT',
				url: Plugin.Service.Url.getUserDataUrl(),
				data: userData,
				headers: {
					'Content-Type': 'application/json'
				}
			});
		},

		purchasePack: function(packName, pricePoint, successCallback) {
			Plugin.Service.Http.post(Plugin.Service.Url.getPurchaseUrl(packName, pricePoint), {}, {
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
			Plugin.Service.Http.get(Plugin.Service.Url.getContentByIdUrl(contentId), {
				success: function(response) {
					successCallback && successCallback(response.data);
				}
			});
		}
	};
})(window.StickersModule);