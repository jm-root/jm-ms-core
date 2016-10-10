var jm = jm || {};
if (typeof module !== 'undefined' && module.exports) {
    jm = require('jm-core');
}

(function(){
    var ms = jm.ms || {};
    var ERR = jm.ERR;
    var registries = jm.root.registries;
    registries.ms = {
        server: {
            types: {

            }
        }
    };
    var regTypes = registries.ms.server.types;
    
    ms.registServerType = function(opts, cb) {
        opts = opts || {};
        var err = null;
        var doc = null;
        if(!opts.type || !opts.fn) {
            err = new Error('invalid params');
            doc = ERR.FA_PARAMS;
        }else{
            var type = opts.type.toLowerCase();
            regTypes[type] = {
                type: type,
                port: opts.port,
                fn: opts.fn
            };
        }
        if(cb) cb(err, doc);
        return this;
    },

    ms.unregistServerType = function(opts, cb) {
        opts = opts || {};
        var err = null;
        var doc = null;
        if(!opts.type) {
            err = new Error('invalid params');
            doc = ERR.FA_PARAMS;
        }else{
            var type = opts.type.toLowerCase();
            if(regTypes[type]){
                delete regTypes[type];
            }
        }
        if(cb) cb(err, doc);
        return this;
    },

    /**
     * 创建服务器
     * @function ms#server
     * @param {Object} opts 参数
     * @example
     * opts参数:{
     *  uri: 网址(可选)
     *  type: 类型(可选, 默认http)
     *  host: 主机(可选, 默认127.0.0.1)
     *  port: 端口(可选, 默认80, 根据type不同默认值也不同)
     * }
     * @param cb 回调cb(err,doc)
     * @returns {jm.ms}
     */
    ms.server = function(app, opts, cb) {
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
        if(!o) {
            err = new Error('invalid type');
            doc = ERR.ms.FA_INVALIDTYPE;
        } else {
            app.emit('server', opts);
            o.fn.call(app, opts, cb);
            return this;
        }
        if(cb) cb(err, doc);
        return this;
    };

})();
