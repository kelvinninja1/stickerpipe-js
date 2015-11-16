
(function(Plugin, Module) {


	Module.TabsView = Module.Class({

		el: null,
		scrollableContentEl: null,

		controlTabs: null,
		config: null,

		_constructor: function(config) {
			this.config = config;

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
		},

		// el == tabsEl
		render: function(el, stickerPacks, tabActive) {

			this.el = el;
			this.el.innerHTML = '';

			this.renderControlTab(this.el, this.controlTabs.prevPacks, tabActive);

			// scrollable container

			this.scrollableContentEl = document.createElement('div');
			this.scrollableContentEl.style.float = 'left';

			this.scrollableContentEl.style.width = '300px';
			this.scrollableContentEl.style.whiteSpace = 'nowrap';
			this.scrollableContentEl.style.borderRight = '1px solid red';
			this.scrollableContentEl.style.overflow = 'scroll';

			//float: left;
			//width: 300px;
			//white-space: nowrap !important;
			///* overflow-x: scroll; */
			//border-right: 1px solid red;
			///* height: 50px; */
			///* overflow-y: hidden; */
			//overflow: scroll;


			this.el.appendChild(this.scrollableContentEl);

			// ********************

			//this.config.enableCustomTab && this.renderControlTab(this.scrollableContentEl, this.controlTabs.custom, tabActive);
			this.renderControlTab(this.scrollableContentEl, this.controlTabs.history, tabActive);

			this.renderPackTab(stickerPacks[0], 0, tabActive);

			//for (var j = 0; j < 3; j++) {
			//	for (var i = 0; i < stickerPacks.length; i++) {
			//		this.renderPackTab(stickerPacks[i], i, tabActive);
			//	}
			//}

			this.renderControlTab(this.scrollableContentEl, this.controlTabs.settings, tabActive);
			this.renderControlTab(this.el, this.controlTabs.store, tabActive);
			this.renderControlTab(this.el, this.controlTabs.nextPacks, tabActive);
		},
		renderControlTab: function(el, tab, tabActive) {
			tab.el = this.renderTab(el, tab.id, [tab.class, 'sp-control-tab'], tab.number, tab.content, tabActive);
			return tab.el;
		},
		renderPackTab: function(pack, number, tabActive) {
			var classes = ['sp-pack-tab'];

			if(pack.newPack) {
				classes.push('sp-new-pack');
			}

			var iconSrc = this.config.domain + '/' +
				this.config.baseFolder + '/' +
				pack.pack_name + '/tab_icon_' +
				this.config.tabResolutionType + '.png';

			var content = '<img src=' + iconSrc + '>';

			this.renderTab(this.scrollableContentEl, null, classes, number, content, tabActive);
		},
		renderTab: function(el ,id, classes, dataTabNumber, content, tabActive) {
			var tabEl = document.createElement('span');

			if (id) {
				tabEl.id = id;
			}

			classes.push(this.config.tabItemClass);

			if (tabActive == dataTabNumber) {
				classes.push('active');
			}

			tabEl.classList.add.apply(tabEl.classList, classes);
			tabEl.setAttribute('data-tab-number', dataTabNumber);
			tabEl.innerHTML = content;

			el.appendChild(tabEl);

			return tabEl;
		}
	});

})(window, window.StickersModule);