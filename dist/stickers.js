

/* Begin: js/analytics.js */

document.addEventListener("DOMContentLoaded", function(event) {

    if(typeof window.ga === "undefined"){

        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
            (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
            m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

    }

    ga('create', 'UA-1113296-81', 'auto', {'name': 'stickerTracker'});
    ga('stickerTracker.send', 'pageview');

});

/* End: js/analytics.js */
/* Begin: js/config_base.js */
(function(Plugin) {

    Plugin.StickersModule = Plugin.StickersModule || {};

    Plugin.StickersModule.Config = {

        tabContainerId: "sttab",
        tabItemClass: "sttab_item",

        stickersContainerId: "stitems",
        stickerItemClass: "stitems_item",

        domain : "http://api.stickerpipe.com",
        baseFolder: "stk",

        stickerResolutionType : "mdpi",
        tabResolutionType: "xxhdpi",

        htmlForEmptyRecent: "<div class='emptyRecent'>Ваши Стикеры</div>",
        apikey: "72921666b5ff8651f374747bfefaf7b2",
        packsUrl: "http://api.stickerpipe.com/api/v1/client-packs",
        trackStatUrl: "http://api.stickerpipe.com/api/v1/track-statistic",

        storgePrefix: "stickerPipe",
        enableCustomTab: false

    };

})(window);
/* End: js/config_base.js */
/* Begin: js/Lockr.js */

(function(Plugin, Config) {

    Plugin.StickersModule = Plugin.StickersModule || {};
    Plugin.StickersModule.Lockr = {};


    var Lockr = Plugin.StickersModule.Lockr;

        Lockr.prefix = Config.storgePrefix;

        Lockr._getPrefixedKey = function(key, options) {
            options = options || {};

            if (options.noPrefix) {
                return key;
            } else {
                return this.prefix + key;
            }

        };

        Lockr.set = function (key, value, options) {
            var query_key = this._getPrefixedKey(key, options);

            try {
                localStorage.setItem(query_key, JSON.stringify({"data": value}));
            } catch (e) {
                if (console) console.warn("Lockr didn't successfully save the '{"+ key +": "+ value +"}' pair, because the localStorage is full.");
            }
        };

        Lockr.get = function (key, missing, options) {
            var query_key = this._getPrefixedKey(key, options),
                value;

            try {
                value = JSON.parse(localStorage.getItem(query_key));
            } catch (e) {
                value = null;
            }
            if(value === null)
                return missing;
            else
                return (value.data || missing);
        };

        Lockr.sadd = function(key, value, options) {
            var query_key = this._getPrefixedKey(key, options),
                json;

            var values = Lockr.smembers(key);

            if (values.indexOf(value) > -1) {
                return null;
            }

            try {
                values.push(value);
                json = JSON.stringify({"data": values});
                localStorage.setItem(query_key, json);
            } catch (e) {
                console.log(e);
                if (console) console.warn("Lockr didn't successfully add the "+ value +" to "+ key +" set, because the localStorage is full.");
            }
        };

        Lockr.smembers = function(key, options) {
            var query_key = this._getPrefixedKey(key, options),
                value;

            try {
                value = JSON.parse(localStorage.getItem(query_key));
            } catch (e) {
                value = null;
            }

            if (value === null)
                return [];
            else
                return (value.data || []);
        };

        Lockr.sismember = function(key, value, options) {
            var query_key = this._getPrefixedKey(key, options);

            return Lockr.smembers(key).indexOf(value) > -1;
        };

        Lockr.getAll = function () {
            var keys = Object.keys(localStorage);

            return keys.map(function (key) {
                return Lockr.get(key);
            });
        };

        Lockr.srem = function(key, value, options) {
            var query_key = this._getPrefixedKey(key, options),
                json,
                index;

            var values = Lockr.smembers(key, value);

            index = values.indexOf(value);

            if (index > -1)
                values.splice(index, 1);

            json = JSON.stringify({"data": values});

            try {
                localStorage.setItem(query_key, json);
            } catch (e) {
                if (console) console.warn("Lockr couldn't remove the "+ value +" from the set "+ key);
            }
        };

        Lockr.rm =  function (key) {
            localStorage.removeItem(key);
        };

        Lockr.flush = function () {
            localStorage.clear();
        };

})(window, window.StickersModule.Config);
/* End: js/Lockr.js */
/* Begin: js/helper.js */

(function(Plugin, Lockr) {
    Plugin.StickersModule = Plugin.StickersModule || {};


    Plugin.StickersModule.StickerHelper = {

        forEach: function(data, callback) {
            for (var x in data) {
                callback(data[x], x);
            }
        },

        mergeOptions: function(obj1, obj2){
            var obj3 = {};
            for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
            for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
            return obj3;
        },

        setEvent: function(eventType, id, className, callback) {

            document.getElementById(id).addEventListener(eventType, function (event) {

                var el = event.target
                    , found;

                while (el && !(found = el.className.match(className))) {

                    el = el.parentElement;
                }

                if (found) {
                    callback(el, event);
                }
            });

        },

        ajaxGet: function(url, apikey, callback) {
            var xmlhttp;

            xmlhttp = new XMLHttpRequest();

            xmlhttp.onreadystatechange = function(){
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
                    callback(JSON.parse(xmlhttp.responseText));
                }
            }
            xmlhttp.open("GET", url, true);
            xmlhttp.setRequestHeader("Apikey", apikey);
            xmlhttp.setRequestHeader("Platform", "JS");

            xmlhttp.send();
        },

        ajaxPost: function(url, apikey, data, callback) {
            var xmlhttp,
                uniqUserId = Lockr.get("uniqUserId");

            xmlhttp = new XMLHttpRequest();

            xmlhttp.onreadystatechange = function(){
                if (xmlhttp.readyState == 4 &&
                    xmlhttp.status == 200,
                    typeof callback != "undefined"){

                    callback(JSON.parse(xmlhttp.responseText));
                }
            }


            if(typeof uniqUserId == "undefined") {
                uniqUserId = + new Date();
                Lockr.set("uniqUserId", uniqUserId);
            }

            xmlhttp.open("POST", url, true);
            xmlhttp.setRequestHeader("Apikey", apikey);
            xmlhttp.setRequestHeader("Platform", "JS");
            xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xmlhttp.setRequestHeader("DeviceId", uniqUserId);


            xmlhttp.send(JSON.stringify(data));
        }

    };

})(window, window.StickersModule.Lockr);
/* End: js/helper.js */
/* Begin: js/controller_base.js */

