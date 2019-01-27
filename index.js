const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.port || 3000;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Hello Marcus!'));

app.get('/classify', (req, res) => res.send('BANANA'));

app.listen(port, () => console.log('marcus has started'));
