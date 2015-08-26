
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
