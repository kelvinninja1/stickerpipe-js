
(function(Module) {

	var StickerHelper = Module.StickerHelper;

	Module.BlockView = Module.Class({

		config: null,
		baseService: null,
		emojiService: null,

		el: null,
		contentEl: null,

		tabsView: null,
		scrollView: null,

		_constructor: function(config, baseService, emojiService) {
			this.config = config;
			this.baseService = baseService;
			this.emojiService = emojiService;

			this.el = document.getElementById(this.config.elId);
			this.contentEl = document.createElement('div');

			this.tabsView = new Module.TabsView(this.config);
			this.scrollView = new Module.ScrollView();

			window.addEventListener('resize', (function() {
				this.onWindowResize();
			}).bind(this));
		},


		// todo: remove function
		clearBlock: function(el) {
			el.setAttribute('style', 'display:block');
			el.innerHTML = '';
		},


		render: function(stickerPacks) {
			this.tabsView.render(stickerPacks);

			this.el.innerHTML = '';
			this.el.classList.add('sticker-pipe');

			this.scrollView.el.setAttribute('class', 'sp-scroll-content');
			this.scrollView.getOverview().appendChild(this.contentEl);

			this.contentEl.classList.add('sp-content');

			this.el.appendChild(this.tabsView.el);
			this.el.appendChild(this.scrollView.el);

			this.tabsView.onWindowResize();
			this.onWindowResize();
		},
		renderUsedStickers: function(latesUseSticker) {

			this.clearBlock(this.contentEl);

			if (latesUseSticker.length == 0) {
				this.contentEl.innerHTML += this.config.htmlForEmptyRecent;
				return false;
			}

			var stickers = [];
			StickerHelper.forEach(latesUseSticker, function(sticker) {
				stickers.push(sticker.code);
			});

			this.renderStickers(stickers);
		},
		renderEmojiBlock: function() {

			this.clearBlock(this.contentEl);

			this.contentEl.classList.remove('sp-stickers');
			this.contentEl.classList.add('sp-emojis');

			StickerHelper.forEach(this.config.emojiList, (function(emoji) {

				// todo: add size dynamic 36 vs 62

				var emojiEl = document.createElement('span'),
					emojiImgHtml = this.emojiService.parseEmojiFromText(emoji);

				emojiEl.className = this.config.emojiItemClass;
				emojiEl.innerHTML = emojiImgHtml;

				this.contentEl.appendChild(emojiEl);
			}).bind(this));

			this.scrollView.update();
		},
		renderPack: function(pack) {

			this.clearBlock(this.contentEl);

			var stickers = [];
			StickerHelper.forEach(pack.stickers, function(sticker) {
				stickers.push(pack.pack_name + '_' + sticker.name);
			});

			this.renderStickers(stickers);
		},
		renderStickers: function(stickers) {
			var self = this;

			this.contentEl.classList.remove('sp-emojis');
			this.contentEl.classList.add('sp-stickers');

			StickerHelper.forEach(stickers, function(stickerCode) {

				var placeHolderClass = 'sp-sticker-placeholder';

				var stickerImgSrc = self.baseService.parseStickerFromText('[[' + stickerCode + ']]');

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

				self.contentEl.appendChild(stickersSpanEl);
			});

			this.scrollView.update();
		},


		// todo: rename handleClickSticker --> handleClickOnSticker
		handleClickSticker: function(callback) {
			// todo: create static this.config.stickerItemClass
			Module.StickerHelper.setEvent('click', this.contentEl, this.config.stickerItemClass, callback);
		},

		// todo: rename handleClickEmoji --> handleClickOnEmoji
		handleClickEmoji: function(callback) {
			// todo: create static this.config.emojiItemClass
			Module.StickerHelper.setEvent('click', this.contentEl, this.config.emojiItemClass, callback);
		},


		onWindowResize: function() {}
	});

})(window.StickersModule);