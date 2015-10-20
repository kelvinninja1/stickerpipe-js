
(function(Plugin, StickerHelper, Lockr) {

    Plugin.StickersModule = Plugin.StickersModule || {};

     function BaseService(Config) {

        var parseCountStat = 0,
            parseCountWithStickerStat = 0;


        var parseStickerStatHandle = function(is_have) {
            var nowDate = new Date().getTime()/1000|0;

            parseCountStat++;

            if(is_have) {
                parseCountWithStickerStat++;
            }

            if(parseCountStat >= 50) {

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
            return Lockr.get("sticker_have_new");
        };

        this.resetNewStickersFlag = function(packs) {
            return Lockr.set("sticker_have_new", false);
        };


        this.getLatestUse = function() {
            return Lockr.get("sticker_latest_use") || [];
        };

        this.getPacksFromStorge = function() {
            var expireDate = ( + new Date()),
                packsObj = Lockr.get("sticker_packs");

            if(typeof packsObj === "undefined" ||
               packsObj.expireDate < expireDate) {

               return {
                   actual: false,
                   packs: typeof packsObj == "object" && packsObj.packs ? packsObj.packs : []
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


            if(oldPacks.length != 0){

                StickerHelper.forEach(newPacks, function(newPack, key) {
                    var isNewPack = true;

                    StickerHelper.forEach(oldPacks, function(oldPack) {


                        if(newPack.pack_name == oldPack.pack_name) {
                            isNewPack = oldPack.newPack;
                        }

                    });

                    if(isNewPack)  globalNew = true;
                    newPacks[key]['newPack'] = isNewPack;
                });


                if(globalNew) {
                    Lockr.set("sticker_have_new", globalNew);
                }
            }

            return newPacks;
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
                    url: ""
                },
                matchData = text.match(/\[\[(\S+)_(\S+)\]\]/);

            parseStickerStatHandle(!!matchData);

            if(matchData) {
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
            };

            return outData;
        };

        this.isNewPack = function(packs, packName)  {
            var isNew = false;

            StickerHelper.forEach(packs, function(pack) {

                if(pack.pack_name &&
                   pack.pack_name.toLowerCase() == packName.toLowerCase()) {

                   isNew = !!pack.newPack;
                }

            });

            return isNew;

        }

    };

    Plugin.StickersModule.BaseService = BaseService;

})(window,
   StickersModule.StickerHelper,
   StickersModule.Lockr
);