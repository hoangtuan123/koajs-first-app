var Koa = require('koa');
var route = require('koa-route');
var app = new Koa();
// response
app.use(route.get('/', index));
app.use(route.get('/about', about));

function index(){
  console.log('info hello')
  this.body = {api: 'v1'}
}
function about(){
  this.body = {api: 'about'}
}

app.on('error', err =>
  log.error('server error', err)
);


app.listen(3000);
console.log('koa listening on port 3000');