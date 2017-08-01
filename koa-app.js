const Koa = require('koa');
const route = require('koa-route');
const mongoose = require('mongoose');
const task = require('./controller/task');
const images = require('./controller/images');
const bodyParser = require('koa-bodyparser');
const convert = require('koa-convert');
const koaRes = require('koa-res');
var cors = require('koa-cors');
const fs = require('fs');
const v1Api = '/api/v1';
const TokenGenerator = require('./controller/token');
const config = require('./config');
const authenticate = require('./controller/authenticate');
const jwtToken = require('jsonwebtoken');
const middleware = require('./controller/middleware');
mongoose.Promise = require('bluebird');

mongoose
  .connect(config.database)
  .then((response) => {
    console.log('mongo connection created')
  })
  .catch((err) => {
    console.log("Error connecting to Mongo")
    console.log(err);
  })

var app = new Koa();
app.use(cors());
app.use(bodyParser());

//authorizaetion
app.use(route.post(v1Api + '/authenticate', authenticate.logon));

// Protected middleware
app.use(middleware.checkAuthetication);
// response
app.use(route.get(v1Api + '/', index));
app.use(route.get(v1Api + '/about', about));
app.use(route.get(v1Api + '/task', task.getTasks));
app.use(route.post(v1Api + '/task', task.createTask));
app.use(route.put(v1Api + '/task', task.updateTask));

app.use(route.get(v1Api + '/images', images.getImages));
app.use(route.post(v1Api + '/images', images.createImages));

function index() {
  this.body = { api: 'v1' };
}
function about() {
  this.body = { api: 'about' }
}


app.on('error', err =>
  log.error('server error', err)
);


app.listen(3000);
console.log('koa listening on port 3000');