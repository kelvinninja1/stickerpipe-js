
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

            if (oldPacks.length){

                var installedPacks = [];

                StickerHelper.forEach(newPacks, (function(newPack) {

                    var isNewPack = true,
                        pack = this.getPackByName(oldPacks, newPack.pack_name);

                    if (pack) {
                        isNewPack = !!pack.newPack;
                    } else {
                        installedPacks.push(newPack);
                    }

                    globalNew = isNewPack || globalNew;

                    newPacks.newPack = isNewPack;

                }).bind(this));

                if (installedPacks.length) {
                    this.registerInstalledPacks(installedPacks);
                }

                if (globalNew) {
                    Lockr.set('sticker_have_new', globalNew);
                }
            } else {
                StickerHelper.forEach(newPacks, function(pack) {
                   pack['newPack'] = false;
                });
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

        this.isNewPack = function(packs, packName) {
            var isNew = true;

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
);