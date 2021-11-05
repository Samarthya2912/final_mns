/* eslint-disable no-unused-vars */
import React, { useEffect, useRef } from 'react'
import ReactWebcam from 'react-webcam'
// import '../styles/Mapper.css'
import * as tf from '@tensorflow/tfjs'
import * as faceLandmarksDetector from '@tensorflow-models/face-landmarks-detection'
import Webcam from 'react-webcam'
import { drawMesh } from '../functions/canvas_functions.js'

const Mapper = () => {
    /* refs */
    const webcamRef = useRef();
    const canvasRef = useRef();
    const videoRef = useRef();
    const IntervalRef = useRef();

    function runFaceLandmarksDetector() {
        async function call() {
            const model = await faceLandmarksDetector.load(
                faceLandmarksDetector.SupportedPackages.mediapipeFacemesh
            )

            IntervalRef.current = setInterval(() => {
                detectFace(model);
            }, 10);
        }

        call();
    }

    async function detectFace(model) {
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

            const face = await model.estimateFaces({
                input: video
            })

            const ctx = canvasRef.current.getContext("2d");
            drawMesh(face, ctx);
        }

    }

    useEffect(() => {
        runFaceLandmarksDetector();

        return () => {
            clearInterval(IntervalRef.current)
        }
    }, []);

    return (
        <>
            <h1>Landmark Mapper</h1>
            <div className="mapper-container">
                <div style={{ display: 'flex', alignContent: 'center' }}>
                    <canvas height="400" width="600" ref={canvasRef} id="canvas" ></canvas>
                    <Webcam ref={webcamRef} id="webcam" />
                </div>
            </div>
            <button onClick={() => { clearInterval(IntervalRef.current) }}>Stop</button>
        </>
    )
}

export default Mapper
