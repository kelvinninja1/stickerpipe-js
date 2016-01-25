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
        
        enableEmojiTab: true,
        enableHistoryTab: true,

        htmlForEmptyRecent: '<div class="emptyRecent">empty recent text</div>',
        storagePrefix: 'stickerPipe_',
        
        apiKey: '72921666b5ff8651f374747bfefaf7b2',

        userId: MD5('<YOUR_USER_ID>')

    });
    
    sticker.render(function() {
    	// on render callback
    });
```

## Options


| Name                  | value                             |  description                                  |
| --------------------- | --------------------------------- | --------------------------------------------- |
| elId                  | id name string                    | name of container id where will render plugin |
| htmlForEmptyRecent    | html code                         | insert in empty recent block                  |
| apiKey                | api key your account              | your api key                                  |
| storagePrefix         | string                            | prefix for LocalStorage                       |
| enableEmojiTab        | boolean                           | if your wont use emoji tab                    |
| enableHistoryTab      | boolean                           | if your wont use history tab                  |
| userId                | md5 of user id - string           | client user id hash                           |
| userData              | object type                       | data of user for statistic                    |
| lang                  | "en", "ru" ...                    | language ISO 2                                |


## Methods

-  **render** - rendering sticker pipe keyboard

```js
    sticker.render([onRender, elId]);
```

-  **parseStickerFromText** - parse text and return img url if text is sticker
```js
    sticker.parseStickerFromText(text);
```

-  **parseEmojiFromText** - parse text and return text with replaced emoji to html
```js
    sticker.parseEmojiFromText(text);
```

-  **parseEmojiFromHtml** - parse html and return text with replaced html to emoji text
```js
    sticker.parseEmojiFromHtml(html);
```

- **onUserMessageSent** - when message send (for statistic)

```js
    sticker.onUserMessageSent(isSticker);
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
    sticker.openStore();
```

-  **closeStore** - close store modal window
```js
    sticker.closeStore();
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