(function(Plugin, StickerHelper) {

    Plugin.StickersModule = Plugin.StickersModule || {};

    function BaseController() {

        this.handleClickTab = function(itemsBlockId, itemsClassName, callback) {
            StickerHelper.setEvent("click", itemsBlockId, itemsClassName, callback);
        };

        this.handleClickSticker = function( itemsBlockId, itemsClassName, callback) {
            StickerHelper.setEvent("click", itemsBlockId, itemsClassName, callback);
        };

    };

    Plugin.StickersModule.BaseController = BaseController;

})(window, window.StickersModule.StickerHelper);/* End: js/controller_base.js */
/* Begin: js/service_base.js */

(function(Plugin, StickerHelper, Lockr) {

    Plugin.StickersModule = Plugin.StickersModule || {};

    function BaseService(Config) {

        var parseCountStat = 0,
            parseCountWithStickerStat = 0;

        var parseStickerStatHandle = function(is_have) {
            var nowDate = new Date().getTime() / 1000 | 0;

            parseCountStat++;

            if (is_have) {
                parseCountWithStickerStat++;
            }

            if (parseCountStat >= 50) {

                StickerHelper.ajaxPost(Config.trackStatUrl, Config.apikey, [
                    {
                        action: 'check',
                        category: 'message',
                        label: 'Events count',
                        time: nowDate,
                        value: parseCountStat
                    },
                    {
                        action: 'check',
                        category: 'message',
                        label: 'Stickers count',
                        time: nowDate,
                        value: parseCountWithStickerStat
                    }
                ]);

                ga('stickerTracker.send', 'event', 'message', 'check', 'Events count', parseCountStat);
                ga('stickerTracker.send', 'event', 'message', 'check', 'Stickers count', parseCountWithStickerStat);

                parseCountWithStickerStat = 0;
                parseCountStat = 0;
            }

        };

        this.addToLatestUse = function(code) {

            var storgeDate = Lockr.get("sticker_latest_use") || [],
                newStorgeDate = [];

            StickerHelper.forEach(storgeDate, function(codeFromStorge) {

                if(codeFromStorge.code != code) {
                    newStorgeDate.push(codeFromStorge);
                }
            });

            storgeDate = newStorgeDate;

            storgeDate.unshift({
                code : code
            });

            Lockr.set("sticker_latest_use", storgeDate);
        };

        this.getNewStickersFlag = function(packs) {
            return Lockr.get('sticker_have_new');
        };

        this.resetNewStickersFlag = function(packs) {
            return Lockr.set('sticker_have_new', false);
        };

        this.getLatestUse = function() {
            return Lockr.get('sticker_latest_use') || [];
        };

        this.getPacksFromStorge = function() {
            var expireDate = ( + new Date()),
                packsObj = Lockr.get('sticker_packs');

            if (typeof packsObj === 'undefined' ||
                packsObj.expireDate < expireDate) {

                return {
                    actual: false,
                    packs: typeof packsObj == 'object' && packsObj.packs ? packsObj.packs : []
                };
            } else {

                return {
                    actual: true,
                    packs: packsObj.packs
                };
            }
        };

        this.markNewPacks = function(oldPacks, newPacks) {
            var globalNew = false;

            if (oldPacks.length != 0){

                var installedPacks = [];

                StickerHelper.forEach(newPacks, (function(newPack, key) {

                    var isNewPack = true,
                        pack = this.getPackByName(oldPacks, newPack.pack_name);

                    if (pack) {
                        isNewPack = !!pack.newPack;
                    } else {
                        installedPacks.push(newPack);
                    }

                    globalNew = isNewPack || globalNew;

                    newPacks[key]['newPack'] = isNewPack;

                }).bind(this));

                if (installedPacks.length != 0) {
                    this.registerInstalledPacks(installedPacks);
                }

                if (globalNew) {
                    Lockr.set('sticker_have_new', globalNew);
                }
            } else {
                this.registerInstalledPacks(newPacks);
            }

            return newPacks;
        };

        this.registerInstalledPacks = function(packs) {
            var data = [],
                nowDate = new Date().getTime() / 1000 | 0;

            StickerHelper.forEach(packs, function(pack) {
                data.push({
                    action: 'install',
                    category: 'pack',
                    label: pack['pack_name'],
                    time: nowDate
                });

                ga('stickerTracker.send', 'event', 'pack', 'install', pack['pack_name']);
            });

            StickerHelper.ajaxPost(Config.trackStatUrl, Config.apikey, data);
        };

        this.setPacksToStorge = function(packsObj) {
            var expireDate = new Date(),
                saveObj = {
                    packs: packsObj,
                    expireDate: ( expireDate.setDate( expireDate.getDate() + 1) )
                };

            return Lockr.set("sticker_packs", saveObj);
        };

        this.getPacksFromServer = function(url, apikey, callback){
            StickerHelper.ajaxGet(url, apikey, callback);
        };

        this.getStickerUrl = function(text) {
            var outData = {
                    isSticker: false,
                    url: ''
                },
                matchData = text.match(/\[\[(\S+)_(\S+)\]\]/);

            parseStickerStatHandle(!!matchData);

            if (matchData) {
                outData.isSticker = true;
                outData.url = Config.domain +
                    "/" +
                    Config.baseFolder +
                    "/" + matchData[1] +
                    "/" + matchData[2] +
                    "_" + Config.stickerResolutionType +
                    ".png";

                outData.pack = matchData[1];
                outData.name = matchData[2];
            }

            return outData;
        };

        this.isNewPack = function(packs, packName, defaultValue) {
            var isNew = defaultValue || true;

            var pack = this.getPackByName(packs, packName);
            if (pack) {
                isNew = !!pack.newPack;
            }

            return isNew;
        };

        this.getPackByName = function(packs, packName) {

            for (var i = 0; i < packs.length; i++) {
                if (packs[i]['pack_name'] &&
                    packs[i]['pack_name'].toLowerCase() == packName.toLowerCase()) {
                    return packs[i];
                }
            }

            return null;
        };
    }

    Plugin.StickersModule.BaseService = BaseService;

})(window,
    StickersModule.StickerHelper,
    StickersModule.Lockr
);/* End: js/service_base.js */
/* Begin: js/view_base.js */

