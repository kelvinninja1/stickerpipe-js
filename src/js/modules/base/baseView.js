
(function(Plugin, Module) {

	var StickerHelper = Module.StickerHelper;

	Plugin.StickersModule.BaseView = Module.Class({

		config: null,
		service: null,

		el: null,
		stickersEl:  null,

		controlTabs:  {},

		tabsView: null,

		_constructor: function(config, service) {
			this.config = config;
			this.service = service;

			this.tabsView = new Module.TabsView(this.config);

			this.el = document.getElementById(this.config.elId);
			this.stickersEl = document.createElement('div');
		},

		clearBlock: function(el) {
			el.setAttribute('style', 'display:block');
			el.innerHTML = '';
		},

		render: function(stickerPacks) {
			this.tabsView.render(stickerPacks);

			this.el.innerHTML = '';

			this.el.classList.add('sticker-pipe');

			this.stickersEl.classList.add('sp-stickers');

			this.el.appendChild(this.tabsView.el);
			this.el.appendChild(this.stickersEl);

			this.tabsView.onWindowResize();
		},

		renderUsedStickers: function(latesUseSticker) {
			var self = this;

			this.clearBlock(self.stickersEl);

			if (latesUseSticker.length == 0) {

				this.stickersEl.innerHTML += this.config.htmlForEmptyRecent;

				return false;
			}


			StickerHelper.forEach(latesUseSticker, (function(sticker) {

				var icon_src = this.service.parseStickerFromText("[[" + sticker.code + "]]"),
					packItem;

				packItem = "<span data-sticker-string=" + sticker.code +" class=" + self.config.stickerItemClass + "> <img src=" + icon_src.url + "></span>";

				self.stickersEl.innerHTML += packItem;
			}).bind(this));

		},

		renderCustomBlock: function() {
			this.clearBlock(this.stickersEl);
		},

		renderPack: function(pack) {
			var self = this;

			this.clearBlock(this.stickersEl);

			var i = -1;
			StickerHelper.forEach(pack.stickers, function(sticker) {

				var placeHolderClass = 'sp-sticker-placeholder';

				i++;

				var stickerImgSrc = self.service.parseStickerFromText('[[' + pack.pack_name + '_' + sticker.name + ']]');

				var stickersSpanEl = document.createElement('span');
				stickersSpanEl.setAttribute('data-sticker-string', pack.pack_name + '_' + sticker.name);
				stickersSpanEl.classList.add(
					self.config.stickerItemClass,
					placeHolderClass
				);

				if (i == 0) {
					stickerImgSrc.url = '_' + stickerImgSrc.url;
				}

				var image = new Image();
				image.onload = function() {
					stickersSpanEl.classList.remove(placeHolderClass);
					stickersSpanEl.appendChild(image);
					console.log('ok load');
				};
				image.onerror = function() {
					console.log('error');
				};

				image.src = stickerImgSrc.url;

				self.stickersEl.appendChild(stickersSpanEl);
			});
		},

		handleClickSticker: function(callback) {
			Module.StickerHelper.setEvent('click', this.stickersEl, this.config.stickerItemClass, callback);
		}

	});

})(window, window.StickersModule);