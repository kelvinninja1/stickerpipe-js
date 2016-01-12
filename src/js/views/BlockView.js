
(function(Module) {

	var StickerHelper = Module.StickerHelper;

	Module.BlockView = Module.Class({

		emojisOffset: 0,
		emojisLimit: 100,

		// todo
		isRendered: false,

		emojiService: null,

		el: null,
		contentEl: null,

		tabsView: null,
		scrollView: null,

		_constructor: function(emojiService) {
			this.emojiService = emojiService;

			this.el = document.getElementById(Module.Configs.elId);
			this.contentEl = document.createElement('div');

			this.tabsView = new Module.TabsView();
			this.scrollView = new Module.ScrollView();

			this.scrollView.onScroll((function() {
				if (this.contentEl.classList.contains('sp-emojis') && this.scrollView.isAtEnd()) {
					this.renderEmojis(this.emojisOffset);
				}
			}).bind(this));

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

			this.isRendered = true;

			this.tabsView.onWindowResize();
			this.onWindowResize();
		},
		renderUsedStickers: function() {

			var usedStickers = Module.Storage.getUsedStickers();

			this.clearBlock(this.contentEl);

			this.contentEl.classList.remove('sp-stickers');
			this.contentEl.classList.remove('sp-emojis');

			if (usedStickers.length == 0) {
				this.contentEl.innerHTML += Module.Configs.htmlForEmptyRecent;
				this.scrollView.update();
				return false;
			}

			var stickers = [];
			StickerHelper.forEach(usedStickers, function(sticker) {
				stickers.push(sticker.code);
			});

			this.renderStickers(stickers);
		},
		renderEmojiBlock: function() {

			this.clearBlock(this.contentEl);

			this.contentEl.classList.remove('sp-stickers');
			this.contentEl.classList.add('sp-emojis');

			this.emojisOffset = 0;
			this.renderEmojis(this.emojisOffset);

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

				var stickerImgSrc = Module.BaseService.parseStickerFromText('[[' + stickerCode + ']]');

				var stickersSpanEl = document.createElement('span');
				stickersSpanEl.classList.add(placeHolderClass);

				var image = new Image();
				image.onload = function() {
					stickersSpanEl.classList.remove(placeHolderClass);
					stickersSpanEl.classList.add(Module.Configs.stickerItemClass);
					stickersSpanEl.setAttribute('data-sticker-string', stickerCode);
					stickersSpanEl.appendChild(image);
				};
				image.onerror = function() {};

				image.src = stickerImgSrc.url;

				self.contentEl.appendChild(stickersSpanEl);
			});

			this.scrollView.update();
		},
		renderEmojis: function(offset) {

			if (offset > Module.Configs.emojiList.length - 1) {
				return;
			}

			var limit = offset + this.emojisLimit;
			if (limit > Module.Configs.emojiList.length - 1) {
				limit = Module.Configs.emojiList.length;
			}

			for (var i = offset; i < limit; i++) {
				var emoji = Module.Configs.emojiList[i],
					emojiEl = document.createElement('span'),
					emojiImgHtml = this.emojiService.parseEmojiFromText(emoji);

				emojiEl.className = Module.Configs.emojiItemClass;
				emojiEl.innerHTML = emojiImgHtml;

				this.contentEl.appendChild(emojiEl);
			}

			this.emojisOffset = limit;

			this.scrollView.update('relative');
		},


		handleClickOnSticker: function(callback) {
			// todo: create static Module.Configs.stickerItemClass
			Module.StickerHelper.setEvent('click', this.contentEl, Module.Configs.stickerItemClass, callback);
		},
		handleClickOnEmoji: function(callback) {
			// todo: create static Module.Configs.emojiItemClass
			Module.StickerHelper.setEvent('click', this.contentEl, Module.Configs.emojiItemClass, callback);
		},

		open: function(tabName) {
			tabName = tabName || null;

			if (tabName) {
				this.tabsView.activeTab(tabName);
			}

			if (!this.tabsView.hasActiveTab) {
				this.tabsView.activeLastUsedStickersTab();
			}
		},
		close: function() {},


		onWindowResize: function() {}
	});

})(window.StickersModule);