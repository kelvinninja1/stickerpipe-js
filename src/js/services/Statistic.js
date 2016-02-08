
(function(Plugin) {

	function trackStatistic(category, action, label) {
		Plugin.Service.Api.sendStatistic([{
			category: category,
			action: action,
			label: label
		}]);

		ga('stickerTracker.send', 'event', category, action, label);
	}

	Plugin.Service.Statistic = {

		messageSend: function(isSticker) {
			trackStatistic('message', 'send', ((isSticker) ? 'sticker' : 'text'));
		},

		useSticker: function(stickerId) {
			trackStatistic('sticker', 'use', stickerId);
		},

		useEmoji: function(emoji) {
			trackStatistic('emoji', 'use', emoji);
		}

	};

})(StickersModule);
