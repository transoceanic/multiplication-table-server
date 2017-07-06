var DB = require('../../db');
// var Utils = require('../../utils');
var LIMIT = 10;
var TABLES = ['day', 'week', 'month', 'year', 'life'];

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

    let query = [];
    for (const table of TABLES) {
        query.push(`SELECT coalesce(MAX(score), 0) as max, coalesce(MIN(score), 0) as min, 
                        '${table}' period FROM last_${table}`);
    }

    db.query(query.join(' UNION '), (err, res) => {
        if (err) 
            return callback(err);

        let map = {};
        for (const row of res.rows) {
            map[ row.period ] = {min: row.min, max: row.max};
        }
        callback(null, map);
    });
};

// limit bounds of all tables 100 rows
exports.limitBounds = function(callback) {
    var db = DB.getDB();
    var counter = 0;

    for (const table of TABLES) {
        counter++;

        db.query(`DELETE FROM last_${table}
            WHERE id in (
                SELECT id
                FROM (
                    SELECT id, row_number() over(order by score desc) as rn
                    FROM last_${table}
                    ) last
                WHERE last.rn > ${LIMIT});`, 
        (err, res) => {
            // if (err) 
            //     return callback(err);
            counter--;
            if (counter === 0) {
                callback();
            }
        });
    }
};

// Check if score within 100 best scores
exports.check = function(data, callback) {
    var db = DB.getDB();
    var counter = 0;
    var result = [];
// select id, name, score, row_number() over(order by score desc) from last_week;

    for (const table of TABLES) {
        counter++;

        db.query(`SELECT coalesce(MIN(score), 0) as min, count(*) as count,
                    exists(SELECT 1 FROM last_${table} WHERE id = $1)
                FROM last_${table}`, 
        [data.stat[table] || null],
        (err, res) => {
            if (err) {
                counter--;
                if (counter === 0) {
                    callback(null, result);
                }
                return;
            }
            // console.log('check----------'+JSON.stringify(res));

            if (res.rows.length > 0 && 
                    ((res.rows[0].count < LIMIT && (!res.rows[0].exists || res.rows[0].min < data.score)) 
                        || res.rows[0].min < data.score)) {

                let query, params;
                if (res.rows[0].exists) {
                    query = `UPDATE last_${table} SET name = $1, score = $2, date = CURRENT_TIMESTAMP WHERE id = $3;`;
                    params = [data.name, data.score, data.stat[table] || null];
                } else {
                    query = `INSERT INTO last_${table}(name, score, date) VALUES($1, $2, CURRENT_TIMESTAMP) RETURNING id;`;
                    params = [data.name, data.score];
                }

                db.query(query, params,
                (err, res) => {
                    if (err) {
                        counter--;
                        if (counter === 0) {
                            callback(null, result);
                        }
                        return;
                    }

                    // console.log('success----------'+JSON.stringify(res));

                    if (res.command === 'UPDATE') {
                        if (res.rowCount > 0) {
                            result.push({
                                id: data.stat[table],
                                period: table
                            });
                        }
                    } else {
                        if (res.rows && res.rows.length > 0) {
                            let last = res.rows[0];
                            last.period = table;
                            result.push(last);
                        }
                    }

                    counter--;
                    if (counter === 0) {
                        callback(null, result);
                    }
                });

            } else {
                counter--;
            }

            if (counter === 0) {
                callback(null, result);
            }
        });
    }

};
