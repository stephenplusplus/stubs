'use strict';

var assert = require('assert')
var stubs = require('./')
var tess = require('tess')

tess('init', function(it) {
  it('is a function', function() {
    assert.equal(typeof stubs, 'function')
  })

  it('throws without obj || method', function() {
    assert.throws(function() {
      stubs()
    }, /must provide/)

    assert.throws(function() {
      stubs({})
    }, /must provide/)
  })
})

tess('stubs', function(it) {
  it('stubs a method with a noop', function() {
    var originalCalled = false

    var obj = {}
    obj.method = function() {
      originalCalled = true
    }

    stubs(obj, 'method')

    obj.method()

    assert(!originalCalled)
  })

  it('accepts an override', function() {
    var originalCalled = false

    var obj = {}
    obj.method = function() {
      originalCalled = true
    }

    var replacementCalled = false
    stubs(obj, 'method', function() {
      replacementCalled = true
    })

    obj.method()
    assert(!originalCalled)
    assert(replacementCalled)
  })

  it('calls through to original method', function() {
    var originalCalled = false

    var obj = {}
    obj.method = function() {
      originalCalled = true
    }

    var replacementCalled = false
    stubs(obj, 'method', { callthrough: true }, function() {
      replacementCalled = true
    })

    obj.method()
    assert(originalCalled)
    assert(replacementCalled)
  })

  it('returns value of original method call', function() {
    var uniqueVal = Date.now()

    var obj = {}
    obj.method = function() {
      return uniqueVal
    }

    stubs(obj, 'method', { callthrough: true }, function() {})

    assert.equal(obj.method(), uniqueVal)
  })

  it('stops calling stub after n calls', function() {
    var timesToCall = 5
    var timesCalled = 0

    var obj = {}
    obj.method = function() {
      assert.equal(timesCalled, timesToCall)
    }

    stubs(obj, 'method', { calls: timesToCall }, function() {
      timesCalled++
    })

    obj.method() // 1 (stub)
    obj.method() // 2 (stub)
    obj.method() // 3 (stub)
    obj.method() // 4 (stub)
    obj.method() // 5 (stub)
    obj.method() // 6 (original)
  })

  it('calls stub in original context of obj', function() {
    var secret = 'brownies'

    function Class() {
      this.method = function() {}
      this.secret = secret
    }

    var cl = new Class()

    stubs(cl, 'method', function() {
      assert.equal(this.secret, secret)
    })

    cl.method()
  })
})
