
var config = require('../config.json');
var pg = require('pg');
var DATABASE_URL = process.env.DATABASE_URL || config.DATABASE_URL;

exports.findById = function(id, cb) {
process.nextTick(function() {
  pg.connect(DATABASE_URL, function(err, client, done) {
  client.query('SELECT * FROM users WHERE id='+id, function(err, result) {
    done();
    if (err){
      console.error(err);
      cb(new Error("Error " + err));
    }else{
      if(result.rows.length===1){
        cb(null, result.rows[0]);
      }else{
        cb(new Error('User ' + id + ' does not exist'));
      }
    }  
  });
  });
});
};

exports.findByUsername = function(username, cb) {
process.nextTick(function() {
  
  pg.connect(DATABASE_URL, function(err, client, done) {
  client.query('SELECT * FROM users WHERE username=\''+username+'\'', function(err, result) {
    done();
    if (err){
      console.error(err);
      cb(null, null);
    }else{
      if(result.rows.length===1){
        cb(null, result.rows[0]);
      }else{
        cb(null, null);
      }
    }  
  });
  });
});
};
