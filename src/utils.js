import util from 'jm-utils';

let utils = util.utils;
let slice = Array.prototype.slice;

utils.enableType = function (obj, types) {
    if (!Array.isArray(types)) {
        types = [types];
    }
    types.forEach(function (type) {
        obj[type] = function (uri, data, params, timeout, cb) {
            if (typeof uri === 'string') {
                return obj.request(uri, type, data, params, timeout, cb);
            }
            uri.type = type;
            return obj.request(uri, data);
        };
    });
};

utils.preRequest = function (uri, type, data, params, timeout, cb) {
    //uri为对象时直接返回
    if (typeof uri !== 'string') {
        return {
            opts: uri,
            cb: type
        };
    }

    let opts = {
        uri: uri
    };

    let r = {
        opts: opts
    };

    //第2个参数可能为空，cb，timeout
    if(type === undefined) {
        return r;
    }
    if (typeof type === 'function') {
        r.cb = type;
        return r;
    }
    if (typeof type === 'number') {
        opts.timeout = type;
    } else {
        opts.type = type;
    }

    //第3个参数可能为空，cb，timeout, data
    if(data === undefined) {
        return r;
    }
    if (typeof data === 'function') {
        r.cb = data;
        return r;
    }
    if (typeof data === 'number') {
        opts.timeout = data;
    } else if (typeof data === 'object') {
        opts.data = data;
    }

    //第4个参数可能为空，cb，timeout, params
    if(params === undefined) {
        return r;
    }
    if (typeof params === 'function') {
        r.cb = params;
        return r;
    }
    if (typeof params === 'number') {
        opts.timeout = params;
    } else if (typeof params === 'object') {
        opts.params = params;
    }

    //第5个参数可能为空，cb，timeout
    if(timeout === undefined) {
        return r;
    }
    if (typeof timeout === 'function') {
        r.cb = timeout;
        return r;
    }
    if (typeof timeout === 'number') {
        opts.timeout = timeout;
    }

    //第6个参数可能为空，cb
    if(cb === undefined) {
        return r;
    }
    if (typeof cb === 'function') {
        r.cb = cb;
        return r;
    }

    return r;
};

export default utils;
