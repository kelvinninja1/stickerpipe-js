
(function(Plugin) {


	var packTabSize = 48,
		classes = {
			scrollableContainer: 'sp-tabs-scrollable-container',
			scrollableContent: 'sp-tabs-scrollable-content',
			controlTab: 'sp-control-tab',
			controlButton: 'sp-control-button',
			unwatched: 'sp-unwatched-content',
			packTab: 'sp-pack-tab',
			tabActive: 'sp-tab-active',
			tabs: 'sp-tabs'
		};

	Plugin.View.Tabs = Plugin.Libs.Class({

		el: null,
		scrollableContainerEl: null,
		scrollableContentEl: null,

		packTabs: {},
		packTabsIndexes: {},

		hasActiveTab: false,

		controls: {
			emoji: {
				id: 'spTabEmoji',
				class: 'sp-tab-emoji',
				icon: 'sp-icon-face',
				el: null,
				isTab: true
			},
			history: {
				id: 'spTabHistory',
				class: 'sp-tab-history',
				icon: 'sp-icon-clock',
				el: null,
				isTab: true
			},
			settings: {
				id: 'spTabSettings',
				class: 'sp-tab-settings',
				icon: 'sp-icon-settings',
				el: null,
				isTab: false
			},
			store: {
				id: 'spTabStore',
				class: 'sp-tab-store',
				icon: 'sp-icon-plus',
				el: null,
				isTab: false
			},
			prevPacks: {
				id: 'spTabPrevPacks',
				class: 'sp-tab-prev-packs',
				icon: 'sp-icon-arrow-back',
				el: null,
				isTab: false
			},
			nextPacks: {
				id: 'spTabNextPacks',
				class: 'sp-tab-next-packs',
				icon: 'sp-icon-arrow-forward',
				el: null,
				isTab: false
			}
		},

		_constructor: function() {

			this.el = document.createElement('div');

			window.addEventListener('resize', (function() {
				this.onWindowResize();
			}).bind(this));
		},


		render: function() {

			this.el.className = classes.tabs;
			this.el.innerHTML = '';

			this.renderPrevPacksTab();

			this.renderScrollableContainer();

			this.renderPacks();

			this.renderNextPacksTab();

			this.renderStoreTab();
		},
		renderScrollableContainer: function() {

			this.scrollableContentEl = document.createElement('div');
			this.scrollableContentEl.className = classes.scrollableContent;

			this.scrollableContainerEl = document.createElement('div');
			this.scrollableContainerEl.className = classes.scrollableContainer;

			this.scrollableContainerEl.appendChild(this.scrollableContentEl);
			this.el.appendChild(this.scrollableContainerEl);
		},
		renderControlButton: function(controlButton) {
			controlButton.isTab = controlButton.isTab || false;

			var buttonClasses = [controlButton.class];
			buttonClasses.push((controlButton.isTab) ? classes.controlTab : classes.controlButton);

			var content = '<span class="' + controlButton.icon + '"></span>';

			controlButton.el = this.renderTab(controlButton.id, buttonClasses, content);
			return controlButton.el;
		},
		renderPackTab: function(pack) {
			var tabClasses = [classes.packTab];

			if (pack.isUnwatched) {
				tabClasses.push(classes.unwatched);
			}

			var content = '<img src=' + pack.tab_icon['xxhdpi'] + '>';

			var tabEl = this.renderTab(null, tabClasses, content, {
				'data-pack-name': pack.pack_name
			});

			tabEl.addEventListener('click', (function() {
				tabEl.classList.remove(classes.unwatched);
			}).bind(this));

			this.packTabs[pack.pack_name] = tabEl;

			return tabEl;
		},
		renderTab: function(id, tabClasses, content, attrs) {
			tabClasses = tabClasses || [];
			attrs = attrs || {};

			var tabEl = document.createElement('span');

			if (id) {
				tabEl.id = id;
			}

			tabClasses.push(Plugin.Configs.tabItemClass);

			tabEl.classList.add.apply(tabEl.classList, tabClasses);

			for (var name in attrs) {
				tabEl.setAttribute(name, attrs[name]);
			}

			tabEl.innerHTML = content;

			tabEl.addEventListener('click', (function() {
				if (!tabEl.classList.contains(classes.controlTab) &&
					!tabEl.classList.contains(classes.packTab)) {
					return;
				}

				for (var tabName in this.packTabs) {
					this.packTabs[tabName].classList.remove(classes.tabActive);
				}

				for (var controlName in this.controls) {
					var controlTab = this.controls[controlName];
					if (controlTab && controlTab.el) {
						controlTab.el.classList.remove(classes.tabActive);
					}
				}

				tabEl.classList.add(classes.tabActive);
			}).bind(this));

			return tabEl;
		},


		renderPacks: function() {
			this.scrollableContentEl.innerHTML = '';

			this.renderEmojiTab();
			this.renderHistoryTab();

			var packs = Plugin.Service.Storage.getPacks();

			for (var i = 0; i < packs.length; i++) {
				var pack = packs[i];

				if (Plugin.Service.Pack.isHidden(pack)) {
					continue;
				}

				this.scrollableContentEl.appendChild(this.renderPackTab(pack));
				this.packTabsIndexes[pack.pack_name] = i;
			}

			this.renderSettingsTab();
		},
		renderEmojiTab: function() {
			if (Plugin.Configs.enableEmojiTab) {
				this.scrollableContentEl.appendChild(this.renderControlButton(this.controls.emoji));
			}
		},
		renderHistoryTab: function() {
			if (Plugin.Configs.enableHistoryTab) {
				this.scrollableContentEl.appendChild(this.renderControlButton(this.controls.history));
			}
		},
		renderSettingsTab: function() {
			if (Plugin.Configs.enableSettingsTab) {
				this.scrollableContentEl.appendChild(this.renderControlButton(this.controls.settings));
			}
		},
		renderStoreTab: function() {
			if (Plugin.Configs.enableStoreTab) {
				this.el.appendChild(this.renderControlButton(this.controls.store));

				if (Plugin.Service.Storage.getStoreLastModified() > Plugin.Service.Storage.getStoreLastVisit()) {
					this.controls.store.el.classList.add('sp-unwatched-content');
				}
			}
		},
		renderPrevPacksTab: function() {
			this.el.appendChild(this.renderControlButton(this.controls.prevPacks));
			Plugin.Service.Helper.setEvent('click', this.el, this.controls.prevPacks.class, this.onClickPrevPacksButton.bind(this));
		},
		renderNextPacksTab: function() {
			this.el.appendChild(this.renderControlButton(this.controls.nextPacks));
			Plugin.Service.Helper.setEvent('click', this.el, this.controls.nextPacks.class, this.onClickNextPacksButton.bind(this));
		},


		onClickPrevPacksButton: function() {
			var containerWidth = this.scrollableContainerEl.offsetWidth;
			var contentOffset = parseInt(this.scrollableContentEl.style.left, 10) || 0;
			var countFullShownTabs = parseInt((containerWidth / packTabSize), 10);

			var offset = contentOffset + (packTabSize * countFullShownTabs);
			offset = (offset > 0) ? 0 : offset;
			this.scrollableContentEl.style.left = offset + 'px';
			this.onWindowResize();
		},
		onClickNextPacksButton: function() {
			var containerWidth = this.scrollableContainerEl.offsetWidth;
			var contentOffset = parseInt(this.scrollableContentEl.style.left, 10) || 0;
			var countFullShownTabs = parseInt((containerWidth / packTabSize), 10);

			var offset = -(packTabSize * countFullShownTabs) + contentOffset;
			this.scrollableContentEl.style.left = offset + 'px';
			this.onWindowResize();
		},


		activeTab: function(tabName) {
			var i = this.packTabsIndexes[tabName];

			if (Plugin.Configs.enableEmojiTab) {
				i++;
			}
			if (Plugin.Configs.enableHistoryTab) {
				i++;
			}

			this.packTabs[tabName].click();
			this.hasActiveTab = true;

			var packTabSize = this.scrollableContentEl.getElementsByClassName(classes.packTab)[0].offsetWidth;
			var containerWidth = this.scrollableContainerEl.offsetWidth;
			var countFullShownTabs = parseInt((containerWidth / packTabSize), 10);

			var offset = -(parseInt((i / countFullShownTabs), 10) * containerWidth);
			//offset = (offset > 0) ? 0 : offset + 6; // old code
			offset = (-offset < countFullShownTabs * packTabSize) ? 0 : offset + 6; // bugfix todo

			this.scrollableContentEl.style.left = offset + 'px';

			this.onWindowResize();
		},
		activeLastUsedStickersTab: function() {
			this.controls.history.el.click();
			this.hasActiveTab = true;
		},


		handleClickOnEmojiTab: function(callback) {
			Plugin.Service.Helper.setEvent('click', this.el, this.controls.emoji.class, callback);
		},
		handleClickOnRecentTab: function(callback) {
			Plugin.Service.Helper.setEvent('click', this.el, this.controls.history.class, callback);
		},
		handleClickOnPackTab: function(callback) {
			Plugin.Service.Helper.setEvent('click', this.el, classes.packTab, callback);
		},
		handleClickOnStoreTab: function(callback) {
			Plugin.Service.Helper.setEvent('click', this.el, this.controls.store.class, callback);
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