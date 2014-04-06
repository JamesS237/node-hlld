node-hlld
=========

A node.js client for https://github.com/armon/hlld

## Usage

```javascript
var hlld = require('hlld');
var client = new hlld();
var assert = require('assert')

client.create(['hyperloglog'], function(err, okay) {
    assert(okay, true, 'everything is okay!');
    client.set(['hyperloglog', 'redis'], function(err, okay) {
        assert(okay, true, 'everything is okay!');
        client.list(['hyperloglog'], function(err, data) {
            assert.ok(data, 'everything is okay!s');
            data.forEach(function(value, key) {
                console.log('key:', key, 'value:', value);
            });
        });
    });
});
```

## API

### `hlld()`
    Returns a new hlld instance.
#### `hlld().x`
    Calls hlld method `x`

## Licence
MIT
