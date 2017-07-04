var ObjectID = require('mongodb').ObjectID;

exports.ObjectID = function(id) {
    if(!id)
        return new ObjectID();
    else
        return new ObjectID(id);
};
