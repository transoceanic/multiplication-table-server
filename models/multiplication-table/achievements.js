var DB = require('../../db');
// var Utils = require('../../utils');
// var COLLECTION = 'training-exchange';

// Clear after week
// exports.clear = function(callback) {
//     var db = DB.getDB();
//     var afterWeek = new Date().getTime() - 7*24*60*60*1000;
// 	db.collection(COLLECTION)
//         .deleteMany({'createDate':{$lt:afterWeek}}, function(err, result) {
//             if (err)
//                 return callback(err);

//             callback(null, {deletedCount: result.deletedCount});
//         });
// };

exports.getAll = function(callback) {
    var db = DB.getDB();
    const result = [];

    db.query(`
        SELECT coalesce(MAX(score), 0) as max, coalesce(MIN(score), 0) as min, 'day' period FROM last_day
            UNION
        SELECT coalesce(MAX(score), 0) as max, coalesce(MIN(score), 0) as min, 'week' period FROM last_week
            UNION
        SELECT coalesce(MAX(score), 0) as max, coalesce(MIN(score), 0) as min, 'month' period FROM last_month
            UNION
        SELECT coalesce(MAX(score), 0) as max, coalesce(MIN(score), 0) as min, 'year' period FROM last_year
            UNION
        SELECT coalesce(MAX(score), 0) as max, coalesce(MIN(score), 0) as min, 'life' period FROM last_life;
    `, (err, res) => {
        if (err) 
            return callback(err);

        var map = {};
        for (const row of res.rows) {
            map[ row.period ] = {min: row.min, max: row.max};
        }
        callback(null, map);
    });
};

// Create new user and return its id
exports.create = function(score, callback) {
    var db = DB.getDB();
    const result = [];
// select id, name, score, row_number() over(order by score desc) from last_week;

    db.query(`INSERT INTO last_week(name, score, date) VALUES($1, $2, CURRENT_TIMESTAMP) RETURNING id;`,
    [score.name, score.score],
    (err, res) => {
        if (err) 
            return callback(err);

        callback(null, res.rows[0]);
    });
};

// exports.update = function(id, training, callback) {
//     var db = DB.getDB();
//     training._id = Utils.ObjectID(id);
//     db.collection(COLLECTION).updateOne({'_id': Utils.ObjectID(id)}, training, function(err, result) {
//         if (err)
//             return callback(err);

//         var retObj = {_id: null};
//         if(result.modifiedCount > 0)
//             retObj._id = id;

//         // callback(null, training);
//         callback(null, retObj);
//     });
// };

// exports.remove = function(id, callback) {
//     db = DB.getDB();
//     db.collection(COLLECTION).deleteOne({_id: Utils.ObjectID(id)}, function(err, result) {
//         callback(err);
//     });
// };