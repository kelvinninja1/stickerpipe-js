
(function(Plugin) {

	function purchasePack(taskData) {
		Plugin.Service.Pack.purchase(taskData.packName, taskData.pricePoint);
	}

	Plugin.Service.PendingRequest = {

		tasks: {
			activateUserPack: 'activateUserPack',
			purchasePack: 'purchasePack'
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
					case this.tasks.purchasePack:
						purchasePack(task.data);
						break;
					default :
						break;
				}

				task = Plugin.Service.Storage.popPendingRequestTask();
			}
		}

	};
})(window.StickersModule);