## About

**Stickerpipe-js** is a javascript library for easy integration stickers in your project.

## Demo

http://demo.stickerpipe.com (Example)

https://github.com/908Inc/stickerpipe-js/tree/gh-pages (Example sources)

## Install

### Download

- [stickers.js](https://github.com/908Inc/stickerpipe-js/raw/master/dist/stickers.js)  un-minified, or
- [stickers.min.js](https://github.com/908Inc/stickerpipe-js/raw/master/dist/stickers.min.js) minified 

### CDN

```js
<script src="http://cdnjs.stickerpipe.com/libs/sdk/0.0.3/stickers.js"></script>
<!-- or -->
<script src="http://cdnjs.stickerpipe.com/libs/sdk/0.0.3/stickers.min.js"></script>
```

### Bower

Bower: bower install stickers --save


## Initialize

Demo apiKey: 72921666b5ff8651f374747bfefaf7b2

If you want use own apiKey: http://stickerpipe.com/

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
    
    sticker.render(function() {
    	// on render callback
    });
```

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
| lang                  | string      | Language ISO 2 ("en", "ru")                   |
| userId                | string      | User id (hash)                                |
| userData              | object      | Data of user for statistic                    |
| userPremium           | boolean     | Flag is user - premium                        |
| priceB                | string      | Price for packs with pricePoint = B           |
| priceC                | string      | Price for packs with pricePoint = C           |



## Methods

-  **render** - rendering sticker pipe keyboard

```js
    sticker.render([onRender]);
```

-  **parseStickerFromText** - parse text and return object to callback, with sticker data (stickerId, url, html) if text is sticker else return null
```js
    sticker.parseStickerFromText(text, callback);
```

-  **parseEmojiFromText** - parse text and return text with replaced emoji to html
```js
    sticker.parseEmojiFromText(text);
```

-  **parseEmojiFromHtml** - parse html and return text with replaced html to emoji text
```js
    sticker.parseEmojiFromHtml(html);
```

-  **open** - open pack tab or by default - history tab
```js
    sticker.open([packName]);
```

-  **close** - close sticker pipe popover
```js
    sticker.close();
```

-  **openStore** - open store in modal window
```js
    sticker.openStore([stickerId]);
```

-  **closeStore** - close store modal window
```js
    sticker.closeStore();
```

-  **purchaseSuccess** - call if purchase transaction was successful
```js
    sticker.purchaseSuccess(packName, pricePoint);
```

-  **purchaseFail** - call if purchase transaction was failed
```js
    sticker.purchaseFail();
```

- **onUserMessageSent** - call when message send (for statistic)

```js
    sticker.onUserMessageSent(isSticker);
```

- **md5** - return md5 hash of string

```js
    sticker.md5(string);
```

## Events

| Name                      |  description                                                        |
| ------------------------- | ------------------------------------------------------------------- |
| sp:popover:shown          | fire on popover was shown                                           |
| sp:popover:hidden         | fire on popover was hidden                                          |
| sp:content:highlight:show | fire on getting new content (unseen or when stickers history empty) |
| sp:content:highlight:hide | fire on have not new contend and stickers history not empty         |

### Example

```js
    window.addEventListener('sp:popover:shown', function() {
    	// do something ...
    });
    
    // or with jQuery
    
    $(window).on('sp:popover:shown', function() {
    	// do something ...
    });
```

## Callbacks

- **onClickSticker** - fired when user click on sticker
    
```js
    sticker.onClickSticker(function(text) {...}, context);
```

- **onClickEmoji** - fired when user click on emoji

```js
    sticker.onClickEmoji(function(text) {...}, context);
```

- **onClickCustomTab** - fired when user click on custom tab
    
```js
    sticker.onClickCustomTab(function(el) {...}, context);
```

## Credits

908 Inc.

## Contact

mail@908.vc


## License

Stickerpipe-js is available under the Apache 2 license. See the [LICENSE](LICENSE) file for more information.