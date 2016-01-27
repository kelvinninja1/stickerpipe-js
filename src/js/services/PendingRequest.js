
(function(Module) {

	function activateUserPack(taskData) {
		Module.Service.Pack.activateUserPack(taskData.packName, taskData.pricePoint);
	}

	Module.Service.PendingRequest = {

		tasks: {
			activateUserPack: 'activateUserPack'
		},

		add: function(taskName, taskData) {
			Module.Service.Storage.addPendingRequestTask({
				name: taskName,
				data: taskData
			});
		},

		run: function() {
			var task = Module.Service.Storage.popPendingRequestTask();

			while(task) {
				switch (task.name) {
					case this.tasks.activateUserPack:
						activateUserPack(task.data);
						break;
					default :
						break;
				}

				task = Module.Service.Storage.popPendingRequestTask();
			}
		}

	};
})(window.StickersModule);