
## Table of contents

* [About](#about)
* [Demo](#demo)
* [Install](#install)
	* [Download](#download)
	* [CDN](#cdn)
	* [Bower](#bower)
* [Options](#pptions)
* [Methods](#methods)
* [Events](#events)
* [Callbacks](#callbacks)
* [Usage](#usage)
	* [Initialize](#initialize)
	* [Rendering](#rendering)
	* [Check sticker](#check-sticker)
	* [Parse sticker from text](#parse-sticker-from-text)
	* [Parse emoji from text](#parse-emoji-from-text)
	* [Parse emoji from html](#parse-emoji-from-html)
	* [Subscribe on events](#subscribe-on-events)
	* [Subscribe on callback](#subscribe-on-callback)
	* [Purchase](#purchase)
	* [Get pack main icon](#get-pack-main-icon)
	* [Statistic](#statistic)
* [Credits](#credits)
* [Contact](#contact)
* [License](#license)

## About

**Stickerpipe-js** is a stickers SDK for web (JS platform).

## Demo

This sample demonstrates how to add stickers to your chat. <br/>
If you want to build your own implementation, you can use our [public api](https://docs.google.com/document/d/1l0IZOSEZn1qzhCen4-YzlwnXL4xYHndNcE3xyGYvPrg/edit#heading=h.smt8analmeuq).

http://demo.stickerpipe.com (Example) <br/>
https://github.com/908Inc/stickerpipe-js/tree/gh-pages (Example sources)

## Install

### Download

- [stickers.js](build/js/stickers.js)  un-minified, or
- [stickers.min.js](build/js/stickers.min.js) minified 

### Bower

Bower: `bower install stickers --save`

## Options

| Name                  | Type        | Description                                   |
| --------------------- | ----------- | --------------------------------------------- |
| elId                  | string      | Container id where will be render plugin      |
| apiKey                | string      | Your api key                                  |
| enableEmojiTab        | boolean     | If you want use emoji tab                     |
| enableHistoryTab      | boolean     | If you want use history tab                   |
| enableStoreTab        | boolean     | If you want use store                         |
| htmlForEmptyRecent    | string      | Insert in empty recent block                  |
| storagePrefix         | string      | Prefix for local storage                      |
| lang                  | string      | Localization in ISO 2 format ("en", "ru")     |
| userId                | string      | User id (hash)                                |
| userData              | object      | Data of user for statistic                    |
| userPremium           | boolean     | Flag is user - premium (true / false)         |
| priceB                | string      | Price for packs with pricePoint = B           |
| priceC                | string      | Price for packs with pricePoint = C           |
| primaryColor          | string      | Primary color (HEX)                           |

## Methods

- **render([onRender])** - rendering sticker pipe keyboard
- **isSticker(text)** - return true if text is sticker
- **parseStickerFromText(text, callback)** - parse text and return object to callback, with sticker data (stickerId, url, html) if text is sticker else return null
- **parseEmojiFromText(text)** - parse text and return text with replaced emoji to html
- **parseEmojiFromHtml(html)** - parse html and return text with replaced html to emoji text
- **open([packName])** - open pack tab or by default - history tab
- **close()** - close sticker pipe popover
- **openStore([stickerId])** - open store in modal window
- **closeStore()** - close store modal window
- **purchaseSuccess(packName, pricePoint)** - call if purchase transaction was successful
- **purchaseFail()** - call if purchase transaction was failed
- **getPackMainIcon(packName, callback)** - call this method if you need get pack main icon url
- **onUserMessageSent(isSticker)** - call this method when a user sent a message (for statistic)

## Events

| Name                      |  description                                                        |
| ------------------------- | ------------------------------------------------------------------- |
| sp:popover:shown          | fire on popover was shown                                           |
| sp:popover:hidden         | fire on popover was hidden                                          |
| sp:content:highlight:show | fire on getting new content (unseen or when stickers history empty) |
| sp:content:highlight:hide | fire on have not new contend and stickers history not empty         |

## Callbacks

- **onClickSticker(function(stickerCode) {...}, context)** - fired when user click on sticker
- **onClickEmoji(function(emoji) {...}, context)** - fired when user click on emoji
- **onPurchase(function(packName, packTitle, pricePoint) {...})** - fired when user try purchase content

## Usage

### Initialize

Demo apiKey: 72921666b5ff8651f374747bfefaf7b2 <br/>
You can get your own API Key on http://stickerpipe.com to have customized packs set.

html
```html

    <div id="stickerPipe"></div>
```

js
```js
    var sticker = new Stickers({
    	
    	elId: 'stickerPipe',
    	
    	apiKey: '72921666b5ff8651f374747bfefaf7b2',
    		
    	enableEmojiTab: true,
    	enableHistoryTab: true,
    	enableStoreTab: true,
    	
    	htmlForEmptyRecent: 'You have not submitted any sticker',
    	storagePrefix: 'prefix_',
    	lang: 'en',
    	
    	userId: '<YOUR_USER_ID>',
    	userPremium: false,
    	userData: {
    		age: 20,
    		gender: 'male'
    	},
    	
    	priceB: '0.99 $',
    	priceC: '1.99 $'
    	
    });
```

### Rendering

```js
    sticker.render(function() {
    	// on render callback
    });
```

### Check sticker

```js
    sticker.isSticker('[[1593]]'); // return true
    sticker.isSticker('hello world'); // return false
```

### Parse sticker from text

```js
    sticker.parseStickerFromText('[[1593]]', function(sticker, isAsync) {
    	if (!sticker) {
    		return;
    	}
    	
    	// do something
    	console.log(sticker);
    });
```

### Parse emoji from text

```js
    var emojiHtml = sticker.parseEmojiFromText('😃');
    console.log(emojiHtml);
    
    // return:
    // <img class="emoji" draggable="false" alt="😃" src="http://twemoji.maxcdn.com/72x72/1f603.png">
```

### Parse emoji from html

```js
    var emoji = sticker.parseEmojiFromText('<img class="emoji" draggable="false" alt="😃" src="http://twemoji.maxcdn.com/72x72/1f603.png">');
    console.log(emoji);
    
    // return:
    // 😃
```

### Subscribe on events

```js
    window.addEventListener('sp:popover:shown', function() {
    	// do something ...
    });
    
    // or with jQuery
    
    $(window).on('sp:popover:shown', function() {
    	// do something ...
    });
```

### Subscribe on callback

```js
	stickerpipe.onClickSticker(function(stickerCode) {
		stickerpipe.onUserMessageSent(true);
		
		sendMessage(stickerCode); // your function
	});
```

### Purchase

```js
	stickerpipe.onPurchase(function(packName, packTitle, pricePoint) {
		var result = confirm('Do you want buy pack ' + packTitle + ' ?');

		if (result) {
			// do transaction ...
			stickerpipe.purchaseSuccess(packName, pricePoint);
		} else {
			stickerpipe.purchaseFail();
		}
	});
```

### Get pack main icon

```js
	stickerpipe.getPackMainIcon('pinkgorilla', function(url) {
		// do something
	});
```

### Statistic

To count the number of sendings messages and stickers, you need call an analysts method onUserMessageSent (boolean)

```js
	// when user send message
	stickerpipe.onUserMessageSent(stickerpipe.isSticker(message));
```

## Credits

Stickerpipe

## Contact

i@stickerpipe.com

## License

Stickerpipe-js is available under the Apache 2 license. See the [LICENSE](LICENSE) file for more information.
