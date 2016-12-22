var jm = jm || {};
if (typeof module !== 'undefined' && module.exports) {
    jm = require('jm-core');
}

/**
 * ms对象
 * @class  ms
 */
(function(){
    if(jm.ms) return;
    jm.ms = function(opts){
        var router = jm.ms.router(opts);
        return router;
    };

    /**
     * 创建一个代理路由
     * 支持多种参数格式, 例如
     * proxy({uri:uri}, cb)
     * proxy(uri, cb)
     * 可以没有回调函数cb
     * proxy({uri:uri})
     * proxy(uri)
     * @function ms#proxy
     * @param {Object} opts 参数
     * @example
     * opts参数:{
         *  uri: 目标uri(必填)
         * }
     * @param cb 回调cb(err,doc)
     * @returns {Router}
     */
    jm.ms.proxy = function(opts, cb){
        opts || ( opts = {} );
        var err = null;
        var doc = null;
        if(typeof opts === 'string') {
            opts = {uri:opts};
        }
        if(!opts.uri){
            doc = ERR.FA_PARAMS;
            err = new Error(doc.msg, doc.err);
            if (!cb) throw err;
        }
        var router = jm.ms();
        jm.ms.client(opts, function(err, client){
            if(err) return cb(err, client);
            router.use(function(opts, cb) {
                client.request(opts, cb);
            });
            router.client = client;
            if(cb) cb(null, router);
        });
        return router;
    };

})();
