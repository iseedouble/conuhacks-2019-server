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

mobilenet.load()
  .then((model) => {
    loadImage('./resources/nestea.jpg').then((image) => {
      ctx.drawImage(image, 0, 0, width, height);
      const imageData = ctx.getImageData(0, 0, width, height);
      const tensor3d = tf.fromPixels(canvas);
      model.classify(canvas)
        .then((res) => {
          console.log('res', res);
        })
        .catch((err) => {
          console.log('error on classification', err);
        });
    }).catch((err) => { console.log('error on image load', err); });
  })
  .catch((err) => { console.log('error on model load', err); });

/*
tf.loadModel('file://./model/mobilenet.json')
  .then((model) => {

    loadImage('./resources/nestea.jpg').then((image) => {
      ctx.drawImage(image, 0, 0, width, height);
      const imageData = ctx.getImageData(0, 0, width, height);
      const tensor3d = tf.fromPixels(canvas);
      model.predict(tensor3d.as4D(1, height, width, 3));

      // const tensor = tf.tensor3d(new Uint8Array(imageData.data), [width, height, 3], 'int32').expandDims(0);
      // model.predict(tensor);
      // model.predict(tensor3d.expandDims(0));
    }).catch((err) => { console.log('error', err); });

    // const data = fs.readFileSync('./resources/nestea.jpg');
    // const imageData = jpeg.decode(data);
    // console.log(imageData);
    // model.predict(tf.fromPixels(imageData));

    // const image = new Image();
    // image.src = 'resources/nestea.jpg';
    // model.predict(tf.fromPixels(image));
  })
  .catch(err => console.log(err));
*/

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Hello Marcus!'));

app.get('/classify', (req, res) => res.send('BANANA'));

app.listen(port, () => console.log('marcus has started'));
