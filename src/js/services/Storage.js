
(function(Plugin) {

	function getKey(key) {
		return Plugin.Configs.storagePrefix + key;
	}

	Plugin.Service.Storage = {

		set: function (key, value) {
			key = getKey(key);

			try {
				localStorage.setItem(key, JSON.stringify({
					data: value
				}));
			} catch (e) {
				console && console.warn('LocalStorage didn\'t successfully save the "{'+ key +': '+ value +'}" pair, because the localStorage is full.');
			}
		},
		get: function (key, missing) {
			key = getKey(key);

			var value;

			try {
				value = JSON.parse(localStorage.getItem(key));
			} catch (e) {
				value = null;
			}

			return (value === null) ? missing : (value.data || missing);
		},
		getAll: function () {
			var keys = Object.keys(localStorage);

			return keys.map((function (key) {
				return this.get(key);
			}).bind(this));
		},
		rm: function (key) {
			key = getKey(key);

			localStorage.removeItem(key);
		},
		flush: function () {
			localStorage.clear();
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
		setPack: function(packName, pack, toBeginning) {
			toBeginning = (typeof toBeginning != 'undefined') ? toBeginning : false;

			var packExist = false,
				packs = this.getPacks();

			for (var i = 0; i < packs.length; i++) {
				if (packName == packs[i].pack_name) {
					packs[i] = pack;
					packExist = true;

					if (toBeginning) {
						packs.splice(i, 1);
					}
					break;
				}
			}

			if (!packExist || toBeginning) {
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

		// todo: create Metadata service
		///////////////////////////////////////
		// Last store visit
		///////////////////////////////////////
		getStoreLastVisit: function() {
			return this.getMetadata()['last_store_visit'] || 0;
		},
		setStoreLastVisit: function(time) {
			return this.setMetadata('last_store_visit', time);
		},

		///////////////////////////////////////
		// Last store visit
		///////////////////////////////////////
		getStoreLastModified: function() {
			return this.getMetadata()['shop_last_modified'];
		},
		setStoreLastModified: function(time) {
			return this.setMetadata('shop_last_modified', time);
		}
	};

})(window.StickersModule);