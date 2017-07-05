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
        SELECT MAX(score), MIN(score), 'day' period FROM last_day
            UNION
        SELECT MAX(score), MIN(score), 'week' period FROM last_week
            UNION
        SELECT MAX(score), MIN(score), 'month' period FROM last_month
            UNION
        SELECT MAX(score), MIN(score), 'year' period FROM last_year;
    `, (err, res) => {
        if (err) 
            return callback(err);

        callback(null, res.rows);
    });
};

// Create new user and return its id
exports.create = function(score, callback) {
    var db = DB.getDB();
    const result = [];

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