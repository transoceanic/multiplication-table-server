var pg = require('pg');

var state = {
  db: null
};

exports.connect = function(url, done) {
  if (state.db) return done();
  console.log('connect to url '+url);

  var pool = new pg.Pool({
    connectionString: url
  });
  pool.connect(function(err, db) {
	  console.log("----------------pool.connect");
    if (err) return done(err);
	  console.log("----------------pool.connect success");
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