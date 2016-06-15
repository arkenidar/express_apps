var config = require('./config.json');
var express = require('express');
var pg = require('pg');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);

var DATABASE_URL = process.env.DATABASE_URL || config.DATABASE_URL;
var REDIS_URL = process.env.REDISTOGO_URL || config.REDISTOGO_URL;

var app = express();
app.set('port', (process.env.PORT || config.PORT));
app.use(express.static(__dirname + '/public'));
// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(session({
  store: new RedisStore({url: REDIS_URL}),
  secret: config.SESSION_SECRET,
  unset: 'destroy',
  proxy: true,
  saveUninitialized: false,
  resave: false,
}));

app.get('/', function(request, response) {
  response.redirect('/templates_ejs.html');
});

app.get('/db', function (request, response) {
  pg.connect(DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM items', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.json( {items: result.rows} ); }
    });
  });
})

app.get('/session_test', function(request, response) {
  if(!request.session.session_test)
    request.session.session_test = 0;
  var session_test = request.session.session_test;
  session_test += 1;
  session_test %= 10;
  request.session.session_test = session_test;
  response.json({session_test});
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
