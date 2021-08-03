import React, { useState, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";

let model = tf.sequential();

const Train = () => {

  let [data, setData] = useState(null);
  let [loss, setLoss] = useState(null);

  const train = () => {
    let json = JSON.parse(data);
    let keys = Object.keys(json);

    let _xs = [];
    let _ys = [];

    for (const [i, key] of keys.entries()) {
      // let y = keys.map( k => k === key ? 1 : 0 )
      let y = i;
      json[key].map((pose) => {
        let x = pose.map(({ x, y }) => [x, y]).flat();
        _xs.push(x);
        _ys.push(y);
      });
    }

    console.log(_xs, _ys);

    let labelTensor = tf.tensor1d(_ys, "int32");
    let xs = tf.tensor2d(_xs);
    let ys = tf.oneHot(labelTensor, keys.length);

    console.log(xs.shape, ys.shape);
    xs.print();
    ys.print();

    let hidden = tf.layers.dense({
      units: 16,
      activation: "sigmoid",
      inputDim: 34,
    });

    let output = tf.layers.dense({
      units: keys.length,
      activation: "softmax",
    });

    model.add(hidden);
    model.add(output);

    let optimizer = tf.train.sgd(0.2);

    model.compile({
      optimizer,
      loss: "categoricalCrossentropy",
    });

    model
      .fit(xs, ys, {
        epochs: 100,
        shuffle: true,
        callbacks: {
          onEpochEnd: (n, log) => { setLoss(log.loss) }
        }
      })
  };

  const download = async () => {
    const saveResult = await model.save("downloads://" + (+new Date()));
    console.log(saveResult)
  }

  return (
    <>
      <button onClick={train}>run 100 epochs</button>
      <button onClick={download}>download</button>
      <textarea onChange={(e) => setData(e.target.value)}></textarea>
      <p>loss: {loss}</p>
    </>
  );
};

export default Train;
