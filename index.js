const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const tf = require('@tensorflow/tfjs-node');
const mobilenet = require('@tensorflow-models/mobilenet');
const fs = require('fs');
const jpeg = require('jpeg-js');
const { createCanvas, loadImage, Image } = require('canvas');

const width = 224;
const height = 224;

const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');

let model;
let mobilenetModel;

const app = express();
const port = process.env.PORT || 3000;

const cropImage = (img) => {
  const size = Math.min(img.shape[0], img.shape[1]);
  const centerHeight = img.shape[0] / 2;
  const beginHeight = centerHeight - (size / 2);
  const centerWidth = img.shape[1] / 2;
  const beginWidth = centerWidth - (size / 2);
  return img.slice([beginHeight, beginWidth, 0], [size, size, 3]);

}
const capture = (img) => {
  return tf.tidy(() => {
      const webcamImage = tf.fromPixels(img);
      const croppedImage = cropImage(webcamImage);
      const batchedImage = croppedImage.expandDims(0);
      return batchedImage.toFloat().div(tf.scalar(127)).sub(tf.scalar(1));
  })

}

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '50mb' }));

app.get('/', (req, res) => res.send('Hello Marcus!'));

app.post('/classify', (req, res) => {
  const { dataURL } = req.body;
  const image = new Image();
  image.src = dataURL;
  ctx.drawImage(image, 0, 0, width, height);
  const activations = mobilenetModel.predict(capture(canvas));
  const predictedClass = model.predict(activations).as1D().argMax();
  console.log(predictedClass);
  let classId;
  predictedClass.data().then(data => {
    classId = data[0];
    res.json(classId);
    console.log(classId);
  })
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
    tf.loadModel('https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json')
      .then(res => {
        mobilenetModel = res;
        const layer = mobilenetModel.getLayer('conv_pw_13_relu');
        mobilenetModel = tf.model({ inputs: mobilenetModel.inputs, outputs: layer.output });
        app.listen(port, () => console.log('marcus has started'));
      });
  })
  .catch(err => console.log(err));
