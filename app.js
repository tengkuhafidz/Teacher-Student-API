const Koa = require('koa');
const logger = require('koa-logger');
const Router = require('koa-router');
const bodyParser = require('koa-body')();
const db = require('./config/db');

const app = new Koa();

// log all events to the terminal
app.use(logger());

// general error handling for all
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = {message: err.message};
    ctx.app.emit('error', err, ctx);
  }
});

// instantiate new Router for the specified User Stories
const mainRouter = new Router({
  prefix: '/api'
});
// instantiate new Router for basic Teacher CRUD
const teacherRouter = new Router({
  prefix: '/api/teachers'
});
// instantiate new Router for basic Student CRUD
const studentRouter = new Router({
  prefix: '/api/students'
});

// require external routes and pass in the router
require('./routes/main')({ mainRouter, db, bodyParser });
require('./routes/teachers')({ teacherRouter, db, bodyParser});
require('./routes/students')({ studentRouter, db, bodyParser});

// tells the router to use all the routes that are on the object
app.use(mainRouter.routes()).use(mainRouter.allowedMethods());
app.use(teacherRouter.routes()).use(teacherRouter.allowedMethods());
app.use(studentRouter.routes()).use(studentRouter.allowedMethods());

// tell the server to listen to events on a specific port
const server = app.listen(3000, () => console.log('Server started!'));
module.exports = server;