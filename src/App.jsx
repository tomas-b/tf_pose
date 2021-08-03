import React, { useState, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import "@tensorflow/tfjs-backend-webgl";
import * as poseDetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs";

// poseDetection
const detector = await poseDetection.createDetector(
  poseDetection.SupportedModels.MoveNet
);

const App = () => {
  let [recording, setRecording] = useState(false);
  let [poseRecord, setPoseRecord] = useState({});
  let [key, setKey] = useState(null);
  let webcamRef = useRef(null);
  let canvasRef = useRef(null);
  const recRef = useRef(recording);
  recRef.current = recording;
  const keyRef = useRef(key);
  keyRef.current = key;

  useEffect(() => {
    let ctx, ctxW, ctxH;

    let loop = async () => {
      try {
        const { keypoints } = (
          await detector.estimatePoses(webcamRef.current.video)
        )[0];

        (recRef.current) && setPoseRecord((pr) => {
          let key = keyRef.current;
          if(!(pr[key] instanceof Array)) pr[key] = []
          pr[key].push(keypoints.map(({ x, y }) => ({ x: x/ctxW , y: y/ctxH  })));
          return pr;
        });

        let { x: x1, y: y1, score: s1 } = keypoints[5];
        let { x: x2, y: y2, score: s2 } = keypoints[6];
        let neck = { x: (x1 + x2) / 2, y: (y1 + y2) / 2, score: (s1 + s2) / 2 };
        let { x: x3, y: y3, score: s3 } = keypoints[3];
        let { x: x4, y: y4, score: s4 } = keypoints[4];
        let head = { x: (x3 + x4) / 2, y: (y3 + y4) / 2, score: (s3 + s4) / 2 };
        keypoints.push(neck);
        keypoints.push(head);
        draw(keypoints, ctx);
      } catch (e) {
        console.log(e);
      }
      requestAnimationFrame(loop);
    };

    let draw = (keypoints, ctx) => {
      ctx.clearRect(0, 0, ctxW, ctxH);

      ctx.fillStyle = "rgba(0,0,0,.7)";
      ctx.fillRect(0, 0, ctxW, ctxH);

      let lines = [
        [4, 2],
        [2, 0],
        [0, 1],
        [1, 3],
        [5, 7],
        [7, 9],
        [6, 8],
        [8, 10],
        [5, 6],
        [18, 17],
        [5, 11],
        [6, 12],
        [11, 13],
        [13, 15],
        [11, 12],
        [12, 14],
        [14, 16],
      ];
      let { x: x1, y: y1, score: s1 } = keypoints[1];
      let { x: x2, y: y2, score: s2 } = keypoints[2];

      ctx.lineWidth = Math.hypot(x1 - x2, y1 - y2) * 0.2;
      ctx.strokeStyle = "rgba(155,0,100,.7)";
      ctx.fillStyle = "rgba(155,0,100,.7)";

      lines.map((line) => {
        let treshold = true;
        ctx.beginPath();
        line.map((i, k) => {
          let { x, y, score } = keypoints[i];
          if (score < 0.3) treshold = false;
          if (k === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        });
        if (treshold) ctx.stroke();
      });

      // ctx.fillStyle = "rgba(255,0,0,.6)";
      keypoints.map(({ x, y, score }) => {
        if (score > 0.3) {
          ctx.beginPath();
          ctx.arc(x, y, 6, 0, 2 * Math.PI);
          ctx.fill();
        }
      });
    };

    webcamRef.current.video.addEventListener("loadeddata", () => {
      let { top, left, height, width } =
        webcamRef.current.video.getBoundingClientRect();
      canvasRef.current.height = height;
      canvasRef.current.width = width;
      ctxW = width;
      ctxH = height;
      ctx = canvasRef.current.getContext("2d");
      loop();
    });

  }, []);

  const record = () => {
    console.log("!");
    setTimeout(() => console.log("3..."), 1000);
    setTimeout(() => console.log("2..."), 2000);
    setTimeout(() => console.log("1..."), 3000);
    setTimeout(() => {
      console.log("0!");
      setRecording(true);
    }, 4000);
    setTimeout(() => {
      console.log("stop");
      setRecording(false);
    }, 10000);
  };

  return (
    <>
      <canvas style={{ position: "absolute" }} ref={canvasRef} />
      <Webcam ref={webcamRef} />
      <hr />
      class name: <input onChange={({target})=>{
        setKey(target.value)
        setRecording(false)
      }}/>
      <button onClick={record}>record</button>
      {recording && "recording"}
      <pre
        style={{height:'300px', background:'#efefef', overflow:'scroll'}}
      >{JSON.stringify(poseRecord,null,2)}</pre>
    </>
  );
};

export default App;
