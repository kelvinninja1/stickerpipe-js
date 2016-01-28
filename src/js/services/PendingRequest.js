
(function(Plugin) {

	function activateUserPack(taskData) {
		Plugin.Service.Pack.activateUserPack(taskData.packName, taskData.pricePoint);
	}

	Plugin.Service.PendingRequest = {

		tasks: {
			activateUserPack: 'activateUserPack'
		},

		init: function() {
			this.run();
		},

		add: function(taskName, taskData) {
			Plugin.Service.Storage.addPendingRequestTask({
				name: taskName,
				data: taskData
			});
		},

		run: function() {
			var task = Plugin.Service.Storage.popPendingRequestTask();

			while(task) {
				switch (task.name) {
					case this.tasks.activateUserPack:
						activateUserPack(task.data);
						break;
					default :
						break;
				}

				task = Plugin.Service.Storage.popPendingRequestTask();
			}
		}

	};
})(window.StickersModule);