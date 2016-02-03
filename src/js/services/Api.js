
(function(Plugin) {

	var API_VERSION = 2;

	Plugin.Service.Api = {

		getApiVersion: function() {
			return API_VERSION;
		},

		getPacks: function(doneCallback) {
			var url = Plugin.Service.Url.getPacksUrl();

			Plugin.Service.Http.get(url, {
				success: doneCallback
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

		changeUserPackStatus: function(packName, status, pricePoint, doneCallback) {

			var url = Plugin.Service.Url.getUserPackUrl(packName, pricePoint);

			Plugin.Service.Http.post(url, {
				status: status
			}, {
				success: function() {
					doneCallback && doneCallback();
				},
				error: function() {
					if (status) {
						var pr = Plugin.Service.PendingRequest;
						pr.add(pr.tasks.activateUserPack, {
							packName: packName,
							pricePoint: pricePoint
						});
					}
				}
			});
		}

	};
})(window.StickersModule);