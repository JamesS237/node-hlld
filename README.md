node-hlld
=========

A node.js client for https://github.com/armon/hlld

## Installation

`npm install hlld`

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
            assert.ok(data, 'everything is okay!');
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

## TODO
- Connection Pool
- Benchmark
- Client-side hash
- Bulk operations when possible
- Maintain a set of open connections to the server
- Better API documentation and test coverage
- Add more TODOs :wink:

## Licence
MIT
