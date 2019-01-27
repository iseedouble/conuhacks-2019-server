const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const tf = require('@tensorflow/tfjs-node');
const mobilenet = require('@tensorflow-models/mobilenet');
const fs = require('fs');
const jpeg = require('jpeg-js');
const { createCanvas, loadImage, Image } = require('canvas');

const width = 640;
const height = 540;

const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');

let model;
let mobilenetModel;

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '50mb' }));

app.get('/', (req, res) => res.send('Hello Marcus!'));

app.post('/classify', (req, res) => {
  const { dataURL } = req.body;
  const image = new Image();
  image.src = dataURL;
  ctx.drawImage(image, 0, 0, width, height);
  model.predict(tf.fromPixels(canvas))
    .then((predictions) => {
      console.log(predictions);
      res.json({
        banana: '0.9',
        orange: '0.1',
      });
    })
    .catch((error) => {
      res.json({ error: 'an error occurred' });
    });
});

app.post('/photo', (req, res) => {
  fs.writeFileSync('out.png', req.body.photo, 'base64');
  console.log('Saved.');
  res.send('daved the file');
});

app.post('/mobilenet', (req, res) => {
  const { dataURL } = req.body;
  const image = new Image();
  image.src = dataURL;
  ctx.drawImage(image, 0, 0, width, height);
  mobilenetModel.classify(canvas)
    .then((predictions) => {
      console.log(predictions);
      res.json(predictions);
    })
    .catch((error) => {
      res.json({ error: 'an error occurred' });
    });
});

tf.loadModel('file://./model/model.json')
  .then((res) => {
    model = res;
  })
  .catch(err => console.log(err));

mobilenet.load()
  .then((res) => {
    mobilenetModel = res;
    app.listen(port, () => console.log('marcus has started'));
  })
  .catch(err => console.log('error loadign mobilenet model', err));
