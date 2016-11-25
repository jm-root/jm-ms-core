var jm = jm || {};
if ((typeof exports !== 'undefined' && typeof module !== 'undefined')) {
    jm = require('jm-core');
}

(function () {
    if(jm.ms.utils) return;
    var slice = Array.prototype.slice;
    var ms = jm.ms;

    /**
     * utils对象
     * @class  utils
     */
    ms.utils = {

        formatJSON: function (o) {
            return JSON.stringify(o, null, 2);
        },

        getUriProtocol: function (uri) {
            if (!uri) return null;
            return uri.substring(0, uri.indexOf(':'));
        },

        getUriPath: function (uri) {
            var idx = uri.indexOf('//');
            if(idx == -1) return '';
            var idx = uri.indexOf('/', idx + 2);
            if(idx == -1) return '';
            uri = uri.substr(idx);
            idx = uri.indexOf('#');
            if(idx == -1) idx = uri.indexOf('?');
            if(idx != -1) uri = uri.substr(0, idx);
            return uri;
        },

        enableType: function(obj, types) {
            if(!Array.isArray(types)){
                types = [types];
            }
            types.forEach(function(type) {
                obj[type] = function(opts, cb) {
                    if(typeof opts === 'string') {
                        var args = Array.prototype.slice.call(arguments, 0);
                        args.splice(1, 0, type);
                        return obj.request.apply(obj, args);
                    }
                    opts.type = type;
                    return obj.request(opts, cb);
                };
            });
        },

        preRequest: function(opts, cb) {
            if(typeof opts === 'string') {
                var numargs = arguments.length;
                var args = slice.call(arguments, 0);
                cb = null;
                if(typeof args[numargs - 1] === 'function'){
                    cb = args[numargs - 1];
                    numargs--;
                }
                opts = {
                    uri: opts
                };
                if(typeof args[numargs - 1] === 'number'){
                    opts.timeout = args[numargs - 1];
                    numargs--;
                }
                var i = 1;
                if(i<numargs && args[i]){
                    opts.type = args[i];
                }
                i++;
                if(i<numargs && args[i]){
                    opts.data = args[i];
                }
                i++;
                if(i<numargs && args[i]){
                    opts.params = args[i];
                }
            }

            return {
                opts: opts,
                cb: cb
            };
        }
    };
})();
