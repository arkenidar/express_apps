
// REQUIRE

var config = require('./config.json');
var express = require('express');
var pg = require('pg');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var db = require('./db');

// CONSTANTS

var DATABASE_URL = process.env.DATABASE_URL || config.DATABASE_URL;
var REDIS_URL = process.env.REDISTOGO_URL || config.REDISTOGO_URL;

// PASSPORT

// Configure the local strategy for use by Passport.
//
// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.
passport.use(new Strategy(
  function(username, password, cb) {
    db.users.findByUsername(username, function(err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      if (user.password != password) { return cb(null, false); }
      return cb(null, user);
  });
}));

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  db.users.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

// EXPRESS

// Create a new Express application.
var app = express();

// SET

app.set('port', (process.env.PORT || config.PORT));

// Configure view engine to render EJS templates.
app.set('views', __dirname + '/views'); // template files directory
app.set('view engine', 'ejs');

// USE

app.use(express.static(__dirname + '/public'));

app.use(session({
  store: new RedisStore({url: REDIS_URL}),
  secret: config.SESSION_SECRET,
  unset: 'destroy',
  proxy: true,
  saveUninitialized: false,
  resave: false,
}));

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

// ROUTES

// Define routes.
app.get('/', function(req, res) {
  res.render('home', { user: req.user });
});

app.get('/login', function(req, res){
  res.render('login');
});
  
app.post('/login',
passport.authenticate('local', { failureRedirect: '/login' }),
function(req, res) {
  res.redirect('/');
});
  
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get('/profile', require('connect-ensure-login').ensureLoggedIn(),
function(req, res){
  res.render('profile', { user: req.user });
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

// LISTEN

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

