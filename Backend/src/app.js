const express = require('express');
const app = express();
const { adminAuth, userAuth } = require('../middleware/auth.js');

//! this '/' routehandler will act like a widlcard means that any route start with / eg.login, express assume that it's this '/' route. express ll check routes by order ,
//! order of routing is very important when its comes to routing, put handler like '/'  or '' after all routes otherewise all routes ll fall under these route.

app.use('/admin', adminAuth);

app.use('/user/login', (req, res, next) => {
  res.send('welcome to user login');
});

app.use('/user/data', userAuth, (req, res, next) => {
  res.send(
    'hello user take ur data authentication successful ,here is your data'
  );
});

app.use('/user', userAuth, (req, res, next) => {
  res.send('hello users');
});

app.get('/admin/getalluserinfo', (req, res, next) => {
  res.send('here is your all users data: ......');
});

app.use('/admin/getprofit', (req, res, next) => {
  res.send('Total yearly profit is....');
});
app.listen(2222, () => {
  console.log('server is listening to the port 2222');
});
