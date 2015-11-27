
(function(Module) {


	Module.TabsView = Module.Class({

		el: null,
		scrollableContainerEl: null,
		scrollableContentEl: null,

		controls: null,
		packTabs: {},

		classes: {
			scrollableContainer: 'sp-tabs-scrollable-container',
			scrollableContent: 'sp-tabs-scrollable-content',
			controlTab: 'sp-control-tab',
			controlButton: 'sp-control-button',
			newPack: 'sp-new-pack',
			packTab: 'sp-pack-tab',
			tabActive: 'sp-tab-active',
			tabs: 'sp-tabs'
		},

		config: null,

		_constructor: function(config) {
			this.config = config;

			this.el = document.createElement('div');

			this.controls = {
				emoji: {
					id: 'spTabEmoji',
					class: 'sp-tab-emoji',
					content: this.config.emojiTabContent,
					el: null,
					isTab: true
				},
				history: {
					id: 'spTabHistory',
					class: 'sp-tab-history',
					content: this.config.historyTabContent,
					el: null,
					isTab: true
				},
				settings: {
					id: 'spTabSettings',
					class: 'sp-tab-settings',
					content: this.config.settingsTabContent,
					el: null,
					isTab: false
				},
				store: {
					id: 'spTabStore',
					class: 'sp-tab-store',
					content: this.config.storeTabContent,
					el: null,
					isTab: false
				},
				prevPacks: {
					id: 'spTabPrevPacks',
					class: 'sp-tab-prev-packs',
					content: this.config.prevPacksTabContent,
					el: null,
					isTab: false
				},
				nextPacks: {
					id: 'spTabNextPacks',
					class: 'sp-tab-next-packs',
					content: this.config.nextPacksTabContent,
					el: null,
					isTab: false
				}
			};

			window.addEventListener('resize', (function() {
				this.onWindowResize();
			}).bind(this));
		},


		render: function(stickerPacks) {

			this.el.classList.add(this.classes.tabs);
			this.el.innerHTML = '';

			this.renderPrevPacksTab();

			this.renderScrollableContainer();

			this.renderPacks(stickerPacks);

			this.renderNextPacksTab();

			this.renderStoreTab();
		},
		renderScrollableContainer: function() {

			this.scrollableContentEl = document.createElement('div');
			this.scrollableContentEl.className = this.classes.scrollableContent;

			this.scrollableContainerEl = document.createElement('div');
			this.scrollableContainerEl.className = this.classes.scrollableContainer;

			this.scrollableContainerEl.appendChild(this.scrollableContentEl);
			this.el.appendChild(this.scrollableContainerEl);
		},
		renderControlButton: function(controlButton) {
			controlButton.isTab = controlButton.isTab || false;

			var classes = [controlButton.class];
			classes.push((controlButton.isTab) ? this.classes.controlTab : this.classes.controlButton);

			controlButton.el = this.renderTab(controlButton.id, classes, controlButton.content);
			return controlButton.el;
		},
		renderPackTab: function(pack) {
			var classes = [this.classes.packTab];

			if(pack.newPack) {
				classes.push(this.classes.newPack);
			}

			var iconSrc = this.config.domain + '/' +
				this.config.baseFolder + '/' +
				pack.pack_name + '/tab_icon_' +
				this.config.tabResolutionType + '.png';

			var content = '<img src=' + iconSrc + '>';

			var tabEl = this.renderTab(null, classes, content, {
				'data-pack-name': pack.pack_name
			});

			tabEl.addEventListener('click', (function() {
				tabEl.classList.remove(this.classes.newPack);
			}).bind(this));

			this.packTabs[pack.pack_name] = tabEl;

			return tabEl;
		},
		renderTab: function(id, classes, content, attrs) {
			classes = classes || [];
			attrs = attrs || {};

			var tabEl = document.createElement('span');

			if (id) {
				tabEl.id = id;
			}

			classes.push(this.config.tabItemClass);

			tabEl.classList.add.apply(tabEl.classList, classes);

			Module.StickerHelper.forEach(attrs, function(value, name) {
				tabEl.setAttribute(name, value);
			});

			tabEl.innerHTML = content;

			tabEl.addEventListener('click', (function() {
				if (!tabEl.classList.contains(this.classes.controlTab) &&
					!tabEl.classList.contains(this.classes.packTab)) {
					return;
				}

				Module.StickerHelper.forEach(this.packTabs, (function(tabEl) {
					tabEl.classList.remove(this.classes.tabActive);
				}).bind(this));

				Module.StickerHelper.forEach(this.controls, (function(controlTab) {
					if (controlTab && controlTab.el) {
						controlTab.el.classList.remove(this.classes.tabActive);
					}
				}).bind(this));

				tabEl.classList.add(this.classes.tabActive);
			}).bind(this));

			return tabEl;
		},


		renderPacks: function(stickerPacks) {
			this.scrollableContentEl.innerHTML = '';

			this.renderEmojiTab();
			this.renderHistoryTab();

			for (var i = 0; i < stickerPacks.length; i++) {
				this.scrollableContentEl.appendChild(this.renderPackTab(stickerPacks[i], i));
			}

			this.renderSettingsTab();
		},
		renderEmojiTab: function() {
			if (this.config.enableEmojiTab) {
				this.scrollableContentEl.appendChild(this.renderControlButton(this.controls.emoji));
			}
		},
		renderHistoryTab: function() {
			if (this.config.enableHistoryTab) {
				this.scrollableContentEl.appendChild(this.renderControlButton(this.controls.history));
			}
		},
		renderSettingsTab: function() {
			if (this.config.enableSettingsTab) {
				this.scrollableContentEl.appendChild(this.renderControlButton(this.controls.settings));
			}
		},
		renderStoreTab: function() {
			if (this.config.enableStoreTab) {
				this.el.appendChild(this.renderControlButton(this.controls.store));
			}
		},
		renderPrevPacksTab: function() {
			this.el.appendChild(this.renderControlButton(this.controls.prevPacks));
			Module.StickerHelper.setEvent('click', this.el, this.controls.prevPacks.class, this.onClickPrevPacksButton.bind(this));
		},
		renderNextPacksTab: function() {
			this.el.appendChild(this.renderControlButton(this.controls.nextPacks));
			Module.StickerHelper.setEvent('click', this.el, this.controls.nextPacks.class, this.onClickNextPacksButton.bind(this));
		},


		onClickPrevPacksButton: function() {
			var tabWidth = this.scrollableContentEl.getElementsByClassName(this.classes.packTab)[0].offsetWidth;
			var containerWidth = this.scrollableContainerEl.offsetWidth;
			var contentOffset = parseInt(this.scrollableContentEl.style.left, 10) || 0;
			var countFullShownTabs = parseInt((containerWidth / tabWidth), 10);

			var offset = contentOffset + (tabWidth * countFullShownTabs);
			offset = (offset > 0) ? 0 : offset;
			this.scrollableContentEl.style.left = offset + 'px';
			this.onWindowResize();
		},
		onClickNextPacksButton: function() {
			var tabWidth = this.scrollableContentEl.getElementsByClassName(this.classes.packTab)[0].offsetWidth;
			var containerWidth = this.scrollableContainerEl.offsetWidth;
			var contentOffset = parseInt(this.scrollableContentEl.style.left, 10) || 0;
			var countFullShownTabs = parseInt((containerWidth / tabWidth), 10);

			var offset = -(tabWidth * countFullShownTabs) + contentOffset;
			this.scrollableContentEl.style.left = offset + 'px';
			this.onWindowResize();
		},


		handleClickOnEmojiTab: function(callback) {
			Module.StickerHelper.setEvent('click', this.el, this.controls.emoji.class, callback);
		},
		handleClickOnLastUsedPacksTab: function(callback) {
			Module.StickerHelper.setEvent('click', this.el, this.controls.history.class, callback);
		},
		handleClickOnPackTab: function(callback) {
			Module.StickerHelper.setEvent('click', this.el, this.classes.packTab, callback);
		},


		onWindowResize: function() {

			if (!this.el.parentElement) {
				return;
			}

			if (this.controls.prevPacks.el) {
				if (parseInt(this.scrollableContentEl.style.left, 10) < 0) {
					this.controls.prevPacks.el.style.display = 'block';
				} else {
					this.controls.prevPacks.el.style.display = 'none';
				}
			}


			if (this.controls.nextPacks.el) {
				var contentWidth = this.scrollableContentEl.scrollWidth;
				var contentOffset = parseInt(this.scrollableContentEl.style.left, 10) || 0;

				if (contentWidth + contentOffset > this.scrollableContainerEl.offsetWidth) {
					this.controls.nextPacks.el.style.display = 'block';
				} else {
					this.controls.nextPacks.el.style.display = 'none';
				}
			}
		}
	});

})(window.StickersModule);