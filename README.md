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
app url - https://multiplication-table-server.herokuapp.com/multiplication-table/api/achievements

########## Postgres
heroku addons:create heroku-postgresql:hobby-dev
npm install pg --save
##################################################
