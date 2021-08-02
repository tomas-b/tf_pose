import React, { useState, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import "@tensorflow/tfjs-backend-webgl";
import * as poseDetection from "@tensorflow-models/pose-detection";
// import * as tf from "@tensorflow/tfjs-core";

// poseDetection
const detector = await poseDetection.createDetector(
  poseDetection.SupportedModels.MoveNet
);

const App = () => {
  let webcamRef = useRef(null);
  let canvasRef = useRef(null);

  useEffect(() => {
    let ctx, ctxW, ctxH;

    let loop = async () => {
      try {
        const { keypoints } = (
          await detector.estimatePoses(webcamRef.current.video)
        )[0];
        let { x: x1, y: y1, score: s1 } = keypoints[5];
        let { x: x2, y: y2, score: s2 } = keypoints[6];
        let neck = { x: (x1 + x2) / 2, y: (y1 + y2) / 2, score: (s1 + s2) / 2 };
        keypoints.push(neck);
        draw(keypoints, ctx);
      } catch (e) {
        console.log(e);
      }
      requestAnimationFrame(loop);
    };

    let draw = (keypoints, ctx) => {
      console.log(keypoints);
      ctx.clearRect(0, 0, ctxW, ctxH);
      ctx.fillStyle = "rgba(0,0,0,.7)";
      ctx.fillRect(0, 0, ctxW, ctxH);
      ctx.fillStyle = "rgba(155,0,100,.6)";
      keypoints.map(({ x, y, score }) => {
        if (score > 0.3) {
          ctx.beginPath();
          ctx.arc(x, y, 10, 0, 2 * Math.PI);
          ctx.fill();
        }
      });

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
        [0, 17],
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
      ctx.strokeStyle = "rgba(255,0,0,.6)";

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

  return (
    <>
      <h1>testing tf</h1>
      <canvas style={{ position: "absolute" }} ref={canvasRef} />
      <Webcam ref={webcamRef} />
    </>
  );
};

export default App;