'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _jmUtils = require('jm-utils');

var _jmUtils2 = _interopRequireDefault(_jmUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var utils = _jmUtils2.default.utils;

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
  // uri为对象时直接返回
  if (typeof uri !== 'string') {
    return {
      opts: uri,
      cb: type
    };
  }

  var opts = {
    uri: uri
  };

  var r = {
    opts: opts

    // 第2个参数可能为空，cb，timeout, data
  };if (type === undefined) {
    return r;
  }
  if (typeof type === 'function') {
    r.cb = type;
    return r;
  }
  if (typeof type === 'number') {
    return utils.preRequest(uri, null, null, null, type, data);
  } else if (type && (typeof type === 'undefined' ? 'undefined' : _typeof(type)) === 'object') {
    return utils.preRequest(uri, null, type, data, params, timeout);
  } else if (typeof type === 'string') {
    opts.type = type;
  }

  // 第3个参数可能为空，cb，timeout, data
  if (data === undefined) {
    return r;
  }
  if (typeof data === 'function') {
    r.cb = data;
    return r;
  }
  if (typeof data === 'number') {
    return utils.preRequest(uri, type, null, null, data, params);
  } else if (data && (typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object') {
    opts.data = data;
  }

  // 第4个参数可能为空，cb，timeout, params
  if (params === undefined) {
    return r;
  }
  if (typeof params === 'function') {
    r.cb = params;
    return r;
  }
  if (typeof params === 'number') {
    return utils.preRequest(uri, type, data, null, params, timeout);
  } else if (params && (typeof params === 'undefined' ? 'undefined' : _typeof(params)) === 'object') {
    opts.params = params;
  }

  // 第5个参数可能为空，cb，timeout
  if (timeout === undefined) {
    return r;
  }
  if (typeof timeout === 'function') {
    r.cb = timeout;
    return r;
  }
  if (typeof timeout === 'number') {
    opts.timeout = timeout;
  }

  // 第6个参数可能为空，cb
  if (cb === undefined) {
    return r;
  }
  if (typeof cb === 'function') {
    r.cb = cb;
    return r;
  }

  return r;
};

exports.default = utils;
module.exports = exports['default'];