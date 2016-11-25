var jm = jm || {};
if ((typeof exports !== 'undefined' && typeof module !== 'undefined')) {
    jm = require('jm-core');
}

(function () {
    if(jm.ms.client) return;
    var ms = jm.ms;
    var ERR = jm.ERR;
    var registries = jm.root.registries;
    registries.ms = {
        client: {
            types: {}
        }
    };
    var regTypes = registries.ms.client.types;

    ms.registClientType = function (opts, cb) {
        opts = opts || {};
        var err = null;
        var doc = null;
        if (!opts.type || !opts.fn) {
            err = new Error('invalid params');
            doc = ERR.FA_PARAMS;
        } else {
            var type = opts.type.toLowerCase();
            regTypes[type] = {
                type: type,
                port: opts.port,
                fn: opts.fn
            };
        }
        if (cb) cb(err, doc);
        return this;
    },

    ms.unregistClientType = function (opts, cb) {
        opts = opts || {};
        var err = null;
        var doc = null;
        if (!opts.type) {
            err = new Error('invalid params');
            doc = ERR.FA_PARAMS;
        } else {
            var type = opts.type.toLowerCase();
            if (regTypes[type]) {
                delete regTypes[type];
            }
        }
        if (cb) cb(err, doc);
        return this;
    },

    /**
     * 创建客户端
     * @function ms#client
     * @param {Object} opts 参数
     * @example
     * opts参数:{
     *  type: 类型(可选, 默认http)
     *  uri: uri(可选, 默认http://127.0.0.1)
     *  timeout: 请求超时(可选, 单位毫秒, 默认0表示不检测超时)
     * }
     * @param cb 回调cb(err,doc)
     * @returns {jm.ms}
     */
    ms.client = function (opts, cb) {
        opts = opts || {};
        var err = null;
        var doc = null;
        var type = null;
        if(opts.uri){
            type = ms.utils.getUriProtocol(opts.uri);
        }
        type = opts.type || type || 'http';
        type = type.toLowerCase();
        var o = regTypes[type];
        if (!o) {
            err = new Error('invalid type');
            doc = ERR.ms.FA_INVALIDTYPE;
        } else {
            o.fn.call(this, opts, function(err, doc){
                ms.utils.enableType(doc, ['get', 'post', 'put', 'delete']);
                cb(err, doc);
            });
            return this;
        }
        if (cb) cb(err, doc);
        return this;
    };

})();