(function(Plugin, StickerHelper, BaseService) {

    function BaseView(Config) {

        var clearBlock = function(idBlock) {
            var conteinerEl = document.getElementById(idBlock);
            conteinerEl.setAttribute("style", "display:block");
            conteinerEl.innerHTML = "";
        };

        this.hideBlock = function(idBlock) {
            var conteinerEl = document.getElementById(idBlock);
            conteinerEl.setAttribute("style", "display:none");
        };

        this.renderTabs = function(stickerPacks, tabActive, tabContainerId, tabItemClass) {
            var conteinerEl = document.getElementById(tabContainerId),
                iteratorTabs = 0,
                newTabClass = "",
                tabActiveClass = "";

            clearBlock(tabContainerId);

            if(Config.enableCustomTab) {
                tabActiveClass = tabActive == -2 ? " active" : "";
                conteinerEl.innerHTML += "<span id = \"custom_tab\" class= \"" + tabItemClass + tabActiveClass + "\" data-tab-number = \"-2\" ></span>";
            }

            tabActiveClass = tabActive == -1 ? " active" : "";
            conteinerEl.innerHTML += "<span id = \"recents_tab\" class= \"" + tabItemClass + tabActiveClass +  "\" data-tab-number = \"-1\" ></span>";

            StickerHelper.forEach(stickerPacks, function(pack) {

                var tabActiveClass = newTabClass = "",
                    icon_src,
                    packItem;

                if(tabActive === iteratorTabs) {
                    tabActiveClass = " active";
                }

                if(pack.newPack) {
                    newTabClass = " stnewtab";
                }

                icon_src = Config.domain +
                    "/" +
                    Config.baseFolder +
                    "/" +
                    pack.pack_name +
                    "/tab_icon_" +
                    Config.tabResolutionType +
                    ".png";

                packItem = "<span class= \"" + tabItemClass + newTabClass + tabActiveClass + "\" data-tab-number = " + iteratorTabs + " > <img src=" + icon_src + "></span>";

                conteinerEl.innerHTML += packItem;
                iteratorTabs++;

            });
        };


        this.renderUseStickers = function(latesUseSticker, stickerContainerId, stickerItemClass) {
            var conteinerEl = document.getElementById(stickerContainerId),
                base_service = new BaseService(Config);

            clearBlock(stickerContainerId);

            if(latesUseSticker.length == 0) {

                conteinerEl.innerHTML += Config.htmlForEmptyRecent;

                return false;
            };


            StickerHelper.forEach(latesUseSticker, function(sticker) {

                var icon_src = base_service.getStickerUrl("[[" + sticker.code + "]]"),
                    packItem;

                    packItem = "<span data-sticker-string=" + sticker.code +" class=" + stickerItemClass + "> <img src=" + icon_src.url + "></span>";

                    conteinerEl.innerHTML += packItem;
            });

        };

        this.renderStickers = function(stickerPacks, tabActive, stickerContainerId, stickerItemClass) {
            var conteinerEl = document.getElementById(stickerContainerId),
                tabNumber = 0;

            clearBlock(stickerContainerId);

            StickerHelper.forEach(stickerPacks, function(pack) {

                if(tabNumber == tabActive) {
                    StickerHelper.forEach(pack.stickers, function(sticker) {

                        var icon_src = Config.domain +
                                       "/" +
                                       Config.baseFolder +
                                       "/" +
                                       pack.pack_name +
                                       "/" +
                                       sticker.name +
                                       "_" +
                                       Config.stickerResolutionType +
                                       ".png",

                            packItem = "<span data-sticker-string=" + pack.pack_name + "_" + sticker.name +" class=" + stickerItemClass + "> <img src=" + icon_src + "></span>";

                        conteinerEl.innerHTML += packItem;
                    });
                };

                tabNumber++;
            });
        };

    };


    Plugin.StickersModule.BaseView = BaseView;

})(window, StickersModule.StickerHelper, StickersModule.BaseService);/* End: js/view_base.js */


