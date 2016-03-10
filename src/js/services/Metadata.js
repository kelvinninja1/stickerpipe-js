
(function(Plugin) {

	Plugin.Service.Metadata = {

		metadata: null,

		get: function(key) {
			this.metadata = this.metadata || Plugin.Service.Storage.getMetadata() || {};
			return this.metadata[key] || null;
		},
		set: function(key, value) {
			this.metadata = this.metadata || Plugin.Service.Storage.getMetadata() || {};
			this.metadata[key] =  value;

			Plugin.Service.Storage.setMetadata(this.metadata);
		},

		///////////////////////////////////////
		// Last store visit
		///////////////////////////////////////
		getStoreLastVisit: function() {
			return this.get('last_store_visit') || 0;
		},
		setStoreLastVisit: function(time) {
			return this.set('last_store_visit', time);
		},

		///////////////////////////////////////
		// Last store visit
		///////////////////////////////////////
		getStoreLastModified: function() {
			return this.get('shop_last_modified');
		},
		setStoreLastModified: function(time) {
			return this.set('shop_last_modified', time);
		}
	};

})(window.StickersModule);