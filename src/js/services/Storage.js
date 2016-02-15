
(function(Plugin) {

	var lockr = Plugin.Libs.Lockr;

	Plugin.Service.Storage = {

		get: function(key) {
			lockr.prefix = Plugin.Configs.storagePrefix;
			return lockr.get(key);
		},
		set: function(key, data) {
			lockr.prefix = Plugin.Configs.storagePrefix;
			return lockr.set(key, data);
		},

		///////////////////////////////////////
		// Used stickers
		///////////////////////////////////////
		getRecentStickers: function() {
			return this.get('recent_stickers') || [];
		},
		setRecentStickers: function(recentStickers) {
			return this.set('recent_stickers', recentStickers);
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
			return this.get('packs') || [];
		},
		setPacks: function(packs) {
			return this.set('packs', packs)
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
			return this.get('content') || {};
		},
		setContent: function(content) {
			return this.set('content', content || {})
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
			var deviceId = this.get('device_id');

			if (typeof deviceId == 'undefined') {
				deviceId = + new Date();
				this.set('device_id', deviceId);
			}

			return deviceId;
		},

		///////////////////////////////////////
		// User ID
		///////////////////////////////////////
		getUserId: function() {
			return this.get('user_id');
		},
		setUserId: function(userId) {
			return this.set('user_id', userId);
		},

		///////////////////////////////////////
		// User data
		///////////////////////////////////////
		getUserData: function() {
			return this.get('user_data');
		},
		setUserData: function(userData) {
			return this.set('user_data', userData);
		},

		///////////////////////////////////////
		// Pending request
		///////////////////////////////////////
		getPendingRequestTasks: function() {
			return this.get('pending_request_tasks') || [];
		},
		setPendingRequestTasks: function(tasks) {
			return this.set('pending_request_tasks', tasks);
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
		},

		///////////////////////////////////////
		// Metadata
		///////////////////////////////////////
		getMetadata: function(key) {
			var metadata = this.get('metadata');

			if (key) {
				metadata = metadata[key];
			}

			return metadata;
		},
		setMetadata: function(key, value) {
			var metadata = this.getMetadata() || {};

			metadata[key] = value;

			return this.set('metadata', metadata);
		},

		///////////////////////////////////////
		// Last store visit
		///////////////////////////////////////
		getStoreLastVisit: function() {
			return this.getMetadata()['last_store_visit'];
		},
		setStoreLastVisit: function(time) {
			time = time || +(new Date());
			return this.setMetadata('last_store_visit', time);
		},

		///////////////////////////////////////
		// Last store visit
		///////////////////////////////////////
		getStoreLastModified: function() {
			return this.getMetadata()['shop_last_modified'];
		},
		setStoreLastModified: function(time) {
			time = time || +(new Date());
			return this.setMetadata('shop_last_modified', time);
		}
	};

})(window.StickersModule);