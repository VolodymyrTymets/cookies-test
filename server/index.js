const express = require('express');
const Cookies = require('cookies');

const app = express();

const PORT = 3002;
const tokens = [
  '1559008115',
  '4395115688',
  '3145488612',
  '5311215883',
  '3935885115',
  '8496319702',
  '1580019018',
  '1177264464',
  '6553213529',
  '9118046387'
];
const getRandomInt = max => Math.floor(Math.random() * Math.floor(max));
const log = message => console.log('-->', message);

const keys = ['keyboard cat'];
app.get('/login', function (req, res) {
  log(req.path);
  const cookies = new Cookies(req, res, { keys: keys });
  const newToken = tokens[getRandomInt(tokens.length - 1)];
  cookies.set('token', newToken, { signed: true });
  res.json({ token: newToken })
});

app.get('*', function (req, res) {
  log(req.path);
  const cookies = new Cookies(req, res, { keys: keys });
  const token = cookies.get('token', { signed: true, httpOnly: true, secure: true });
  log(`token -> ${token}`);
  return token
    ? res.json({ counter: getRandomInt(10) })
    : res.status(401).send({ error: 'Auth error!' });

});
app.listen(PORT,  console.log(`Server is running at port: ${PORT}`));