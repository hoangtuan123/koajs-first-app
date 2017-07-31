const Koa = require('koa');
const route = require('koa-route');
const mongoose = require('mongoose');
const task = require('./controller/task');
const images = require('./controller/images');
const bodyParser = require('koa-bodyparser');
const convert = require('koa-convert');
const koaRes = require('koa-res');
var cors = require('koa-cors');
var jwt = require('koa-jwt');
const fs = require('fs');
const v1Api = '/api/v1';
const TokenGenerator = require('./controller/token');
const config = require('./config');
const authenticate = require('./controller/authenticate');
// const tokenGenerator = new TokenGenerator('a', 'a', { algorithm: 'HS256', keyid: '1', noTimestamp: false, expiresIn: '2m', notBefore: '2s' })
// token = tokenGenerator.sign({ myclaim: 'something' }, { audience: 'myaud', issuer: 'myissuer', jwtid: '1', subject: 'user' })
// setTimeout(function () {
//   console.log('token');
//   token2 = tokenGenerator.refresh(token, { verify: { audience: 'myaud', issuer: 'myissuer' }, jwtid: '2' })
//   console.log(jwtToken.decode(token, { complete: true }))
//   console.log(jwtToken.decode(token2, { complete: true }))
// }, 3000)
/*
    Mongoose Config
*/
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
app.use(convert(koaRes()));

//401
//Custom 401 handling if you don't want to expose koa-jwt errors to users
// app.use(function (ctx, next) {
//   return next().catch((err) => {
//     if (401 == err.status) {
//       ctx.status = 401;
//       ctx.body = 'Protected resource, use Authorization header to get access\n';
//     } else {
//       throw err;
//     }
//   });
// });

// Middleware below this line is only reached if JWT token is valid
//app.use(jwt({ secret: 'shared-secret' }));

// Protected middleware
// app.use(function (ctx) {
//   let token = ctx.header.token;
//   let countPathTokenDesc = token.split('-').length;
//   if (ctx.url.match(/^\/api/) && countPathTokenSrc != countPathTokenDesc) {
//     ctx.body = 'protected';
//   }
// });


//authorizaetion
app.use(route.post(v1Api + '/authenticate', authenticate.logon));
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