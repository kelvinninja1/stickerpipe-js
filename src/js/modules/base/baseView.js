
(function(Plugin, Module) {

	var StickerHelper = Module.StickerHelper;

	Plugin.StickersModule.BaseView = Module.Class({

		config: null,
		service: null,

		el: null,
		tabsEl:  null,
		stickersEl:  null,

		controlTabs:  {},

		tabsController: null,

		_constructor: function(config, service) {
			this.config = config;
			this.service = service;

			//this.controlTabs = {
			//	custom: {
			//		id: 'spTabCustom',
			//		class: 'sp-tab-custom',
			//		content: this.config.customTabContent,
			//		number: -1,
			//		el: null
			//	},
			//	history: {
			//		id: 'spTabHistory',
			//		class: 'sp-tab-history',
			//		content: this.config.historyTabContent,
			//		number: -2,
			//		el: null
			//	},
			//	settings: {
			//		id: 'spTabSettings',
			//		class: 'sp-tab-settings',
			//		content: this.config.settingsTabContent,
			//		number: -3,
			//		el: null
			//	},
			//	store: {
			//		id: 'spTabSettings',
			//		class: 'sp-tab-store',
			//		content: this.config.storeTabContent,
			//		number: -4,
			//		el: null
			//	},
			//	prevPacks: {
			//		id: 'spTabPrevPacks',
			//		class: 'sp-tab-prev-packs',
			//		content: this.config.prevPacksTabContent,
			//		number: -5,
			//		el: null
			//	},
			//	nextPacks: {
			//		id: 'spTabNextPacks',
			//		class: 'sp-tab-next-packs',
			//		content: this.config.nextPacksTabContent,
			//		number: -6,
			//		el: null
			//	}
			//};

			this.tabsController = new Module.TabsController(this.config);
		},

		clearBlock: function(el) {
			el.setAttribute('style', 'display:block');
			el.innerHTML = '';
		},

		render: function(elId) {

			this.el = document.getElementById(elId);

			this.clearBlock(this.el);

			this.el.classList.add('sticker-pipe');

			this.tabsEl = document.createElement('div');
			this.tabsEl.classList.add('sp-tabs');

			this.stickersEl = document.createElement('div');
			this.stickersEl.classList.add('sp-stickers');

			this.el.appendChild(this.tabsEl);
			this.el.appendChild(this.stickersEl);
		},

		renderTabs: function(stickerPacks, tabActive) {

			this.tabsController.view.render(this.tabsEl, stickerPacks, tabActive);

			//this.clearBlock(this.tabsEl);
			//
			//this.renderControlTab(this.controlTabs.prevPacks, tabActive);
			//this.config.enableCustomTab && this.renderControlTab(this.controlTabs.custom, tabActive);
			//this.renderControlTab(this.controlTabs.history, tabActive);
			//
			//for (var j = 0; j < 1; j++) {
			//	for (var i = 0; i < stickerPacks.length; i++) {
			//		this.renderPackTab(stickerPacks[i], i, tabActive);
			//	}
			//}
			//
			//this.renderControlTab(this.controlTabs.settings, tabActive);
			//this.renderControlTab(this.controlTabs.store, tabActive);
			//this.renderControlTab(this.controlTabs.nextPacks, tabActive);
		},
		//renderPackTab: function(pack, number, tabActive) {
		//	var classes = ['sp-pack-tab'];
		//
		//	if(pack.newPack) {
		//		classes.push('stnewtab');
		//	}
		//
		//	var iconSrc = this.config.domain + '/' +
		//		this.config.baseFolder + '/' +
		//		pack.pack_name + '/tab_icon_' +
		//		this.config.tabResolutionType + '.png';
		//
		//	var content = '<img src=' + iconSrc + '>';
		//
		//	this.renderTab(null, classes, number, content, tabActive);
		//},
		//renderControlTab: function(tab, tabActive) {
		//	tab.el = this.renderTab(tab.id, [tab.class, 'sp-control-tab'], tab.number, tab.content, tabActive);
		//	return tab.el;
		//},
		//renderTab: function(id, classes, dataTabNumber, content, tabActive) {
		//	var tabEl = document.createElement('span');
		//
		//	if (id) {
		//		tabEl.id = id;
		//	}
		//
		//	classes.push(this.config.tabItemClass);
		//
		//	if (tabActive == dataTabNumber) {
		//		classes.push('active');
		//	}
		//
		//	tabEl.classList.add.apply(tabEl.classList, classes);
		//	tabEl.setAttribute('data-tab-number', dataTabNumber);
		//	tabEl.innerHTML = content;
		//
		//	this.tabsEl.appendChild(tabEl);
		//
		//	return tabEl;
		//},

		renderUseStickers: function(latesUseSticker, stickerItemClass) {
			var self = this;

			this.clearBlock(self.stickersEl);

			if (latesUseSticker.length == 0) {

				this.stickersEl.innerHTML += this.config.htmlForEmptyRecent;

				return false;
			}


			StickerHelper.forEach(latesUseSticker, (function(sticker) {

				var icon_src = this.service.parseStickerFromText("[[" + sticker.code + "]]"),
					packItem;

				packItem = "<span data-sticker-string=" + sticker.code +" class=" + stickerItemClass + "> <img src=" + icon_src.url + "></span>";

				self.stickersEl.innerHTML += packItem;
			}).bind(this));

		},

		renderCustomBlock: function() {
			this.clearBlock(this.stickersEl);
		},

		renderStickers: function(stickerPacks, tabActive, stickerItemClass) {
			var self = this,
				tabNumber = 0;

			this.clearBlock(this.stickersEl);

			StickerHelper.forEach(stickerPacks, function(pack) {

				if (tabNumber == tabActive) {
					StickerHelper.forEach(pack.stickers, function(sticker) {

						var icon_src = self.config.domain +
								"/" +
								self.config.baseFolder +
								"/" +
								pack.pack_name +
								"/" +
								sticker.name +
								"_" +
								self.config.stickerResolutionType +
								".png",

							packItem = "<span data-sticker-string=" + pack.pack_name + "_" + sticker.name +" class=" + stickerItemClass + "> <img src=" + icon_src + "></span>";

						self.stickersEl.innerHTML += packItem;
					});
				}

				tabNumber++;
			});
		},

		renderStorePack: function(packName) {

			var storeEl = document.getElementById(this.config.storeContainerId),
				iframe = document.createElement('iframe'),
				urlParams = {
					apiKey: this.config.apikey,
					platform: 'JS',
					userId: this.config.userId,
					density: this.config.stickerResolutionType
				},
				urlSerialize = function(obj) {
					var str = [];
					for(var p in obj)
						if (obj.hasOwnProperty(p)) {
							str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
						}
					return str.join('&');
				};

			storeEl.classList.add('sp-store');
			storeEl.innerHTML = '';
			storeEl.appendChild(iframe);

			iframe.style.width = '100%';
			iframe.style.height = '100%';
			iframe.style.border = '0';

			// todo
			//iframe.src = 'http://work.stk.908.vc/api/v1/web?' + urlSerialize(urlParams) + '#/packs/' + packName;
			iframe.src = 'http://localhost/stickerpipe/store/build?' + urlSerialize(urlParams) + '#/packs/' + packName;
		}
	});

})(window, window.StickersModule);