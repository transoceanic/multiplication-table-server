var DB = require('../../db');
var Utils = require('../../utils');
var COLLECTION = 'training-exchange';

// Clear after week
exports.clear = function(callback) {
    var db = DB.getDB();
    var afterWeek = new Date().getTime() - 7*24*60*60*1000;
	db.collection(COLLECTION)
        .deleteMany({'createDate':{$lt:afterWeek}}, function(err, result) {
            if (err)
                return callback(err);

            callback(null, {deletedCount: result.deletedCount});
        });
};

exports.getById = function(id, callback) {
    var db = DB.getDB();
    db.collection(COLLECTION)
        .findOne({'_id': Utils.ObjectID(id)}, callback);
};

// Create new user and return its id
exports.create = function(training, callback) {
    var db = DB.getDB();
    var now = new Date().getTime();
    training.createDate = now;
    db.collection(COLLECTION).insertOne(training, function(err, result) {
        if (err)
            return callback(err);

        callback(null, {
	        _id: result.insertedId.toHexString(),
            createDate: now
        });
    });
};

exports.update = function(id, training, callback) {
    var db = DB.getDB();
    training._id = Utils.ObjectID(id);
    db.collection(COLLECTION).updateOne({'_id': Utils.ObjectID(id)}, training, function(err, result) {
        if (err)
            return callback(err);

        var retObj = {_id: null};
        if(result.modifiedCount > 0)
            retObj._id = id;

        // callback(null, training);
        callback(null, retObj);
    });
};

exports.remove = function(id, callback) {
    db = DB.getDB();
    db.collection(COLLECTION).deleteOne({_id: Utils.ObjectID(id)}, function(err, result) {
        callback(err);
    });
};