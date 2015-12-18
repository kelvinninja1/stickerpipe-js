
(function(Module) {

	Module.StickerHelper.setConfig({

		elId: 'stickerPipe',
		storeContainerId: 'stickerPipeStore',

		stickerResolutionType : (window.devicePixelRatio == 2) ? 'xhdpi' : 'mdpi',
		tabResolutionType: (window.devicePixelRatio == 2) ? 'xxhdpi' : 'hdpi',

		tabItemClass: 'sp-tab-item',
		stickerItemClass: 'sp-sticker-item',
		emojiItemClass: 'sp-emoji',

		emojiTabContent: '<span class="sp-icon-face"></span>',
		historyTabContent: '<span class="sp-icon-clock"></span>',
		storeTabContent: '<span class="sp-icon-plus"></span>',
		settingsTabContent: '<span class="sp-icon-settings"></span>',
		prevPacksTabContent: '<span class="sp-icon-arrow-back"></span>',
		nextPacksTabContent: '<span class="sp-icon-arrow-forward"></span>',

		baseFolder: 'stk',

		htmlForEmptyRecent: '<div class="emptyRecent">Ваши Стикеры</div>',

		// todo: rename apikey --> apiKey
		apikey: '', // 72921666b5ff8651f374747bfefaf7b2

		// todo only one API url
		cdnUrl: 'http://cdn.stickerpipe.com',
		// todo: remove api url options
		clientPacksUrl: 'http://api.stickerpipe.com/api/v1/client-packs',
		userPacksUrl: 'http://api.stickerpipe.com/api/v1/user/packs',
		userPackUrl: 'http://api.stickerpipe.com/api/v1/user/pack',
		trackStatUrl: 'http://api.stickerpipe.com/api/v1/track-statistic',
		storeUrl: 'http://api.stickerpipe.com/api/v1/web',

		storagePrefix: 'stickerPipe',

		enableEmojiTab: false,
		enableHistoryTab: false,
		enableSettingsTab: false,
		enableStoreTab: false,

		userId: null,
		userGender: null,
		userAge: null,

		// todo: block or popover
		display: 'block',
		width: '320px',

		lang: document.documentElement.lang.substr(0, 2) || 'en'
	});

})(window.StickersModule);