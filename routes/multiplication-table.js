var express = require('express');
var router  = express.Router();
var Achievements = require('../models/multiplication-table/achievements');
var LEGAL_INTERVAL = 10*60*1000; // 10 minutes
var VALID_TIMES = process.env.VALID_TIMES; // ['10', '12', '20'];

function decrypt(text){
  var temp = parseInt(text, 16);
  return isNaN(temp) ? -1 : temp/1474;
}


router.get('/:times/score/best', function(req, res) {
  var times = req.params.times;
  if (VALID_TIMES.indexOf(times) > -1) {
    Achievements.getAll(times, function(err, result) {
        if (err) {
            // res.status(500).send(err);
            res.status(500).send({success: false});
        } else {
            res.send(result);
        }
    });
  } else {
    res.status(500).send({success: false});
  }
});

router.get('/:times/score/list/:period', function(req, res) {
  var times = req.params.times;
  if (VALID_TIMES.indexOf(times) > -1) {
    var period = req.params.period;
    Achievements.getScoreLists(times, period, function(err, result) {
        if (err) {
            // res.status(500).send(err);
            res.status(500).send({success: false});
        } else {
            res.send(result);
        }
    });
  } else {
    res.status(500).send({success: false});
  }
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

// save achievements
router.post('/:times/score/update', function (req, res) {
    var times = req.params.times;
    if (VALID_TIMES.indexOf(times) === -1) {
        return res.status(500).send({success: false});
    }

    var data = req.body;
    // console.log('check input data------ '+JSON.stringify(data));

    if (data.token) {
        var sentDate = new Date(parseInt(decrypt(data.token))).getTime();
        if (!isNaN(sentDate)) {
            // console.log('decrypted '+sentDate);
            var now = new Date().getTime();
            if (Math.abs(now - sentDate) < LEGAL_INTERVAL) {
                // console.log('success '+Math.abs(now - sentDate));
                if (data.score > 0) {
                    Achievements.limitBounds(times, function(err, result) {
                        if (err) {
                            // res.status(500).send(err);
                            res.status(500).send({success: false});
                        } else {
                            data.stat = data.stat || {};
                            Achievements.update(times, data, function(err, result) {
                                if (err) {
                                    // res.status(500).send(err);
                                    res.status(500).send({success: false});
                                } else {
                                    if (result.length > 0) {
                                        Achievements.limitBounds(times, function() {});

                                        Achievements.getOrders(times, result, function(err, result) {
                                            if (err) {
                                                // res.status(500).send(err);
                                                res.status(500).send({success: false});
                                            } else {
                                                if (result && result.length > 0) {
                                                    // res.send(result && result.length > 0 ? result : null);
                                                    let output = {};
                                                    for (const table of result) {
                                                        output[table.period] = {
                                                            id: table.id,
                                                            order: table.order
                                                        };
                                                    }
                                                    res.send(output);
                                                } else {
                                                    res.send();
                                                }
                                            }
                                        });
                                    } else {
                                        res.send();
                                    }
                               }
                            });
                        }
                    });
                    return;
                }
            }
        }
    }

    res.sendStatus(500);
});

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