(function(Plugin, _module) {

    function Stickers(configObj) {

        var Config = _module.StickerHelper.mergeOptions(_module.Config, configObj);
            stService = new _module.BaseService(Config),
            stView = new _module.BaseView(Config),
            stController = new _module.BaseController(Config),
            configObj = configObj || {},
            stickersModel = {},
            tabActive = 0;


        var _renderAll = function() {
            
            stView.renderTabs(stickersModel, tabActive, Config.tabContainerId, Config.tabItemClass);

            if(tabActive == -1) {
                stView.renderUseStickers(stService.getLatestUse(), Config.stickersContainerId, Config.stickerItemClass);
            } else if (tabActive == -2) {
                stView.hideBlock(Config.stickersContainerId);
            } else {
                stView.renderStickers(stickersModel, tabActive, Config.stickersContainerId, Config.stickerItemClass);
            }

        };

        var  _init = function() {

            _renderAll();

            stController.handleClickTab(Config.tabContainerId, Config.tabItemClass, function(el) {
                tabActive = +el.getAttribute("data-tab-number");

                if(tabActive >= 0) stickersModel[tabActive].newPack = false;
                stService.setPacksToStorge(stickersModel);

                _renderAll();
            });

            stController.handleClickSticker(Config.stickersContainerId, Config.stickerItemClass, function(el) {
                var stickerAttribute = el.getAttribute("data-sticker-string"),
                    nowDate = new Date().getTime()/1000|0;


                _module.StickerHelper.ajaxPost(Config.trackStatUrl, Config.apikey, [
                    {
                        action: 'use',
                        category: 'sticker',
                        label: "[[" + stickerAttribute + "]]",
                        time: nowDate
                    }

                ]);

                ga('stickerTracker.send', 'event', 'sticker', stickerAttribute.split("_")[0], stickerAttribute.split("_")[1], 1);

                stService.addToLatestUse(stickerAttribute)
                _renderAll();

            });

        };

        this.fetchPacks = function(attrs) {
            var storgeStickerData;

            storgeStickerData =  stService.getPacksFromStorge();

            stService.getPacksFromServer(
                Config.packsUrl,
                Config.apikey,
                (function(response) {
                    if(response.status == "success") {
                        var stickerPacks = response.data;

                        stickerPacks = stService.markNewPacks(storgeStickerData.packs, stickerPacks);
                        stService.setPacksToStorge(stickerPacks);

                        stickersModel = stickerPacks;

                        if(!attrs.onlyFetch){
                            _init();
                        }


                        if(attrs.callback) attrs.callback.apply();
                    }
                }).bind(this)
            );
        };

        this.start = function(callback) {
            var storgeStickerData;

            tabActive = -1;

            storgeStickerData =  stService.getPacksFromStorge();

            if(storgeStickerData.actual) {

                stickersModel = storgeStickerData.packs;
                _init();

                if(callback) {
                    callback.apply();
                }
            } else {

                this.fetchPacks({
                    callback: callback
                });
            }


        };

        this.onClickSticker = function(callback, context) {

            stController.handleClickSticker(Config.stickersContainerId, Config.stickerItemClass, function(el) {
                callback.call(context, "[[" + el.getAttribute("data-sticker-string") + "]]");
            });

        };

        this.onClickCustomTab = function(callback, context) {

            stController.handleClickTab(Config.tabContainerId, Config.tabItemClass, function(el) {

                if (el.getAttribute("id") == "custom_tab" ) {
                    callback.call(context, el);
                }

            });

        };

        this.onClickTab = function(callback, context) {

            stController.handleClickTab(Config.tabContainerId, Config.tabItemClass, function(el) {
                callback.call(context, el);
            });

        };

        this.getNewStickersFlag = function() {
            return stService.getNewStickersFlag(stService.getPacksFromStorge().packs || []);
        };

        this.resetNewStickersFlag = function() {
            return stService.resetNewStickersFlag();
        };

        this.getStickerUrl = function(text) {
            return stService.getStickerUrl(text);
        };

        this.renderCurrentTab = function(tabName) {
            var obj = stService.getPacksFromStorge();

            this.start();

            _module.StickerHelper.forEach(obj.packs, function(pack, key) {

                if(pack.pack_name.toLowerCase() == tabName.toLowerCase()) {
                    tabActive = +key;
                }

            })

            //stickersModel[tabActive].newPack = false;
            //stService.setPacksToStorge(stickersModel);

            _renderAll();
        };

        this.isNewPack = function(packName, defaultValue) {
            return stService.isNewPack(stickersModel, packName, defaultValue || false);
        };

    }

    Plugin.Stickers = Stickers;

})(window, StickersModule);
