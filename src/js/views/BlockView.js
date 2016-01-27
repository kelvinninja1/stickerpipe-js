
(function(Module) {

	Module.BlockView = Module.Class({

		emojisOffset: 0,
		emojisLimit: 100,

		// todo
		isRendered: false,

		emojiService: null,

		el: null,
		contentEl: null,

		tabsView: null,

		scrollableEl: null,

		_constructor: function(emojiService) {
			this.emojiService = emojiService;

			this.el = document.getElementById(Module.Configs.elId);
			this.contentEl = document.createElement('div');

			this.tabsView = new Module.TabsView();

			window.addEventListener('resize', (function() {
				this.onWindowResize();
			}).bind(this));
		},

		render: function(stickerPacks) {

			this.tabsView.render(stickerPacks);

			this.el.innerHTML = '';
			this.el.classList.add('sticker-pipe');
			this.el.style.width = Module.Configs.width;

			this.scrollableEl = document.createElement('div');
			this.scrollableEl.className = 'sp-scroll-content';
			this.scrollableEl.style.height = parseInt(Module.Configs.height, 10) - 49 + 'px';
			this.scrollableEl.appendChild(this.contentEl);

			this.scrollableEl.addEventListener('ps-y-reach-end', (function () {
				if (this.contentEl.classList.contains('sp-emojis')) {
					this.renderEmojis(this.emojisOffset);
				}
			}).bind(this));

			this.contentEl.classList.add('sp-content');

			this.el.appendChild(this.tabsView.el);
			this.el.appendChild(this.scrollableEl);

			Module.Libs.PerfectScrollbar.initialize(this.scrollableEl);

			this.isRendered = true;

			this.tabsView.onWindowResize();
			this.onWindowResize();
		},
		renderUsedStickers: function() {

			var usedStickers = Module.Storage.getUsedStickers();

			this.contentEl.innerHTML = '';

			this.contentEl.classList.remove('sp-stickers');
			this.contentEl.classList.remove('sp-emojis');

			if (usedStickers.length == 0) {
				this.contentEl.innerHTML += Module.Configs.htmlForEmptyRecent;
				this.updateScroll('top');
				return false;
			}

			var stickers = [];
			Module.Service.Helper.forEach(usedStickers, function(sticker) {
				stickers.push(sticker.code);
			});

			this.renderStickers(stickers);
		},
		renderEmojiBlock: function() {

			this.contentEl.innerHTML = '';

			this.contentEl.classList.remove('sp-stickers');
			this.contentEl.classList.add('sp-emojis');

			this.emojisOffset = 0;
			this.renderEmojis(this.emojisOffset);

			this.updateScroll('top');
		},
		renderPack: function(pack) {

			this.contentEl.innerHTML = '';

			var stickers = [];
			Module.Service.Helper.forEach(pack.stickers, function(sticker) {
				stickers.push(pack.pack_name + '_' + sticker.name);
			});

			this.renderStickers(stickers);
		},
		renderStickers: function(stickers) {
			var self = this;

			this.contentEl.classList.remove('sp-emojis');
			this.contentEl.classList.add('sp-stickers');

			Module.Service.Helper.forEach(stickers, function(stickerCode) {

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

			this.updateScroll('top');
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

			this.updateScroll();
		},

		handleClickOnSticker: function(callback) {
			// todo: create static Module.Configs.stickerItemClass
			Module.Service.Helper.setEvent('click', this.contentEl, Module.Configs.stickerItemClass, callback);
		},
		handleClickOnEmoji: function(callback) {
			// todo: create static Module.Configs.emojiItemClass
			Module.Service.Helper.setEvent('click', this.contentEl, Module.Configs.emojiItemClass, callback);
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

		updateScroll: function(position) {
			position = position || 'relative';

			if (position == 'top') {
				this.scrollableEl.scrollTop = 0;
			}

			Module.Libs.PerfectScrollbar.update(this.scrollableEl);
		},

		onWindowResize: function() {}
	});

})(window.StickersModule);