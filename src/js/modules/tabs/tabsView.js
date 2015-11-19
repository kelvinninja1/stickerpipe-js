
(function(Plugin, Module) {


	Module.TabsView = Module.Class({

		el: null,
		scrollableContainerEl: null,
		scrollableContentEl: null,

		controlTabs: null,
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

			this.controlTabs = {
				custom: {
					id: 'spTabCustom',
					class: 'sp-tab-custom',
					content: this.config.customTabContent,
					el: null
				},
				history: {
					id: 'spTabHistory',
					class: 'sp-tab-history',
					content: this.config.historyTabContent,
					el: null
				},
				settings: {
					id: 'spTabSettings',
					class: 'sp-tab-settings',
					content: this.config.settingsTabContent,
					el: null
				},
				store: {
					id: 'spTabSettings',
					class: 'sp-tab-store',
					content: this.config.storeTabContent,
					el: null
				},
				prevPacks: {
					id: 'spTabPrevPacks',
					class: 'sp-tab-prev-packs',
					content: this.config.prevPacksTabContent,
					el: null
				},
				nextPacks: {
					id: 'spTabNextPacks',
					class: 'sp-tab-next-packs',
					content: this.config.nextPacksTabContent,
					el: null
				}
			};

			window.addEventListener('resize', (function() {
				this.onWindowResize();
			}).bind(this));
		},

		render: function(stickerPacks) {

			this.el.classList.add(this.classes.tabs);
			this.el.innerHTML = '';

			// PREV BUTTON
			this.el.appendChild(this.renderControlButton(this.controlTabs.prevPacks, false));
			Module.StickerHelper.setEvent('click', this.el, this.controlTabs.prevPacks.class, this.onClickPrevPacksButton.bind(this));

			// SCROLLABLE CONTAINER
			this.renderScrollableContainer();

			// CUSTOM TAB
			if (this.config.enableCustomTab) {
				this.scrollableContentEl.appendChild(this.renderControlButton(this.controlTabs.custom, true));
			}

			// HISTORY TAB
			this.scrollableContentEl.appendChild(this.renderControlButton(this.controlTabs.history, true));

			// PACKS TABS
			for (var i = 0; i < stickerPacks.length; i++) {
				this.scrollableContentEl.appendChild(this.renderPackTab(stickerPacks[i], i));
			}

			// SETTINGS BUTTON
			this.scrollableContentEl.appendChild(this.renderControlButton(this.controlTabs.settings, false));

			// STORE BUTTON
			this.el.appendChild(this.renderControlButton(this.controlTabs.store, false));

			// NEXT BUTTON
			this.el.appendChild(this.renderControlButton(this.controlTabs.nextPacks, false));
			Module.StickerHelper.setEvent('click', this.el, this.controlTabs.nextPacks.class, this.onClickNextPacksButton.bind(this));

			this.onWindowResize();
		},
		renderScrollableContainer: function() {

			this.scrollableContentEl = document.createElement('div');
			this.scrollableContentEl.className = this.classes.scrollableContent;

			this.scrollableContainerEl = document.createElement('div');
			this.scrollableContainerEl.className = this.classes.scrollableContainer;

			this.scrollableContainerEl.appendChild(this.scrollableContentEl);
			this.el.appendChild(this.scrollableContainerEl);
		},
		renderControlButton: function(tab, isTab) {
			isTab = isTab || false;

			var classes = [tab.class];
			classes.push((isTab) ? this.classes.controlTab : this.classes.controlButton);

			tab.el = this.renderTab(tab.id, classes, tab.content);
			return tab.el;
		},
		renderPackTab: function(pack) {
			var classes = [this.classes.packTab],
				attrs = {
					'data-pack-name': pack.pack_name
				};

			if(pack.newPack) {
				classes.push(this.classes.newPack);
			}

			var iconSrc = this.config.domain + '/' +
				this.config.baseFolder + '/' +
				pack.pack_name + '/tab_icon_' +
				this.config.tabResolutionType + '.png';

			var content = '<img src=' + iconSrc + '>';

			var tabEl = this.renderTab(null, classes, content, attrs);

			tabEl.addEventListener('click', (function() {
				tabEl.classList.remove(this.classes.newPack);
			}).bind(this));

			this.packTabs[pack.pack_name] = tabEl;

			return tabEl;
		},
		renderTab: function(id, classes, content, attrs) {
			attrs = attrs || [];

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

				Module.StickerHelper.forEach(this.controlTabs, (function(controlTab) {
					if (controlTab && controlTab.el) {
						controlTab.el.classList.remove(this.classes.tabActive);
					}
				}).bind(this));

				tabEl.classList.add(this.classes.tabActive);
			}).bind(this));

			return tabEl;
		},

		onClickPrevPacksButton: function() {
			var tabWidth = this.scrollableContentEl.getElementsByClassName(this.classes.packTab)[0].offsetWidth;
			var containerWidth = parseInt(this.scrollableContainerEl.style.width, 10);
			var contentOffset = parseInt(this.scrollableContentEl.style.left, 10) || 0;
			var countFullShownTabs = parseInt((containerWidth / tabWidth), 10);

			var offset = contentOffset + (tabWidth * countFullShownTabs);
			offset = (offset > 0) ? 0 : offset;
			this.scrollableContentEl.style.left = offset + 'px';
			this.onWindowResize();
		},
		onClickNextPacksButton: function() {
			var tabWidth = this.scrollableContentEl.getElementsByClassName(this.classes.packTab)[0].offsetWidth;
			var containerWidth = parseInt(this.scrollableContainerEl.style.width, 10);
			var contentOffset = parseInt(this.scrollableContentEl.style.left, 10) || 0;
			var countFullShownTabs = parseInt((containerWidth / tabWidth), 10);

			var offset = -(tabWidth * countFullShownTabs) + contentOffset;
			this.scrollableContentEl.style.left = offset + 'px';
			this.onWindowResize();
		},

		handleClickOnCustomTab: function(callback) {
			Module.StickerHelper.setEvent('click', this.el, this.controlTabs.custom.class, callback);
		},
		handleClickOnLastUsedPacksTab: function(callback) {
			Module.StickerHelper.setEvent('click', this.el, this.controlTabs.history.class, callback);
		},
		handleClickOnPackTab: function(callback) {
			Module.StickerHelper.setEvent('click', this.el, this.classes.packTab, callback);
		},

		onWindowResize: function() {

			if (!this.el.parentElement) {
				return;
			}

			if (this.controlTabs.prevPacks.el) {
				if (parseInt(this.scrollableContentEl.style.left, 10) < 0) {
					this.controlTabs.prevPacks.el.style.display = 'inline-block';
				} else {
					this.controlTabs.prevPacks.el.style.display = 'none';
				}
			}


			if (this.controlTabs.nextPacks.el) {
				var contentWidth = this.scrollableContentEl.scrollWidth;
				var contentOffset = parseInt(this.scrollableContentEl.style.left, 10) || 0;

				if (contentWidth + contentOffset > this.scrollableContainerEl.offsetWidth) {
					this.controlTabs.nextPacks.el.style.display = 'inline-block';
				} else {
					this.controlTabs.nextPacks.el.style.display = 'none';
				}
			}

			this.scrollableContainerEl.style.width = this.el.parentElement.offsetWidth
				- this.controlTabs.store.el.offsetWidth
				- this.controlTabs.nextPacks.el.offsetWidth
				- this.controlTabs.prevPacks.el.offsetWidth
				+ 'px'
			;
		}
	});

})(window, window.StickersModule);