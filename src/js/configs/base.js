
(function(Plugin) {

	Plugin.Service.Helper.setConfig({

		elId: 'stickerPipe',

		// todo: more than 2 resolution
		stickerResolutionType : (window.devicePixelRatio == 1) ? 'mdpi' : 'xhdpi',
		tabResolutionType: (window.devicePixelRatio == 1) ? 'hdpi' : 'xxhdpi',

		tabItemClass: 'sp-tab-item',
		stickerItemClass: 'sp-sticker-item',
		emojiItemClass: 'sp-emoji',

		htmlForEmptyRecent: 'No recent stickers',

		apiKey: null,

		apiUrl: 'http://api.stickerpipe.com',

		storagePrefix: 'stickerpipe_',

		enableEmojiTab: false,
		enableHistoryTab: false,
		enableSettingsTab: false,
		enableStoreTab: false,

		userId: null,
		userPremium: false,
		userData: {},

		priceB: null,
		priceC: null,

		// todo: block or popover
		display: 'block',
		height: '350px',
		width: '320px',

		lang: document.documentElement.lang.substr(0, 2) || 'en'
	});

})(window.StickersModule);