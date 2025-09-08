const express = require('express');

const app = express();

// app.use((req, res) => {
//   res.send('Hello welcome to port 1234');
// });

app.get('/login', (req, res) => {
  res.send('welcome to login page');
});

app.get('/profile', (req, res) => {
  res.send('this is users profile');
});

app.use('/dashboard', (req, res) => {
  res.send('this is dashboard of devtinder');
});

app.listen(2222, () => {
  console.log('server is listening to the port 2222');
});
