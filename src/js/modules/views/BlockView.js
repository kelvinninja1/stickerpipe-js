
(function(Plugin, Module) {

	var StickerHelper = Module.StickerHelper;

	Plugin.StickersModule.BlockView = Module.Class({

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

			window.addEventListener('resize', (function() {
				this.onWindowResize();
			}).bind(this));
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
			this.onWindowResize();
		},

		renderUsedStickers: function(latesUseSticker) {

			this.clearBlock(this.stickersEl);

			if (latesUseSticker.length == 0) {
				this.stickersEl.innerHTML += this.config.htmlForEmptyRecent;
				return false;
			}

			var stickers = [];
			StickerHelper.forEach(latesUseSticker, function(sticker) {
				stickers.push(sticker.code);
			});

			this.renderStickers(stickers);
		},

		renderCustomBlock: function() {
			this.clearBlock(this.stickersEl);
		},

		renderPack: function(pack) {

			this.clearBlock(this.stickersEl);

			var stickers = [];
			StickerHelper.forEach(pack.stickers, function(sticker) {
				stickers.push(pack.pack_name + '_' + sticker.name);
			});

			this.renderStickers(stickers);
		},

		renderStickers: function(stickers) {
			var self = this;

			StickerHelper.forEach(stickers, function(stickerCode) {

				var placeHolderClass = 'sp-sticker-placeholder';

				var stickerImgSrc = self.service.parseStickerFromText('[[' + stickerCode + ']]');

				var stickersSpanEl = document.createElement('span');
				stickersSpanEl.classList.add(placeHolderClass);

				var image = new Image();
				image.onload = function() {
					stickersSpanEl.classList.remove(placeHolderClass);
					stickersSpanEl.classList.add(self.config.stickerItemClass);
					stickersSpanEl.setAttribute('data-sticker-string', stickerCode);
					stickersSpanEl.appendChild(image);
				};
				image.onerror = function() {};

				image.src = stickerImgSrc.url;

				self.stickersEl.appendChild(stickersSpanEl);
			});
		},

		handleClickSticker: function(callback) {
			Module.StickerHelper.setEvent('click', this.stickersEl, this.config.stickerItemClass, callback);
		},

		onWindowResize: function() {
		}
	});

})(window, window.StickersModule);