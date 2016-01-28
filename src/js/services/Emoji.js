
(function(Plugin) {

	Plugin.Service.Emoji = {

		emojiProvider: null,

		init: function(emojiProvider) {
			this.emojiProvider = emojiProvider;
		},

		parseEmojiFromText: function(text) {
			return this.emojiProvider.parse(text, {
				size: (window.devicePixelRatio == 2) ? 72 : 36
			});
		},

		parseEmojiFromHtml: function(html) {
			var content = document.createElement('div');
			content.innerHTML = html;

			var emojisEls = content.getElementsByClassName('emoji');

			for (var i = emojisEls.length - 1; i >= 0; i--) {
				var emoji = emojisEls[i].getAttribute('alt');
				content.replaceChild(document.createTextNode(emoji), emojisEls[i]);
			}

			return content.innerHTML;
		}
	};

})(window.StickersModule);