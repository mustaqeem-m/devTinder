const express = require('express');

const app = express();

//! this '/' routehandler will act like a widlcard means that any route start with / eg.login, express assume that it's this '/' route. express ll check routes by order ,
//! order of routing is very important when its comes to routing, put handler like '/'  or '' after all routes otherewise all routes ll fall under these route.

app.get('/user', (req, res) => {
  console.log(req.query);
  res.send({ firstname: 'Mohammed', lastname: 'Mustaqeem' });
});

app.post('/user', (req, res) => {
  // logic to save data in db
  res.send('data updated in DB successfully!');
});

app.delete('/user', (req, res) => {
  //logic to delete data in DB
  res.send('data deleted in DB successfully!');
});

app.use('/dashboard', (req, res) => {
  res.send('this is dashboard of devtinder');
});

app.use('/', (req, res) => {
  res.send('Hello welcome to port 1234');
});

app.listen(2222, () => {
  console.log('server is listening to the port 2222');
});
