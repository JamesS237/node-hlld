var hlld = require('hlld');
var client = new hlld();
var assert = require('assert');
client.create(['hyperloglog'], function (err, okay) {
  assert(okay, true, 'everything is okay!');
  client.set([
    'hyperloglog',
    'redis'
  ], function (err, okay) {
    assert(okay, true, 'everything is okay!');
    client.list(['hyperloglog'], function (err, data) {
      assert.ok(data, 'everything is okay!');
      data.forEach(function (value, key) {
        console.log('key:', key, 'value:', value);
      });
    });
  });
});
