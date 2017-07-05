var express = require('express');
var router  = express.Router();
var Achievements = require('../models/multiplication-table/achievements');

function decrypt(text){
  var temp = parseInt(text, 16);
  return isNaN(temp) ? -1 : temp/3;
}


router.get('/api/achievements', function(req, res) {
  Achievements.getAll(function(err, result) {
    if (err) {
        res.status(500).send(err);
    } else {
        res.send(result);
    }
  });
    // var db = DB.getDB();
    // db.query('SELECT id, name, score FROM LAST_DAY;')
    // .on('row', function(row) {
    //   console.log('----------row fetched '+JSON.stringify(row));
    // });

    // res.json({a:1, b:'a'});
});

// router.get('/api/sync/:id', function(req, res) {
//     var id = req.params.id;
//     Training.getById(id, function(err, training) {
//         if (err) {
//             res.status(500).send(err);
//         } else {
//             res.send(training || {_id: null});
//         }
//     });
// });

// // create
// router.post('/api/sync', function (req, res) {
//     var training = req.body;
//     if (training.token) {
//         // console.log('token '+training.token);
//         var sentDate = new Date(parseInt(decrypt(training.token))).getTime();
//         if (!isNaN(sentDate)) {
//             // console.log('decrypted '+sentDate);
//             var now = new Date().getTime();
//             if (Math.abs(now - sentDate) < LEGAL_INTERVAL) {
//                 // console.log('success'+Math.abs(now - sentDate));
//                 Training.create(training, function(err, retObj) {
//                     if (err) {
//                         res.status(500).send(err);
//                     } else {
//                         res.send(retObj);
//                     }
//                 });
//                 return;
//             }
//         }
//     }

//     res.sendStatus(500);
// });

// // update
// router.put('/api/sync/:id', function (req, res) {
//     // var v=new Date().getTime();
//     // console.log('encrypted '+encrypt(''+v)+' for '+v);
//     var training = req.body;
//     if (training.token) {
//         // console.log('token '+training.token);
//         var sentDate = new Date(parseInt(decrypt(training.token))).getTime();
//         if (!isNaN(sentDate)) {
//             // console.log('decrypted '+sentDate);
//             var now = new Date().getTime();
//             if (Math.abs(now - sentDate) < LEGAL_INTERVAL) {
//                 // console.log('success'+Math.abs(now - sentDate));
//                 var id = req.params.id;
//                 Training.update(id, training, function(err, retObj) {
//                     if (err) {
//                         res.status(500).send(err);
//                     } else {
//                         res.send(retObj);
//                     }
//                 });
//                 return;
//             }
//         }
//     }

//     res.sendStatus(500);
// });

// router.delete('/api/sync/:id', function(req, res) {
//     var id = req.params.id;

//     Training.remove(id, function(err) {
//         if (err) {
//             res.status(500).send(err);
//         } else {
//             res.send({});
//         }
//     });
// });

module.exports = router;
