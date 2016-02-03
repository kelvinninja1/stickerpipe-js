
(function(Plugin) {

	Plugin.View.Block = Plugin.Libs.Class({

		emojisOffset: 0,
		emojisLimit: 100,

		// todo
		isRendered: false,

		el: null,
		contentEl: null,

		tabsView: null,

		scrollableEl: null,

		_constructor: function() {

			this.el = document.getElementById(Plugin.Configs.elId);
			this.contentEl = document.createElement('div');

			this.tabsView = new Plugin.View.Tabs();

			window.addEventListener('resize', (function() {
				this.onWindowResize();
			}).bind(this));
		},

		render: function(stickerPacks) {

			this.tabsView.render(stickerPacks);

			this.el.innerHTML = '';
			this.el.classList.add('sticker-pipe');
			this.el.style.width = Plugin.Configs.width;

			this.scrollableEl = document.createElement('div');
			this.scrollableEl.className = 'sp-scroll-content';
			this.scrollableEl.style.height = parseInt(Plugin.Configs.height, 10) - 49 + 'px';
			this.scrollableEl.appendChild(this.contentEl);

			this.scrollableEl.addEventListener('ps-y-reach-end', (function () {
				if (this.contentEl.classList.contains('sp-emojis')) {
					this.renderEmojis(this.emojisOffset);
				}
			}).bind(this));

			this.contentEl.classList.add('sp-content');

			this.el.appendChild(this.tabsView.el);
			this.el.appendChild(this.scrollableEl);

			Plugin.Libs.PerfectScrollbar.initialize(this.scrollableEl);

			this.isRendered = true;

			this.tabsView.onWindowResize();
			this.onWindowResize();
		},
		renderUsedStickers: function() {

			var usedStickers = Plugin.Service.Storage.getUsedStickers();

			this.contentEl.innerHTML = '';

			this.contentEl.classList.remove('sp-stickers');
			this.contentEl.classList.remove('sp-emojis');

			if (usedStickers.length == 0) {
				this.contentEl.innerHTML += Plugin.Configs.htmlForEmptyRecent;
				this.updateScroll('top');
				return false;
			}

			var stickers = [];
			Plugin.Service.Helper.forEach(usedStickers, function(sticker) {
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
			Plugin.Service.Helper.forEach(pack.stickers, function(sticker) {
				stickers.push(pack.pack_name + '_' + sticker.name);
			});

			this.renderStickers(stickers);
		},
		renderStickers: function(stickers) {
			var self = this;

			this.contentEl.classList.remove('sp-emojis');
			this.contentEl.classList.add('sp-stickers');

			Plugin.Service.Helper.forEach(stickers, function(stickerCode) {

				var placeHolderClass = 'sp-sticker-placeholder';

				var stickerImgSrc = Plugin.Service.Sticker.parse('[[' + stickerCode + ']]');

				var stickersSpanEl = document.createElement('span');
				stickersSpanEl.classList.add(placeHolderClass);

				var image = new Image();
				image.onload = function() {
					stickersSpanEl.classList.remove(placeHolderClass);
					stickersSpanEl.classList.add(Plugin.Configs.stickerItemClass);
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

			if (offset > Plugin.Configs.emojiList.length - 1) {
				return;
			}

			var limit = offset + this.emojisLimit;
			if (limit > Plugin.Configs.emojiList.length - 1) {
				limit = Plugin.Configs.emojiList.length;
			}

			for (var i = offset; i < limit; i++) {
				var emoji = Plugin.Configs.emojiList[i],
					emojiEl = document.createElement('span'),
					emojiImgHtml = Plugin.Service.Emoji.parseEmojiFromText(emoji);

				emojiEl.className = Plugin.Configs.emojiItemClass;
				emojiEl.innerHTML = emojiImgHtml;

				this.contentEl.appendChild(emojiEl);
			}

			this.emojisOffset = limit;

			this.updateScroll();
		},

		handleClickOnSticker: function(callback) {
			// todo: create static Plugin.Configs.stickerItemClass
			Plugin.Service.Helper.setEvent('click', this.contentEl, Plugin.Configs.stickerItemClass, callback);
		},
		handleClickOnEmoji: function(callback) {
			// todo: create static Plugin.Configs.emojiItemClass
			Plugin.Service.Helper.setEvent('click', this.contentEl, Plugin.Configs.emojiItemClass, callback);
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

			Plugin.Libs.PerfectScrollbar.update(this.scrollableEl);
		},

		onWindowResize: function() {}
	});

})(window.StickersModule);