
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

		render: function() {

			this.tabsView.render();

			this.el.innerHTML = '';
			this.el.className ='sticker-pipe';
			this.el.style.width = Plugin.Configs.width;

			this.scrollableEl = document.createElement('div');
			this.scrollableEl.className = 'sp-scroll-content';
			this.scrollableEl.style.height = parseInt(Plugin.Configs.height, 10) - 49 + 'px';
			this.scrollableEl.appendChild(this.contentEl);

			this.scrollableEl.addEventListener('ps-y-reach-end', (function () {
				if (this.contentEl.className == 'sp-emojis') {
					this.renderEmojis(this.emojisOffset);
				}
			}).bind(this));

			this.el.appendChild(this.tabsView.el);
			this.el.appendChild(this.scrollableEl);

			Plugin.Libs.PerfectScrollbar.initialize(this.scrollableEl);

			this.isRendered = true;

			this.tabsView.onWindowResize();
			this.onWindowResize();
		},
		renderRecentStickers: function() {

			var recentStickers = Plugin.Service.Storage.getRecentStickers();

			if (!recentStickers.length) {
				this.contentEl.innerHTML = Plugin.Configs.htmlForEmptyRecent;
				this.updateScroll('top');
				return false;
			}

			this.renderStickers(recentStickers);
		},
		renderEmojiBlock: function() {

			this.contentEl.innerHTML = '';
			this.contentEl.className = 'sp-emojis';

			this.emojisOffset = 0;
			this.renderEmojis(this.emojisOffset);

			this.updateScroll('top');
		},
		renderPack: function(pack) {
			this.renderStickers(pack.stickers);
		},
		renderStickers: function(stickersIds) {
			var self = this;

			this.contentEl.innerHTML = '';
			this.contentEl.className = 'sp-stickers';

			function appendSticker(stickerId) {
				var stickersSpanEl = document.createElement('span');
				stickersSpanEl.className = 'sp-sticker-placeholder';
				stickersSpanEl.setAttribute('data-sticker-id', stickerId);

				var image = new Image();
				image.onload = function() {
					stickersSpanEl.className = Plugin.Configs.stickerItemClass;
					stickersSpanEl.appendChild(image);
				};
				image.onerror = function() {};

				Plugin.Service.Sticker.getById(stickerId, function(sticker) {
					image.src = sticker.image[Plugin.Configs.stickerResolutionType];
				});

				self.contentEl.appendChild(stickersSpanEl);
			}

			for (var i = 0; i < stickersIds.length; i++) {
				var stickerId = stickersIds[i];
				appendSticker(stickerId);
			}

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