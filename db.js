var pg = require('pg');

var state = {
  db: null
};

exports.connect = function(url, done) {
  if (state.db) return done();
  // console.log('connect to url '+url);

  var pool = new pg.Pool({
    connectionString: url
  });
  pool.connect(function(err, db) {
    // if (err) return done(err);
    if (err) return done({success: false});
    
    state.db = db;
    done();
  });
};

exports.getDB = function() {
  return state.db;
};

exports.close = function(done) {
  if (state.db) {
    state.db.end();
    state.db = null;
    state.mode = null;
    done(err);
  }
};