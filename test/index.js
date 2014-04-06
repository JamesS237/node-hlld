var assert = require('assert');
var noop = function(){};
var hlld = require('../');

it('should return an instance of hlld', function() {
  var h = new hlld();
  assert.equal(h.constructor, hlld, 'the hlld was not constructed by hlld');
});

describe('commands', function() {
  ["create", "drop", "close", "clear", "set", "bulk", "flush"].forEach(function(i) {
    describe(i, function() {
      it('should ' + i + ' a HyperLogLog', function() {
        var h = new hlld();
        var d = ['hyper'];
        if(i == 'set') {
          h.create(['hyper'], function(err, ok) {
            h[i](d, function(err, ok) {
              assert(err, null, 'error was not null');
              assert.ok(ok, 'response was not ok');
            });
          })
          d = ['hyper', 'test'];
        } else {
          h[i](d, function(err, ok) {
            assert(err, null, 'error was not null');
            assert.ok(ok, 'response was not ok');
          });
        }
        h.flush(noop);
      });
      if(['flush', 'list'].indexOf(i) > -1) {
        it('should throw an error when it has no arguments', function() {
          var h = new hlld();
          h[i]([], function(err, ok) {
            assert(err, 'error was null');
            assert.notEqual(ok, true, 'response was ok');
          });
          h.flush(noop);
        });
      }
    });
  });
  describe('info', function() {
    it('should give info in the correct format for a HyperLogLog', function(i) {
      var h = new hlld();
      h.info(['hyper'], function(e, data) {
        data.forEach(function(i, x) {
          assert.equal(x.constructor, String, 'key is a string');
          assert.equal(i.constructor, Number, 'value is a number');
        });
      });
      h.flush(noop);
    })
  });
  describe('list', function() {
    beforeEach(function(done) {
      var h = new hlld();
      h.create(['hyper'], function(e, o) {
        if(!e) {
          h.b(["hyper", "fi", "fi", "fo", "fum"], function() {
            done();
          });
        } else {
          done(e);
        }
      });
    });
    it('should give info in the correct format for a HyperLogLog', function(i) {
      var h = new hlld();
      h.info(['hyper'], function(e, data) {
        data.forEach(function(i, x) {
          assert.equal(x.constructor, String, 'key is a string');
          assert.equal(i.constructor, Array, 'value is an array');
          i.forEach(function(i) {
            assert.equal(i.constructor, Number, 'array contains only numbers')
          });
        });
      });
      h.flush(noop);
    })
  });
});
