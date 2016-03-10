
(function(Plugin) {

	Plugin.Service.Helper.setConfig({

		elId: 'stickerPipe',

		resolution: 'xxhdpi',

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

		primaryColor: '',

		// todo: block or popover
		display: 'block',
		height: '350px',
		width: '320px',

		lang: document.documentElement.lang.substr(0, 2) || 'en'
	});

	switch(window.devicePixelRatio) {
		case 1:
			Plugin.Configs.resolution = 'mdpi';
			break;
		case 2:
			Plugin.Configs.resolution = 'xhdpi';
			break;
		default:
			Plugin.Configs.resolution = 'xxhdpi';
			break;
	}

})(window.StickersModule);