git clone  https://github.com/transoceanic/multiplication-table-server.git
cd node-js-getting-started

########## Initialize project
#create index.js, Procfile, .env
npm init
npm install express --save
npm install body-parser --save
npm install ejs --save
##################################################

########## Commit to git
git add .
git commit -m "My Commit's Comment"
git push origin master // push all commited to master or other branch name
git pull origin master // get changes from master or other branch name
##################################################

########## Initialize Heroku
heroku create multiplication-table-server
git push heroku master    // deploy to heroku
##################################################
app api:
https://multiplication-table-server.herokuapp.com/multiplication-table/score/best
https://multiplication-table-server.herokuapp.com/multiplication-table/score/check

########## SendGrid (send email)
npm install sendgrid --save
    API Key: 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
    API Key ID: YNtRB_xhRLuQRnEGZ5fdSg

########## Postgres
heroku addons:create heroku-postgresql:hobby-dev
npm install pg --save
# instal postgres localy
# run postgres cli (command from postgres addons -> View credentials) https://data.heroku.com/datastores/87af4658-7d1f-4f7b-9560-5e470699a180
heroku pg:psql postgresql-round-61891 --app multiplication-table-server // to open db client connected to heroku db
    CREATE TABLE LAST_10_DAY(
        ID      BIGSERIAL   PRIMARY KEY,
        NAME    TEXT        NOT NULL,
        SCORE   INTEGER     NOT NULL,
        DATE    TIMESTAMP   NOT NULL
    );
    CREATE TABLE LAST_10_WEEK(
        ID      BIGSERIAL   PRIMARY KEY,
        NAME    TEXT        NOT NULL,
        SCORE   INTEGER     NOT NULL,
        DATE    TIMESTAMP   NOT NULL
    );
    CREATE TABLE LAST_10_MONTH(
        ID      BIGSERIAL   PRIMARY KEY,
        NAME    TEXT        NOT NULL,
        SCORE   INTEGER     NOT NULL,
        DATE    TIMESTAMP   NOT NULL
    );
    CREATE TABLE LAST_10_YEAR(
        ID      BIGSERIAL   PRIMARY KEY,
        NAME    TEXT        NOT NULL,
        SCORE   INTEGER     NOT NULL,
        DATE    TIMESTAMP   NOT NULL
    );
    CREATE TABLE LAST_10_CENTURY(
        ID      BIGSERIAL   PRIMARY KEY,
        NAME    TEXT        NOT NULL,
        SCORE   INTEGER     NOT NULL,
        DATE    TIMESTAMP   NOT NULL
    );
##################################################
