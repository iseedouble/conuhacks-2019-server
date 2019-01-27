const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
//const tf = require('@tensorflow/tfjs-node');
// const image = require('get-image-data');
// const cv = require('');

// tf.loadModel('file://./model/model.json')
//   .then((model) => {
//     image('./resources/doritos.png', (err, data) => {
//       console.log(data);
//       model.predict(tf.fromPixels(data));
//     });
//   })
//   .catch(err => console.log(err));

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json({limit: '50MB'}));

app.get('/', (req, res) => res.send('Hello Marcus!'));
app.get('/classify', (req, res) => res.send('BANANA'));

app.post('/photo', (req, res) => {
  fs.writeFileSync('out.png', req.body.photo, 'base64', (err) => console.log(err));
  console.log('Saved.');  
})

app.listen(port, () => console.log('marcus has started'));
