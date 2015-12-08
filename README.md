## About

**Stickerpipe-js** is a javascript library for easy integration stickers in your project.

## Demo

http://stickerpipe.com/demo


## Install

### Download

- [stickers.js](https://github.com/908Inc/stickerpipe-js/raw/master/dist/stickers.js)  un-minified, or
- [stickers.min.js](https://github.com/908Inc/stickerpipe-js/raw/master/dist/stickers.min.js) minified 

### CDN

```js
<script src="http://cdn.stickerpipe.com/stickerjs/lib/0.0.1/stickers.js"></script>
<!-- or -->
<script src="http://cdn.stickerpipe.com/stickerjs/lib/0.0.1/stickers.min.js"></script>
```

### Bower


Bower: bower install stickers --save





## Initialize

demo apikey: 72921666b5ff8651f374747bfefaf7b2

If you want use own apikey: http://stickerpipe.com/

js
```js
    var sticker = new Stickers({
        
        tabContainerId: "sttab",
        tabItemClass: "sttab_item",

        stickersContainerId: "stitems",
        stickerItemClass: "stitems_item",

        stickerResolutionType: "mdpi",
        tabResolutionType: "xxhdpi",

        htmlForEmptyRecent: "<div class='emptyRecent'>empty recent text</div>",
        storagePrefix: "stickerPipe",
        apikey: "72921666b5ff8651f374747bfefaf7b2",

        userId: MD5('<YOUR_USER_ID>')

    });
```

html
```html

    <div class="sttab" id="sttab"></div>
    <div class="stitems" id="stitems"></div>
```


## Methods

-  parse text and return img url if text is sticker
```js
    sticker.parseStickerFromText(text);
```

-  parse text and return text with replaced emoji to html
```js
    sticker.parseEmojiFromText(text);
```

-  parse html and return text with replaced html to emoji text
```js
    sticker.parseEmojiFromHtml(html);
```

-  open current tab
```js
    sticker.renderCurrentTab(tabName);
```

- return - are the new content flag

```js
    sticker.getNewStickersFlag();
```

- when message send (for statistic)

```js
    sticker.onUserMessageSent(isSticker);
```



## Events

- when user click on sticker
    
```js
    sticker.onClickSticker(function(text) {...}, context);
```

- when user click on emoji

```js
    sticker.onClickEmoji(function(text) {...}, context);
```

- when user click on tab
    
```js
    sticker.onClickTab(function(el) {...}, context);
```

- when user click on custom tab
    
```js
    sticker.onClickCustomTab(function(el) {...}, context);
```

| Name                      |  description                                                        |
| ------------------------- | ------------------------------------------------------------------- |
| sp:popover:shown          | fire on popover was shown                                           |
| sp:popover:hidden         | fire on popover was hidden                                          |
| sp:content:highlight:show | fire on getting new content (unseen or when stickers history empty) |
| sp:content:highlight:hide | fire on have not new contend and stickers history not empty         |


## Options


| Name                  | value                             |  description                                  |
| --------------------- | --------------------------------- | --------------------------------------------- |
| elId                  | id name string                    | name of container id where will render plugin |
| tabItemClass          | class name string                 | Will set in tab block                         |
| stickerItemClass      | class name string                 | Will set in sticker block                     |
| emojiItemClass        | class name string                 | Will set in emoji block                       |
| stickerResolutionType | "mdpi", "hdpi", "xhdpi", "xxhdpi" | stickers size                                 |
| tabResolutionType     | "mdpi", "hdpi", "xhdpi", "xxhdpi" | tab icon size                                 |
| htmlForEmptyRecent    | html code                         | insert in empty recent block                  |
| apikey                | api key your account              | if you wont use custom tabs                   |
| storagePrefix         | string                            | prefix for LocalStorage                       |
| enableEmojiTab        | boolean                           | if your wont use emoji                        |
| userId                | md5 of user id - string           | client user id hash                           |
| lang                  | "en", "ru" ...                    | language ISO 2                                |
| onload                | function                          | callback when plugin load                     |


## Credits

908 Inc.

## Contact

mail@908.vc



## License

Stickerpipe-js is available under the Apache 2 license. See the [LICENSE](LICENSE) file for more information.