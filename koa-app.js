const Koa = require('koa');
const route = require('koa-route');
const mongoose = require('mongoose');
const task = require('./controller/task');
const bodyParser = require('koa-bodyparser');
const convert = require('koa-convert');
const koaRes = require('koa-res')
/*
    Mongoose Config
*/
mongoose.Promise = require('bluebird')
mongoose
  .connect('mongodb://localhost:27017/exampleDb')
  .then((response) => {
    console.log('mongo connection created')
  })
  .catch((err) => {
    console.log("Error connecting to Mongo")
    console.log(err);
  })

var app = new Koa();
app.use(bodyParser());
app.use(convert(koaRes()));
// response
app.use(route.get('/', index));
app.use(route.get('/task', task.getTasks));
app.use(route.post('/task', task.createTask));
app.use(route.put('/task', task.updateTask));

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