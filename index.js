'use strict';

module.exports = function stubs(obj, method, cfg, stub) {
  if (!obj || !method) {
    throw new Error('To stub a method, you must provide an object and a key for a method')
  }

  if (!stub) {
    stub = cfg
    cfg = {}
  }

  stub = stub || function() {}

  cfg.callthrough = cfg.callthrough || false
  cfg.calls = cfg.calls || 0

  var norevert = cfg.calls === 0

  var cached = obj[method].bind(obj)

  obj[method] = function() {
    var args = [].slice.call(arguments)

    if (cfg.callthrough && cached)
      cached.apply(obj, arguments)

    stub.apply(obj, arguments)

    if (!norevert && --cfg.calls === 0)
      obj[method] = cached
  }
}
