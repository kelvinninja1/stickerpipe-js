
(function(Module) {

	Module.Storage = {

		lockr: Module.Lockr,

		setPrefix: function(storagePrefix) {
			this.lockr.prefix = storagePrefix;
		},


		getUsedStickers: function() {
			return this.lockr.get('sticker_latest_use') || [];
		},
		setUsedStickers: function(usedStickers) {
			return this.lockr.set('sticker_latest_use', usedStickers);
		},
		addUsedSticker: function(stickerCode) {

			var usedStickers = this.getUsedStickers(),
				newStorageDate = [];

			// todo: rewrite function as for & slice
			Module.StickerHelper.forEach(usedStickers, function(usedSticker) {

				if (usedSticker.code != stickerCode) {
					newStorageDate.push(usedSticker);
				}

			});

			usedStickers = newStorageDate;

			usedStickers.unshift({
				code : stickerCode
			});

			this.setUsedStickers(usedStickers);
		},


		getPacks: function() {
			var packs = this.lockr.get('sticker_packs');

			if (typeof packs == 'object' && packs.packs) {
				packs = packs.packs;
			} else if (Object.prototype.toString.call(packs) !== '[object Array]') {
				packs = [];
			}

			return packs;
		},
		setPacks: function(packs) {
			return this.lockr.set('sticker_packs', packs)
		},


		getUniqUserId: function() {
			var uniqUserId = this.lockr.get('uniqUserId');

			if (typeof uniqUserId == 'undefined') {
				uniqUserId = + new Date();
				this.lockr.set('uniqUserId', uniqUserId);
			}

			return uniqUserId;
		},


		getUserData: function() {
			return this.lockr.get('userData');
		},
		setUserData: function(userData) {
			return this.lockr.set('userData', userData);
		},


		getPendingRequestTasks: function() {
			return this.lockr.get('pending_request_tasks') || [];
		},
		setPendingRequestTasks: function(tasks) {
			return this.lockr.set('pending_request_tasks', tasks);
		},
		addPendingRequestTask: function(task) {

			var tasks = this.getPendingRequestTasks();

			tasks.push(task);

			this.setPendingRequestTasks(tasks);
		},
		popPendingRequestTask: function() {
			var tasks = this.getPendingRequestTasks(),
				task = tasks.pop();

			this.setPendingRequestTasks(tasks);

			return task;
		}
	};

})(window.StickersModule);