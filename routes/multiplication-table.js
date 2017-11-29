var express = require('express');
var router  = express.Router();
var Achievements = require('../models/multiplication-table/achievements');
var LEGAL_INTERVAL = 10*60*1000; // 10 minutes
var VALID_TIMES = JSON.parse(process.env.VALID_TIMES); // ['10', '12', '20'];
var LIMIT_TO_SHOW = parseInt(process.env.LIMIT_TO_SHOW || 100);

function decrypt(text){
  var temp = parseInt(text, 16);
  return isNaN(temp) ? -1 : temp/1474;
}


router.get('/:times/A3XHE21UIW5esy4A8iYUKPol4V3h2irpJ5596ySK', function(req, res) {
    var times = req.params.times;
    if (VALID_TIMES.indexOf(times) > -1) {
        Achievements.getScoreLists(times, 'day', function(err, result) {
            if (!err) {
                if (result.length < LIMIT_TO_SHOW * 0.8) {
                    let fakeUsers = require('../models/multiplication-table/fake-names');
                    for (let i=0, name; i<Math.min(1, LIMIT_TO_SHOW - result.length); i++) {
                        name = fakeUsers.splice( parseInt(Math.random() * fakeUsers.length), 1)
                            .toString().split(' ');
                        name = name.splice(parseInt(Math.random() * name.length), 1) 
                            + [' ', '.', '-', ''][parseInt(Math.random() * 4)]
                            + [(name[0] || ''), (name[0] || '').toUpperCase(), (name[0] || '').toLowerCase()][parseInt(Math.random() * 3)]
                                .substring(0, [1, 100][parseInt(Math.random() * 2)])

                        setScore(times, {
                            name: name,
                            score: parseInt(50 + Math.random() * 200)
                        }, {
                            status: function(code) {
                                return {
                                    send: function() {}
                                };
                            },
                            send: function() {}
                        });
                    }
                }
                res.send({length: result.length});
            } else {
                res.status(500);
            }
        });
    }

    // res.send();
});


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
// router.post('/:times/score/update', function (req, res) {
//     var times = req.params.times;
//     if (VALID_TIMES.indexOf(times) === -1) {
//         return res.status(500).send({success: false});
//     }

//     var data = req.body;
//     // console.log('check input data------ '+JSON.stringify(data));

//     if (data.token) {
//         var sentDate = new Date(parseInt(decrypt(data.token))).getTime();
//         if (!isNaN(sentDate)) {
//             // console.log('decrypted '+sentDate);
//             var now = new Date().getTime();
//             if (Math.abs(now - sentDate) < LEGAL_INTERVAL) {
//                 // console.log('success '+Math.abs(now - sentDate));
//                 if (data.score > 0) {
//                     Achievements.limitBounds(times, function(err, result) {
//                         if (err) {
//                             // res.status(500).send(err);
//                             res.status(500).send({success: false});
//                         } else {
//                             setScore(times, data, res);
//                         }
//                     });
//                     return;
//                 }
//             }
//         }
//     }

//     res.sendStatus(500);
// });

// function setScore(times, data, res) {
//     data.stat = data.stat || {};
//     Achievements.update(times, data, function(err, result) {
//         if (err) {
//             // res.status(500).send(err);
//             res.status(500).send({success: false});
//         } else {
//             if (result.length > 0) {
//                 Achievements.limitBounds(times, function() {});

//                 Achievements.getOrders(times, result, function(err, result) {
//                     if (err) {
//                         // res.status(500).send(err);
//                         res.status(500).send({success: false});
//                     } else {
//                         if (result && result.length > 0) {
//                             // res.send(result && result.length > 0 ? result : null);
//                             let output = {};
//                             for (const table of result) {
//                                 output[table.period] = {
//                                     id: table.id,
//                                     order: table.order
//                                 };
//                             }
//                             res.send(output);
//                         } else {
//                             res.send();
//                         }
//                     }
//                 });
//             } else {
//                 res.send();
//             }
//         }
//     });
// }


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
                            setScore(times, data, res);
                        }
                    });
                    return;
                }
            }
        }
    }

    res.sendStatus(500);
});

function setScore(times, data, res) {
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
