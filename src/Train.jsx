import React, { useState, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";

const Train = () => {

  let [data, setData] = useState(null)

  const train = () => {

    let json = JSON.parse(data);
    let keys = Object.keys(json);

    let _xs = []
    let _ys = []

    for(const [i, key]  of keys.entries()) {
        // let y = keys.map( k => k === key ? 1 : 0 )
        let y = i
        json[key].map( pose => {
          let x = pose.map( ({x,y}) => ([x,y]) ).flat() 
          _xs.push(x)
          _ys.push(y)
        })
    }

    console.log(_xs, _ys)

    let labelTensor = tf.tensor1d( _ys, 'int32' )
    let xs = tf.tensor2d(_xs)
    let ys = tf.oneHot(labelTensor, keys.length)

    console.log(xs.shape, ys.shape);
    xs.print()
    ys.print()

  }

  return <>
  <button onClick={train}>run</button>
  <textarea onChange={e=>setData(e.target.value)}></textarea>
  </>

};

export default Train;