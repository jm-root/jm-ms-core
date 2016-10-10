var jm = jm || {};
if (typeof module !== 'undefined' && module.exports) {
    jm = require('jm-core');
}

(function(){
    var ms = jm.ms || {};
    var ERR = jm.ERR;
    var pathToRegexp = ms.pathToRegexp;

    /**
     * Route
     * @param {Object} opts 参数
     * @example
     * opts参数:{
         *  uri: 接口路径(必填)
         *  type: 请求类型(可选)
         *  fn: 接口处理函数 function(opts, cb, next){}(必填)
         * }
     * @param cb 回调cb(err,doc)
     * @returns {Object}
     */
    var Route = jm.TagObject.extend({
        _className: 'route',

        ctor: function(opts) {
            this._super();
            if(opts) this.attr(opts);
            this._fns = [];
            Object.defineProperty(this, 'fns', { value: this._fns, writable: false });
            this.uri = this.uri || '/';
            this.keys = [];
            this.regexp = pathToRegexp(this.uri, this.keys, opts);
            if (this.uri === '/' && opts.end === false) {
                this.regexp.fast_slash = true;
            }
            if(this.type == undefined) {
                this.allType = true;
            }
            var fns = opts.fn;
            if(!Array.isArray(fns)){
                fns = [fns];
            }
            for (var i = 0; i < fns.length; i++) {
                var fn = fns[i];
                if (typeof fn !== 'function') {
                    var type = toString.call(fn);
                    var msg = 'requires callback functions but got a ' + type;
                    throw new TypeError(msg);
                }
                this._fns.push(fn);
            }
        },

        /**
         * dispatch opts, cb into this route
         * @private
         */
        handle: function dispatch(opts, cb, next) {
            var idx = 0;
            var fns = this.fns;
            if (fns.length === 0) {
                return next();
            }
            _next();
            function _next(err, doc) {
                if (err) {
                    if(err === 'route')
                        return next();
                    else
                        return cb(err, doc);
                }
                var fn = fns[idx++];
                if (!fn) {
                    return next(err);
                }
                try {
                    fn(opts, cb, _next);
                } catch (err) {
                    _next(err);
                }
            }
        },

        /**
         * Check if this route matches `uri`, if so
         * populate `.params`.
         *
         * @param {String} uri
         * @return {Boolean}
         * @api private
         */

        match: function match(uri, type) {
            if(type){
                type = type.toLowerCase();
            }
            if (type != this.type && !this.allType) {
                return false;
            }
            if (uri == null) {
                // no uri, nothing matches
                this.params = undefined;
                this.uri = undefined;
                return false;
            }

            if (this.regexp.fast_slash) {
                // fast uri non-ending match for / (everything matches)
                this.params = {};
                this.uri = '';
                return true;
            }

            var m = this.regexp.exec(uri);

            if (!m) {
                this.params = undefined;
                this.uri = undefined;
                return false;
            }

            // store values
            this.params = {};
            this.uri = m[0];

            var keys = this.keys;
            var params = this.params;

            for (var i = 1; i < m.length; i++) {
                var key = keys[i - 1];
                var prop = key.name;
                params[prop] = m[i];
            }

            return true;
        }

    });

    ms.Route = Route;
    ms.route = function(opts) {
        return new Route(opts);
    };

})();
