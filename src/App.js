import './App.css';
import * as tf from '@tensorflow/tfjs';
import * as faceLandmarksDetector from '@tensorflow-models/face-landmarks-detection';
import Webcam from 'react-webcam';
import { useEffect, useRef } from 'react';
import { drawMesh } from './functions/canvas_functions.js';
import Mapper from './components/Mapper.js'
import Keyboard from './components/Keyboard.js'
import {
  BrowserRouter as Router,
  Link,
  Routes,
  Route
} from 'react-router-dom'

const characters = [
  ['a', 'b', 'c', 'd'],
  ['e', 'f', 'g', 'h'],
  ['i', 'j', 'k', 'l'],
  ['m', 'n', 'o', 'p'],
  ['q', 'r', 's', 't', 'u'],
  ['v', 'w', 'x', 'y', 'z'],
  ['1', '2', '3', '4', '5'],
  ['6', '7', '8', '9', '0'],
]

function App() {
  const webcamRef = useRef();
  const canvasRef = useRef();
  const intervalRef = useRef();

  const runFaceLandmarksDetector = () => {
    async function call() {
      const model = await faceLandmarksDetector.load(
        faceLandmarksDetector.SupportedPackages.mediapipeFacemesh
      )
      intervalRef.current = setInterval(() => {
        detectFace(model);
      }, 10)
    }

    call();
  }

  const detectFace = async (model) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;


      // const video = webcamRef.current.video;
      const face = await model.estimateFaces({
        input: video
      })

      const ctx = canvasRef.current.getContext("2d");
      drawMesh(face, ctx);
    }
  }

  useEffect(runFaceLandmarksDetector, []);

  return (
    <Router>
      <div className="App">
        <nav>
          <Link to="/">Home</Link>
          <Link to="/keyboard">Keyboard</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Mapper />} />
          <Route path="/keyboard" element={<Keyboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;