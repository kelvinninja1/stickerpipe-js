
(function(Module) {

	var API_VERSION = 1;

	Module.Service.Api = {

		getApiVersion: function() {
			return API_VERSION;
		},

		getPacks: function(doneCallback) {
			var url = Module.Service.Url.getPacksUrl();

			Module.Service.Http.get(url, {
				success: doneCallback
			});
		},

		sendStatistic: function(statistic) {
			Module.Service.Http.post(Module.Service.Url.getStatisticUrl(), statistic);
		},

		updateUserData: function(userData) {
			return Module.Service.Http.ajax({
				type: 'PUT',
				url: Module.Service.Url.getUserDataUrl(),
				data: userData,
				headers: {
					'Content-Type': 'application/json'
				}
			});
		},

		changeUserPackStatus: function(packName, status, pricePoint, doneCallback) {

			var url = Module.Service.Url.getUserPackUrl(packName, pricePoint);

			Module.Service.Http.post(url, {
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