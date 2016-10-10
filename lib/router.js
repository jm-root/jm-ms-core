var jm = jm || {};
if (typeof module !== 'undefined' && module.exports) {
    jm = require('jm-core');
}

(function(){
    var ms = jm.ms || {};
    var ERR = jm.ERR;

    var cb_default = function(err, doc){};
    var slice = Array.prototype.slice;

    var Router = jm.TagObject.extend({
        _className: 'router',

        /**
         * 添加接口定义
         * @function Router#add
         * @param {Object} opts 参数
         * @example
         * opts参数:{
         *  sensitive: 是否大小写敏感(可选)
         *  strict: 是否检查末尾的分隔符(可选)
         * }
         * @param cb 回调cb(err,doc)
         * @returns {jm.ms}
         */
        ctor: function(opts) {
            var self = this;
            this._super();
            if(opts) this.attr(opts);
            this._routes = [];
            Object.defineProperty(this, 'routes', { value: this._routes, writable: false });

            // alias methods
            ms.utils.enableType(self, ['get', 'post', 'put', 'delete']);
        },

        /**
         * 添加接口定义
         * @function Router#_add
         * @param {Object} opts 参数
         * @example
         * opts参数:{
         *  uri: 接口路径(必填)
         *  type: 请求类型(可选)
         *  fn: 接口处理函数 function(opts, cb){}, 支持数组(必填)
         * }
         * @param cb 回调cb(err,doc)
         * @returns {Object}
         */
        _add: function(opts, cb) {
            opts = opts || {};
            var err = null;
            var doc = null;
            if(!opts.uri || !opts.fn){
                doc = ERR.FA_PARAMS;
                err = new Error(doc.msg);
                if(!cb) throw err;
            }else{
                this.emit('add', opts);
                var o = {};
                for(var key in opts) {
                    o[key] = opts[key];
                }
                if(o.mergeParams === undefined) o.mergeParams =  this.mergeParams;
                if(o.sensitive === undefined) o.sensitive =  this.sensitive;
                if(o.strict === undefined) o.strict =  this.strict;
                var route = ms.route(o);
                this._routes.push(route);
            }
            if(cb) cb(err, doc);
            return this;
        },

        /**
         * 添加接口定义
         * 支持多种参数格式, 例如
         * add({uri:uri, type:type, fn:fn}, cb)
         * add({uri:uri, type:type, fn:[fn1, fn2, ..., fnn]}, cb)
         * 可以没有回调函数cb
         * add({uri:uri, type:type, fn:fn})
         * add({uri:uri, type:type, fn:[fn1, fn2, ..., fnn]})
         * 以下用法不能包含cb
         * add(uri, fn)
         * add(uri, fn1, fn2, ..., fnn)
         * add(uri, [fn1, fn2, ..,fnn])
         * add(uri, type, fn)
         * add(uri, type, fn1, fn2, ..., fnn)
         * add(uri, type, [fn1, fn2, ..,fnn])
         * @function Router#add
         * @param {Object} opts 参数
         * @example
         * opts参数:{
         *  uri: 接口路径(必填)
         *  type: 请求类型(可选)
         *  fn: 接口处理函数 function(opts, cb){}, 支持数组(必填)
         * }
         * @param cb 回调cb(err,doc)
         * @returns {Object}
         */
        add: function(opts, cb) {
            if(typeof opts === 'string') {
                opts = {
                    uri: opts
                };
                if(typeof cb === 'string') {
                    opts.type = cb;
                    if(Array.isArray(arguments[2])){
                        opts.fn = arguments[2];
                    }else{
                        opts.fn = slice.call(arguments, 2);
                    }
                }else if(Array.isArray(cb)) {
                    opts.fn = cb;
                }else {
                    opts.fn = slice.call(arguments, 1);
                }
                cb = null;
            }
            return this._add(opts, cb);
        },

        /**
         * 引用路由定义
         * @function Router#_use
         * @param {Object} opts 参数
         * @example
         * opts参数:{
         *  uri: 接口路径(可选)
         *  fn: 接口处理函数 router实例 或者 function(opts, cb){}(支持函数数组) 或者含有request或handle函数的对象(必填)
         * }
         * @param cb 回调cb(err,doc)
         * @returns {Object}
         */
        _use: function(opts, cb) {
            opts = opts || {};
            var err = null;
            var doc = null;
            if(opts && opts instanceof Router) {
                opts = {
                    fn: opts
                };
            }
            if(!opts.fn){
                doc = ERR.FA_PARAMS;
                err = new Error(doc.msg, doc.err);
                if(!cb) throw err;
            }else{
                this.emit('use', opts);
                opts.strict = false;
                opts.end = false;
                opts.uri = opts.uri || '/';
                if(opts.fn instanceof Router){
                    var router = opts.fn;
                    opts.router = router;
                    opts.fn = function(opts, cb, next) {
                        router.handle(opts, cb, next);
                    }
                } else if(typeof opts.fn === "object" ) {
                    var router = opts.fn;
                    if(router.request) {
                        opts.router = router;
                        opts.fn = function(opts, cb, next) {
                            router.request(opts, function(err, doc){
                                cb(err, doc);
                                next();
                            });
                        }
                    } else if(router.handle) {
                        opts.router = router;
                        opts.fn = function(opts, cb, next) {
                            router.handle(opts, cb, next);
                        }
                    }
                }
                return this._add(opts, cb);
            }
            if(cb) cb(err, doc);
            return this;
        },

        /**
         * 引用路由定义
         * 支持多种参数格式, 例如
         * use({uri:uri, fn:fn}, cb)
         * use({uri:uri, fn:[fn1, fn2, ..., fnn]}, cb)
         * use({uri:uri, fn:router}, cb)
         * use({uri:uri, fn:obj}, cb)
         * use(router, cb)
         * 可以没有回调函数cb
         * use({uri:uri, fn:fn})
         * use({uri:uri, fn:[fn1, fn2, ..., fnn]})
         * use({uri:uri, fn:router})
         * use({uri:uri, fn:obj})
         * use(router)
         * 以下用法不能包含cb
         * use(uri, fn)
         * use(uri, fn1, fn2, ..., fnn)
         * use(uri, [fn1, fn2, ..,fnn])
         * use(uri, router)
         * use(uri, obj)
         * use(uri, fn)
         * use(fn1, fn2, ..., fnn)
         * use([fn1, fn2, ..,fnn])
         * @function Router#use
         * @param {Object} opts 参数
         * @example
         * opts参数:{
         *  uri: 接口路径(可选)
         *  fn: 接口处理函数 router实例 或者 function(opts, cb){}(必填)
         * }
         * @param cb 回调cb(err,doc)
         * @returns {Object}
         */
        use: function(opts, cb) {
            if(typeof opts === 'string') {
                opts = {
                    uri: opts
                };
                if (typeof cb === 'object') {   //object 或者 数组
                    opts.fn = cb;
                } else {
                    opts.fn = slice.call(arguments, 1);
                }
                cb = null;
            }else if(typeof opts === 'function') {
                opts = {
                    fn: slice.call(arguments, 0)
                };
                cb = null;
            }else if(Array.isArray(opts)) {
                opts = {
                    fn: opts
                };
                cb = null;
            }

            return this._use(opts, cb);
        },

        /**
         * 请求
         * 支持多种参数格式, 例如
         * request({uri:uri, type:type, data:data, params:params, timeout:timeout}, cb)
         * request({uri:uri, type:type, data:data, params:params, timeout:timeout})
         * request(uri, type, data, params, timeout, cb)
         * request(uri, type, data, params, cb)
         * request(uri, type, data, cb)
         * request(uri, type, cb)
         * request(uri, cb)
         * request(uri, type, data, params, timeout)
         * request(uri, type, data, params)
         * request(uri, type, data)
         * request(uri, type)
         * request(uri)
         * request(uri, type, data, timeout, cb)
         * request(uri, type, timeout, cb)
         * request(uri, timeout, cb)
         * request(uri, type, data, timeout)
         * request(uri, type, timeout)
         * request(uri, timeout)
         * @function Router#request
         * @param {Object} opts 参数
         * @example
         * opts参数:{
         *  uri: 接口路径(必填)
         *  type: 请求类型(可选)
         *  data: 请求数据(可选)
         *  params: 请求参数(可选)
         *  timeout: 请求超时(可选, 单位毫秒, 默认0表示不检测超时)
         * }
         * @param cb 回调(可选)cb(err,doc)
         * @returns {Object}
         */
        request: function(opts, cb) {
            var r = ms.utils.preRequest.apply(this, arguments);
            return this.handle(r.opts, r.cb || cb_default);
        },

        handle: function handle(opts, cb, next) {
            if(!next){
                //is a request
                var _opts = opts;
                var _cb = cb;
                opts = {};
                for(var key in _opts) {
                    opts[key] =  _opts[key];
                }
                cb = function(err, doc){
                    if(cb.done) return;
                    cb.done = true;
                    _cb(err, doc);
                };
                next = function(){
                    cb(new Error(jm.ERR.FA_NOTFOUND.msg), jm.ERR.FA_NOTFOUND);
                };
            }

            var self = this;
            var idx = 0;
            var routes = self.routes;
            var parentParams = opts.params;
            var parentUri = opts.baseUri || '';
            var done = restore(next, opts, 'baseUri', 'params');
            opts.originalUri = opts.originalUri || opts.uri;
            var uri = opts.uri;
            _next();
            return self;
            function _next() {
                if(cb.done){
                    return done();
                }
                opts.baseUri = parentUri;
                opts.uri = uri;
                // no more matching layers
                if (idx >= routes.length) {
                    return done();
                }
                var match = false;
                var route;
                while (!match && idx < routes.length) {
                    route = routes[idx++];
                    if (!route) {
                        continue;
                    }
                    try {
                        match = route.match(opts.uri, opts.type);
                    } catch (err) {
                        return done(err);
                    }
                    if (!match) {
                        continue;
                    }
                }
                if (!match) {
                    return done();
                }
                opts.params = {};
                for(var key in parentParams){
                    opts.params[key] = parentParams[key];
                }
                for(var key in route.params){
                    opts.params[key] = route.params[key];
                }

                if(route.router){
                    opts.baseUri = parentUri + route.uri;
                    opts.uri = opts.uri.replace(route.uri, '');
                }
                route.handle(opts, cb, _next);
            }
            // restore obj props after function
            function restore(fn, obj) {
                var props = new Array(arguments.length - 2);
                var vals = new Array(arguments.length - 2);

                for (var i = 0; i < props.length; i++) {
                    props[i] = arguments[i + 2];
                    vals[i] = obj[props[i]];
                }

                return function(err){
                    // restore vals
                    for (var i = 0; i < props.length; i++) {
                        obj[props[i]] = vals[i];
                    }

                    if(fn) fn.apply(this, arguments);
                    return self;
                };
            }
        }
    });

    ms.Router = Router;
    ms.router = function(opts) {
        return new Router(opts);
    };

})();
