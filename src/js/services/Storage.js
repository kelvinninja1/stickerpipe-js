
(function(Plugin) {

	Plugin.Service.Storage = {

		lockr: Plugin.Libs.Lockr,

		setPrefix: function(storagePrefix) {
			this.lockr.prefix = storagePrefix;
		},

		///////////////////////////////////////
		// Used stickers
		///////////////////////////////////////
		getRecentStickers: function() {
			return this.lockr.get('recent_stickers') || [];
		},
		setRecentStickers: function(recentStickers) {
			return this.lockr.set('recent_stickers', recentStickers);
		},
		addRecentSticker: function(stickerId) {

			var recentStickers = this.getRecentStickers();

			for (var i = 0; i < recentStickers.length; i++) {
				if (recentStickers[i] == stickerId) {
					recentStickers.splice(i, 1);
				}
			}

			recentStickers.unshift(stickerId);

			this.setRecentStickers(recentStickers);
		},

		///////////////////////////////////////
		// Packs
		///////////////////////////////////////
		getPacks: function() {
			return this.lockr.get('packs') || [];
		},
		setPacks: function(packs) {
			return this.lockr.set('packs', packs)
		},

		getPack: function(packName) {
			var packs = this.getPacks();

			for (var i = 0; i < packs.length; i++) {
				if (packName == packs[i].pack_name) {
					return packs[i];
				}
			}

			return null;
		},
		setPack: function(packName, pack) {

			var packExist = false,
				packs = this.getPacks();

			for (var i = 0; i < packs.length; i++) {
				if (packName == packs[i].pack_name) {
					packs[i] = pack;
					packExist = true;
					break;
				}
			}

			if (!packExist) {
				packs.unshift(pack);
			}

			this.setPacks(packs);
		},

		///////////////////////////////////////
		// Content
		///////////////////////////////////////
		getContent: function() {
			return this.lockr.get('content') || {};
		},
		setContent: function(content) {
			return this.lockr.set('content', content || {})
		},

		getContentById: function(id) {
			return this.getContent()['id' + id] || null;
		},
		setContentById: function(id, data) {
			var content = this.getContent();
			content['id' + id] = data || null;
			this.setContent(content);
		},
		///////////////////////////////////////
		// Device ID
		///////////////////////////////////////
		getDeviceId: function() {
			var deviceId = this.lockr.get('device_id');

			if (typeof deviceId == 'undefined') {
				deviceId = + new Date();
				this.lockr.set('device_id', deviceId);
			}

			return deviceId;
		},

		///////////////////////////////////////
		// User ID
		///////////////////////////////////////
		getUserId: function() {
			return this.lockr.get('user_id');
		},
		setUserId: function(userId) {
			return this.lockr.set('user_id', userId);
		},

		///////////////////////////////////////
		// User data
		///////////////////////////////////////
		getUserData: function() {
			return this.lockr.get('user_data');
		},
		setUserData: function(userData) {
			return this.lockr.set('user_data', userData);
		},

		///////////////////////////////////////
		// Pending request
		///////////////////////////////////////
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