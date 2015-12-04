
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

		hasNewStickers: function() {
			return this.lockr.get('sticker_have_new');
		},

		setHasNewStickers: function(value) {
			return this.lockr.set('sticker_have_new', value);
		},

		getPacks: function() {
			return this.lockr.get('sticker_packs');
		},

		setPacks: function(packs) {
			var expireDate = new Date(),
				saveObj = {
					packs: packs,
					expireDate: ( expireDate.setDate( expireDate.getDate() + 1) )
				};

			return this.lockr.set('sticker_packs', saveObj)
		},

		getUniqUserId: function() {
			var uniqUserId = this.lockr.get('uniqUserId');

			if (typeof uniqUserId == 'undefined') {
				uniqUserId = + new Date();
				this.lockr.set('uniqUserId', uniqUserId);
			}

			return uniqUserId;
		}
	};

})(window.StickersModule);