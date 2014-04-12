var net = require('net'), os = require('os'), EventEmitter = require('events').EventEmitter, util = require('util');
function hlld(port, host, eol) {
  if (!(this instanceof hlld)) {
    return new hlld(port, host, eol);
  }
  this.port = port || 4553;
  this.host = host || 'localhost';
  this.eol = eol || os.EOL;
}
util.inherits(hlld, EventEmitter);
hlld.prototype.serialize = function (cmd, args, cb) {
  if (!Array.isArray(args))
    return cb(new Error('args should be an array'));
  if (!(typeof cmd == 'string'))
    return cb(new Error('command should be a string'));
  cb(null, cmd + ' ' + args.join(' ') + this.eol);
};
hlld.prototype._run = function (cmd, args, cb) {
  var self = this;
  this.cmd = cmd;
  var socket = net.createConnection(this.port, this.host);
  socket.on('connect', function () {
    this.serialize(cmd, args, function (err, data) {
      if (err) {
        return cb(err);
      }
      socket.write(data);
      socket.on('data', function (chunk) {
        response_serialzier(this.cmd, chunk, function (err, data) {
          cb(err, data);
          return socket.end();
        }.bind(this));
      }.bind(this));
    }.bind(this));
  }.bind(this));
  socket.on('error', function (e) {
    return this.emit('error');
  }.bind(this));
};
hlld.prototype.close = function (cb) {
  this._socket.once('close', cb);
};
[
  'create',
  'list',
  'drop',
  'close',
  'clear',
  'set',
  's',
  'bulk',
  'b',
  'info',
  'flush'
].map(function (i) {
  hlld.prototype[i] = function (args, cb) {
    if ([
        'create',
        'drop',
        'close',
        'clear',
        'set',
        's',
        'bulk',
        'b',
        'info'
      ].indexOf(i) > -1 && args.length == 0)
      return cb(new Error('Command \'' + i + '\' must have more than one argument'), false);
    if (args instanceof Function) {
      cb = args;
      args = [];
    }
    this._run(i, args, cb);
  };
});
var response_serialzier = function (cmd, data, cb) {
  function command(i) {
    global.cmd = cmd;
    return cmd.indexOf(i) > -1;
  }
  if (data.toString('utf8').indexOf('Error') > -1 || data.toString('utf8').indexOf('Delete in progress') > -1) {
    //error!
    return cb(new Error(data.toString('utf8')));
  } else if (data.toString('utf8').indexOf('Done') > -1) {
    //std done
    return cb(null, true);
  } else if (command('list')) {
    //list command
    var a = data.toString('utf8').split('\n');
    var b = a.slice(1, a.length - 2);
    var out = [];
    b.forEach(function (i) {
      var s = i.split(' ');
      //string version
      out[s[0]] = [
        s[1],
        s[2],
        s[3],
        s[4]
      ].map(Number);
    });
    return cb(null, out);
  } else if (command('info')) {
    //info command
    var a = data.toString('utf8').split('\n');
    if (a[0] == 'Set does not exist') {
      return cb(new Error('Set does not exist'));
    }
    var b = a.slice(1, a.length - 2);
    var out = [];
    b.forEach(function (i) {
      var s = i.split(' ');
      //string version
      out[s[0]] = Number(s[1]);
    });
    return cb(null, out);
  } else {
    return cb(new Error('response "' + data.toString('utf8') + '" could not be serialized!'));
  }
};
Array.prototype.nthLast = function (n) {
  return this[this.length - (n + 1)];
};
module.exports = hlld;