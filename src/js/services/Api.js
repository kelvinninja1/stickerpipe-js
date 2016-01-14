
(function(Module) {

	var API_VERSION = 1;

	Module.Api = {

		getApiVersion: function() {
			return API_VERSION;
		},

		getPacks: function(doneCallback) {
			var url = Module.Url.getPacksUrl();

			Module.Http.get(url, {
				success: doneCallback
			});
		},

		sendStatistic: function(statistic) {
			Module.Http.post(Module.Url.getStatisticUrl(), statistic);
		},

		updateUserData: function(userData) {
			return Module.Http.ajax({
				type: 'PUT',
				url: Module.Url.getUserDataUrl(),
				data: userData,
				headers: {
					'Content-Type': 'application/json'
				}
			});
		},

		changeUserPackStatus: function(packName, status, pricePoint, doneCallback) {

			var url = Module.Url.getUserPackUrl(packName, pricePoint);

			Module.Http.post(url, {
				status: status
			}, {
				success: function() {
					doneCallback && doneCallback();
				},
				error: function() {
					if (status) {
						var pr = Module.Service.PendingRequest;
						pr.add(pr.tasks.activateUserPack, {
							packName: packName,
							pricePoint: pricePoint
						});
					}
				}
			}, {
				'Content-Type': 'application/json'
			});
		}

	};
})(window.StickersModule);