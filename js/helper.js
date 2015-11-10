
(function(Plugin, Lockr, MD5) {
    Plugin.StickersModule = Plugin.StickersModule || {};


    Plugin.StickersModule.StickerHelper = {

        forEach: function(data, callback) {
            for (var x in data){
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

        ajaxGet: function(url, apikey, callback, header) {

            header = header || {};

            var xmlhttp;

            xmlhttp = new XMLHttpRequest();

            xmlhttp.onreadystatechange = function(){
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
                    callback(JSON.parse(xmlhttp.responseText));
                }
            };
            xmlhttp.open("GET", url, true);
            xmlhttp.setRequestHeader("Apikey", apikey);
            xmlhttp.setRequestHeader("Platform", "JS");

            this.forEach(header, function(value, name) {
                xmlhttp.setRequestHeader(name, value);
            });

            xmlhttp.send();
        },

        ajaxPost: function(url, apikey, data, callback, header) {
            var xmlhttp,
                uniqUserId = Lockr.get("uniqUserId");

            xmlhttp = new XMLHttpRequest();

            xmlhttp.onreadystatechange = function() {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    callback && callback(JSON.parse(xmlhttp.responseText));
                }
            };


            if(typeof uniqUserId == "undefined") {
                uniqUserId = + new Date();
                Lockr.set("uniqUserId", uniqUserId);
            }

            xmlhttp.open("POST", url, true);
            xmlhttp.setRequestHeader("Apikey", apikey);
            xmlhttp.setRequestHeader("Platform", "JS");
            xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xmlhttp.setRequestHeader("DeviceId", uniqUserId);

            this.forEach(header, function(value, name) {
                xmlhttp.setRequestHeader(name, value);
            });

            xmlhttp.send(JSON.stringify(data));
        },

        md5: function(string) {
            return MD5(string);
        }

    };

})(window, window.StickersModule.Lockr, window.StickersModule.MD5);
