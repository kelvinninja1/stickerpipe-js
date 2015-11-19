
(function(Plugin, Module) {


	Module.TabsView = Module.Class({

		el: null,
		scrollableContainerEl: null,
		scrollableContentEl: null,

		controlTabs: null,
		packTabs: {},

		config: null,

		_constructor: function(config) {
			this.config = config;

			this.el = document.createElement('div');

			this.controlTabs = {
				custom: {
					id: 'spTabCustom',
					class: 'sp-tab-custom',
					content: this.config.customTabContent,
					number: -1,
					el: null
				},
				history: {
					id: 'spTabHistory',
					class: 'sp-tab-history',
					content: this.config.historyTabContent,
					number: -2,
					el: null
				},
				settings: {
					id: 'spTabSettings',
					class: 'sp-tab-settings',
					content: this.config.settingsTabContent,
					number: -3,
					el: null
				},
				store: {
					id: 'spTabSettings',
					class: 'sp-tab-store',
					content: this.config.storeTabContent,
					number: -4,
					el: null
				},
				prevPacks: {
					id: 'spTabPrevPacks',
					class: 'sp-tab-prev-packs',
					content: this.config.prevPacksTabContent,
					number: -5,
					el: null
				},
				nextPacks: {
					id: 'spTabNextPacks',
					class: 'sp-tab-next-packs',
					content: this.config.nextPacksTabContent,
					number: -6,
					el: null
				}
			};

			window.addEventListener('resize', (function() {
				this.onWindowResize();
			}).bind(this));
		},

		render: function(stickerPacks) {

			this.el.classList.add('sp-tabs');
			this.el.innerHTML = '';

			// PREV BUTTON
			this.el.appendChild(this.renderControlTab(this.controlTabs.prevPacks));
			Module.StickerHelper.setEvent('click', this.el, this.controlTabs.prevPacks.class, this.onClickPrevPacksButton.bind(this));

			// SCROLLABLE CONTAINER
			this.renderScrollableContainer();

			// CUSTOM TAB
			if (this.config.enableCustomTab) {
				this.scrollableContentEl.appendChild(this.renderControlTab(this.controlTabs.custom));
			}

			// HISTORY TAB
			this.scrollableContentEl.appendChild(this.renderControlTab(this.controlTabs.history));

			// PACKS TABS
			for (var i = 0; i < stickerPacks.length; i++) {
				this.scrollableContentEl.appendChild(this.renderPackTab(stickerPacks[i], i));
			}

			// SETTINGS BUTTON
			this.scrollableContentEl.appendChild(this.renderControlTab(this.controlTabs.settings));

			// STORE BUTTON
			this.el.appendChild(this.renderControlTab(this.controlTabs.store));

			// NEXT BUTTON
			this.el.appendChild(this.renderControlTab(this.controlTabs.nextPacks));
			Module.StickerHelper.setEvent('click', this.el, this.controlTabs.nextPacks.class, this.onClickNextPacksButton.bind(this));

			this.onWindowResize();
		},
		renderScrollableContainer: function() {

			// todo + classes
			this.scrollableContentEl = document.createElement('div');
			this.scrollableContentEl.style.whiteSpace = 'nowrap';
			this.scrollableContentEl.style.position = 'relative';
			this.scrollableContentEl.style.display = 'flex';
			this.scrollableContentEl.style.transition = '300ms';


			this.scrollableContainerEl = document.createElement('div');
			this.scrollableContainerEl.style.float = 'left';
			this.scrollableContainerEl.style.width = '300px';
			this.scrollableContainerEl.style.overflow = 'hidden';
			this.scrollableContainerEl.style.position = 'relative';

			this.scrollableContainerEl.appendChild(this.scrollableContentEl);
			this.el.appendChild(this.scrollableContainerEl);
		},
		renderControlTab: function(tab) {
			tab.el = this.renderTab(tab.id, [tab.class, 'sp-control-tab'], tab.number, tab.content);
			return tab.el;
		},
		renderPackTab: function(pack, number) {
			var classes = ['sp-pack-tab'],
				attrs = {
					'data-pack-name': pack.pack_name
				};

			if(pack.newPack) {
				classes.push('sp-new-pack');
			}

			var iconSrc = this.config.domain + '/' +
				this.config.baseFolder + '/' +
				pack.pack_name + '/tab_icon_' +
				this.config.tabResolutionType + '.png';

			var content = '<img src=' + iconSrc + '>';

			var tabEl = this.renderTab(null, classes, number, content, attrs);

			tabEl.addEventListener('click', function() {
				tabEl.classList.remove('sp-new-pack');
			});

			this.packTabs[pack.pack_name] = tabEl;

			return tabEl;
		},
		renderTab: function(id, classes, dataTabNumber, content, attrs) {
			attrs = attrs || [];

			var tabEl = document.createElement('span');

			if (id) {
				tabEl.id = id;
			}

			classes.push(this.config.tabItemClass);

			tabEl.classList.add.apply(tabEl.classList, classes);

			attrs['data-tab-number'] = dataTabNumber;
			Module.StickerHelper.forEach(attrs, function(value, name) {
				tabEl.setAttribute(name, value);
			});

			tabEl.innerHTML = content;

			tabEl.addEventListener('click', (function() {

				Module.StickerHelper.forEach(this.packTabs, function(tabEl) {
					tabEl.classList.remove('active');
				});

				Module.StickerHelper.forEach(this.controlTabs, function(controlTab) {
					if (controlTab && controlTab.el) {
						controlTab.el.classList.remove('active');
					}
				});

				tabEl.classList.add('active');
			}).bind(this));

			return tabEl;
		},

		onClickPrevPacksButton: function() {
			var tabWidth = this.scrollableContentEl.getElementsByClassName('sp-pack-tab')[0].offsetWidth;
			var containerWidth = parseInt(this.scrollableContainerEl.style.width, 10);
			var contentOffset = parseInt(this.scrollableContentEl.style.marginLeft, 10) || 0;
			var countFullShownTabs = parseInt((containerWidth / tabWidth), 10);

			var offset = contentOffset + (tabWidth * countFullShownTabs);
			this.scrollableContentEl.style.marginLeft = offset + 'px';
			this.onWindowResize();
		},
		onClickNextPacksButton: function() {
			var tabWidth = this.scrollableContentEl.getElementsByClassName('sp-pack-tab')[0].offsetWidth;
			var containerWidth = parseInt(this.scrollableContainerEl.style.width, 10);
			var contentOffset = parseInt(this.scrollableContentEl.style.marginLeft, 10) || 0;
			var countFullShownTabs = parseInt((containerWidth / tabWidth), 10);

			var offset = -(tabWidth * countFullShownTabs) + contentOffset;
			this.scrollableContentEl.style.marginLeft = offset + 'px';
			this.onWindowResize();
		},

		handleClickOnCustomTab: function(callback) {
			Module.StickerHelper.setEvent('click', this.el, this.controlTabs.custom.class, callback);
		},
		handleClickOnLastUsedPacksTab: function(callback) {
			Module.StickerHelper.setEvent('click', this.el, this.controlTabs.history.class, callback);
		},
		handleClickOnPackTab: function(callback) {
			Module.StickerHelper.setEvent('click', this.el, 'sp-pack-tab', callback);
		},

		onWindowResize: function() {

			if (!this.el.parentElement) {
				return;
			}

			if (this.controlTabs.prevPacks.el) {
				if (parseInt(this.scrollableContentEl.style.marginLeft, 10) < 0) {
					this.controlTabs.prevPacks.el.style.display = 'inline-block';
				} else {
					this.controlTabs.prevPacks.el.style.display = 'none';
				}
			}


			if (this.controlTabs.nextPacks.el) {
				var contentOffset = parseInt(this.scrollableContentEl.style.marginLeft, 10) || 0;

				if ((contentOffset * -1) < this.scrollableContainerEl.offsetWidth) {
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