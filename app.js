var VALID_TIMES = process.env.VALID_TIMES; // ['10', '12', '20'];
var VALID_LANGUAGES = process.env.VALID_LANGUAGES; // ['en', 'il'];

var express = require('express');
var path = require('path');
// var favicon = require('serve-favicon');
// var logger = require('morgan');
// var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var multiplicationTable = require('./routes/multiplication-table');

var app = express();

app.use(express.static(path.join(__dirname, 'public')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));

// app.use(logger('dev'));
app.use(bodyParser.json({limit: '200kb'}));
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

app.use('/multiplication-table', multiplicationTable);



// Landing
app.get('/game/:gameType/:language', function(req, res) {
    let gameType = req.params.gameType;
    let language = req.params.language;
    if (VALID_TIMES.indexOf(gameType) > -1 && VALID_LANGUAGES.indexOf(language) > -1) {
        let render = require('./localization/' + language);
        render.gameType = gameType;
        res.render('landing/index', render);
    } else {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    }
});

// Landing
app.get('/policy/:gameType', function(req, res) {
    let gameType = req.params.gameType;
    if (VALID_TIMES.indexOf(gameType) > -1) {
        res.render('landing/privacypolicy', {
            appName: ['Multiplication Table 10x10',
                    'Times Tables 12x12',
                    'Multiplication Table 20x20'][VALID_TIMES.indexOf(gameType)],
            owner: 'Andrey Feldman',
            ownerEmail: 'multiplication.times.tables@gmail.com'
        });
    } else {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    }
});

// var SparkPost = require('sparkpost');
// var sparky = new SparkPost();
// app.post('/contact/:gameType/:language', function(request, response) {
//     let gameType = req.params.gameType;
//     let language = req.params.language;
//     if (['10', '12', '20'].indexOf(gameType) > -1 && ['en', 'il'].indexOf(language) > -1) {
//         sendMail(response, {
//             to: 'multiplication.times.tables@gmail.com',
//             email: request.body.email || '--',
//             name: request.body.name || '--',
//             message: request.body.message
//         });
//     }
// });

// function sendMail(response, data) {
// 	sparky.transmissions.send({
//     options: {
//       sandbox: true
//     },
//     content: {
//       from: 'testing@' + process.env.SPARKPOST_SANDBOX_DOMAIN, // 'testing@sparkpostbox.com'
//       subject: 'Contact Form From Landing Page: ' + data.email,
//       html:'<html><body>"'+data.name+'" '+data.email+'<p>' + data.message + '</p></body></html>'
//     },
//     recipients: [
//       {address: data.to}
//     ]
//   })
//   .then(data => {
//     console.log('Sent to sparkpost for delivery');
//     response.end('sent');
//   })
//   .catch(err => {
//     console.error('Unable to send via sparkpost: ' + err);
//     response.end('error');
//   });
// }



/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
} 

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;