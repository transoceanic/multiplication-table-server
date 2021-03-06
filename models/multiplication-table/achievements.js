var DB = require('../../db');
// var Utils = require('../../utils');
var LIMIT_TO_SAVE = parseInt(process.env.LIMIT_TO_SAVE || 500);
var LIMIT_TO_SHOW = parseInt(process.env.LIMIT_TO_SHOW || 100);
var TABLES = ['day', 'week', 'month', 'year', 'century'];

exports.getAll = function(times, callback) {
    var db = DB.getDB();

    let query = [];
    for (const table of TABLES) {
        query.push(`SELECT coalesce(MAX(score), 0) as max, coalesce(MIN(score), 0) as min, COUNT(*) count, 
                        '${table}' period FROM last_${times}_${table}`);
    }

    db.query(query.join(' UNION '), (err, res) => {
        if (err) 
            return callback(err);

        let map = {};
        for (const row of res.rows) {
            map[ row.period ] = {min: row.count < LIMIT_TO_SHOW ? 0 : row.min, max: row.max/*, count: row.count*/};
        }
        callback(null, map);
    });
};

exports.getScoreLists = function(times, period, callback) {
    var db = DB.getDB();

    db.query(`SELECT id, name, score, date
            FROM last_${times}_${period}
                WHERE date > CURRENT_TIMESTAMP - interval '1 ${period}'
                ORDER BY score DESC
                LIMIT ${LIMIT_TO_SHOW}`, (err, res) => {
        if (err) 
            return callback(err);

        // let map = {};
        // for (const row of res.rows) {
        //     map[ row.period ] = {min: row.min, max: row.max};
        // }
        // callback(null, map);
        callback(null, res.rows);
    });
};

// limit bounds of all tables 100 rows
exports.limitBounds = function(times, callback) {
    var db = DB.getDB();
    var counter = 0;

    for (const table of TABLES) {
        counter++;

        db.query(`DELETE FROM last_${times}_${table}
            WHERE id in (
                SELECT id
                FROM (
                    SELECT id, row_number() over(order by score desc) as rn
                    FROM last_${times}_${table}
                    ) last
                WHERE last.rn > ${LIMIT_TO_SAVE}
                OR date < CURRENT_TIMESTAMP - interval '1 ${table}'
            );`, 
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
exports.update = function(times, data, callback) {
    var db = DB.getDB();
    var counter = 0;
    var result = [];
// select id, name, score, row_number() over(order by score desc) from last_week;

    for (const table of TABLES) {
        counter++;

        db.query(`SELECT coalesce(MIN(score), 0) as min, count(*) as count,
                    exists(SELECT 1 FROM last_${times}_${table} WHERE id = $1),
                    (SELECT score FROM last_${times}_${table} WHERE id = $1) AS best
                FROM last_${times}_${table}`, 
        [(data.stat[table] || {}).id || null],
        (err, res) => {
            if (err) {
                counter--;
                if (counter === 0) {
                    callback(null, result);
                }
                return;
            }
            // console.log('check-1---------'+JSON.stringify(res));

            let min = res.rows[0].count < LIMIT_TO_SHOW ? 0 : res.rows[0].min;
            if (res.rows[0].exists
                    || res.rows[0].count < LIMIT_TO_SAVE
                    || min < data.score) {

                let query, params;
                if (res.rows[0].exists) {
                    // query = `UPDATE last_${times}_${table} SET name = $1, score = $2, score_last = $3, date = CURRENT_TIMESTAMP WHERE id = $4;`;
                    // params = [data.name, Math.max(data.score, res.rows[0].best), data.score, (data.stat[table] || {}).id || null];
                    if (data.score > res.rows[0].best) {
                        query = `UPDATE last_${times}_${table} SET name = $1, score = $2, score_last = $2, date = CURRENT_TIMESTAMP WHERE id = $3;`;
                        params = [data.name, data.score, (data.stat[table] || {}).id || null];
                    } else {
                        query = `UPDATE last_${times}_${table} SET name = $1, score = $2, score_last = $3 WHERE id = $4;`;
                        params = [data.name, res.rows[0].best, data.score, (data.stat[table] || {}).id || null];
                    }
                } else {
                    query = `INSERT INTO last_${times}_${table}(name, score, score_last, date) VALUES($1, $2, $2, CURRENT_TIMESTAMP) RETURNING id;`;
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

                    // console.log('check-success----------'+JSON.stringify(res));

                    if (res.command === 'UPDATE') {
                        if (res.rowCount > 0) {
                            result.push({
                                id: data.stat[table].id,
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


// get order
exports.getOrders = function(times, data, callback) {
    var db = DB.getDB();
    var newData = [];
    var counter = 0;
    // console.log('getOrders-input-data---------'+JSON.stringify(data));

    for (const table of data) {
        counter++;

        db.query(`SELECT rn FROM 
                        (SELECT id, row_number() over(order by score desc) AS rn FROM 
                            (SELECT id, CASE WHEN id = $1 THEN score_last ELSE score END AS score 
                                FROM last_${times}_${table.period}) AS t
                        ) AS last 
                    WHERE id = $1;`, 
        [table.id],
        (err, res) => {
            if (!err) {
                // console.log('getOrders-success---------'+JSON.stringify(res));
                var t = table;
                t.order = res.rows[0].rn;
                newData.push(t);
            }
            counter--;
            if (counter === 0) {
                callback(null, newData);
            }
        });
    }
};
