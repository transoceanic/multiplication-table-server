var debug = require('debug')('sync');
var app = require('./app');
var db = require('./db');

var App = function() {

    //  Scope.
    var self = this;


    /*  ================================================================  */
    /*  Helper functions.                                                 */
    /*  ================================================================  */

    self.setupVariables = function() {
        //  Set the environment variables we need.
        self.port = process.env.PORT || 5000;
        self.dbConnectionURL = process.env.DATABASE_URL; // != null ? process.env.MONGODB_URI + 'learning' : 'mongodb://localhost:27017/users';
    };


    /**
     *  terminator === the termination handler
     *  Terminate server on receipt of the specified signal.
     *  @param {string} sig  Signal to terminate on.
     */
    self.terminator = function(sig){
        if (typeof sig === "string") {
           console.log('%s: Received %s - terminating sample app ...',
                       Date(Date.now()), sig);
           process.exit(1);
        }
        console.log('%s: Node server stopped.', Date(Date.now()) );
    };


    /**
     *  Setup termination handlers (for exit and a list of signals).
     */
    self.setupTerminationHandlers = function(){
        //  Process on exit and signals.
        process.on('exit', function() { self.terminator(); });

        // Removed 'SIGPIPE' from the list - bugz 852598.
        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
         'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
        ].forEach(function(element, index, array) {
            process.on(element, function() { self.terminator(element); });
        });
    };


    /*  ================================================================  */
    /*  App server functions (main app logic here).                       */
    /*  ================================================================  */


    /**
     *  Initializes the sample application.
     */
    self.initialize = function() {
        self.setupVariables();
        self.setupTerminationHandlers();
    };

    /**
     *  Start the server (starts up the sample application).
     */
    self.start = function() {
        if (process.env.DEV_ENV) {
            app.listen(self.port, self.ipaddress, function() {
                debug('%s: Node server started on %s:%d ...',
                    Date(Date.now() ), self.ipaddress, self.port);
            });
        } else {
            db.connect(self.dbConnectionURL, function(err) {
                if (err) {
                    console.log('Unable to connect to Postgres. '+err);
                    process.exit(1);
                } else {
                    //  Start the app on the specific interface (and port).
                    app.listen(self.port, self.ipaddress, function() {
                        debug('%s: Node server started on %s:%d ...',
                            Date(Date.now() ), self.ipaddress, self.port);
                    });
                }
            });
        }
    };

};



/**
 *  main():  Main code.
 */
var mainapp = new App();
mainapp.initialize();
mainapp.start();

