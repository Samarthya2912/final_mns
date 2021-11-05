import './App.css';
import * as tf from '@tensorflow/tfjs';
import * as faceLandmarksDetector from '@tensorflow-models/face-landmarks-detection';
import Webcam from 'react-webcam';
import { useEffect, useRef } from 'react';
import { drawMesh } from './functions/canvas_functions.js';
import Mapper from './components/Mapper.js'
import Keyboard from './components/Keyboard.js'
import Home from './components/Home';
import {
  BrowserRouter as Router,
  Link,
  Routes,
  Route
} from 'react-router-dom'

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
          <Link to="/mapper">Landmark mapper</Link>
          <Link to="/keyboard">Keyboard</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mapper" element={<Mapper />} />
          <Route path="/keyboard" element={<Keyboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;