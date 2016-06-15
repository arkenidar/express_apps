
var config = require('../config.json');
var pg = require('pg');
var DATABASE_URL = process.env.DATABASE_URL || config.DATABASE_URL;

var records = [
    { id: 1, username: 'jack', password: 'secret', displayName: 'Jack', email: 'jack@example.com' }
  , { id: 2, username: 'jill', password: 'birthday', displayName: 'Jill', email: 'jill@example.com' }
];

exports.findById = function(id, cb) {
  process.nextTick(function() {
    var idx = id - 1;
    if (records[idx]) {
      cb(null, records[idx]);
    } else {
      cb(new Error('User ' + id + ' does not exist'));
    }
    
    /*
    pg.connect(DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM items', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.json( {items: result.rows} ); }
    });
    */
    
  });
}

exports.findByUsername = function(username, cb) {
  process.nextTick(function() {
    for (var i = 0, len = records.length; i < len; i++) {
      var record = records[i];
      if (record.username === username) {
        return cb(null, record);
      }
    }
    return cb(null, null);
  });
}
