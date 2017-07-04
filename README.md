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

########## mLab MongoDB (https://devcenter.heroku.com/articles/mongolab)
heroku addons:create mongolab
heroku config:get MONGODB_URI -s >> .env
npm install mongodb --save
#create training-exchange collection (mLab Admin dashboard https://www.mlab.com/databases/heroku_kcbl2mw5)
##################################################

########## Temporize Scheduler (https://devcenter.heroku.com/articles/temporize)
heroku addons:create temporize
heroku config:get TEMPORIZE_URL -s >> .env
##################################################
