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
        storgePrefix: "stickerPipe",
        apikey: "72921666b5ff8651f374747bfefaf7b2",

    });
    
    sticker.start();
```

html
```html

    <div class="sttab" id="sttab"></div>
    <div class="stitems" id="stitems"></div>
```


## Methods

-  render stickers and tabs
```js
    sticker.start();
```

-  parse text and return img url if text is sticker
```js
    sticker.getStickerUrl(text);
```

-  open current tab
```js
    sticker.renderCurrentTab(tabName);
```



## Events

- when user click on sticker
    
```js
    sticker.onClickSticker(function(text) { {...}, context );
```

- when user click on tab
    
```js
    sticker.onClickTab(function(el) { {...}, context );
```

- when user click on custom tab
    
```js
    sticker.onClickCustomTab(function(el) { {...}, context );
```


## Options


| Name | value |  description  |
| ------------- | ----------- | -----------|
| tabContainerId      |id name string|  name of container id where will render tabs  |
| tabItemClass     | class name string |Will set in tab block  |
| stickersContainerId | id name string|name of container id where will render tabs |
| stickerItemClass |class name string | Will set in sticker block |
| stickerResolutionType | "mdpi", "hdpi", "xhdpi", "xxhdpi" | stickers size |
| tabResolutionType | "mdpi", "hdpi", "xhdpi", "xxhdpi" | tab icon size |
| htmlForEmptyRecent | html code | insert in empty recent block |
| apikey | api key your account | if you wont use custom tabs |
| storgePrefix | string | prefix for LocalStorge |
| enableCustomTab | boolean| if your wont use something other like a twitter emoji|


## Credits

908 Inc.

## Contact

mail@908.vc



## License

Stickerpipe-js is available under the Apache 2 license. See the [LICENSE](LICENSE) file for more information.