var VALID_TIMES = JSON.parse(process.env.VALID_TIMES); // ['10', '12', '20'];
var VALID_LANGUAGES = JSON.parse(process.env.VALID_LANGUAGES); // ['en', 'il'];

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
            appName: ['Multiplication Table Kids 10x10',
                    'Times Tables Kids 12x12',
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

app.post('/game/:gameType/:language/contact', function(req, res) {
    let gameType = req.params.gameType;
    let language = req.params.language;

    if (VALID_TIMES.indexOf(gameType) > -1 && VALID_LANGUAGES.indexOf(language) > -1) {
        sendMail(res, {
            to: 'multiplication.times.tables@gmail.com',
            email: req.body.email || '--',
            name: req.body.name || '--',
            message: req.body.message,
            gameType: gameType,
            language: language
        });
    }
});

function sendMail(res, data) {
    var helper = require('sendgrid').mail;
    var from_email = new helper.Email(data.email);
    var to_email = new helper.Email('multiplication.times.tables@gmail.com');
    var subject = 'Contact Form From Landing Page: '+data.email+' ('+data.gameType+')('+data.language+')';
    var content = new helper.Content('text/plain', '"'+data.name+'" '+data.email+'\n\n' + data.message);
    var mail = new helper.Mail(from_email, subject, to_email, content);

    var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
    var request = sg.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: mail.toJSON(),
    });

    sg.API(request, function(error, response) {
        if (!error) {
            res.end('sent');
        } else {
            res.end('error');
        }
    });
}



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