/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import * as tf from '@tensorflow/tfjs';
import * as faceLandmarksDetector from '@tensorflow-models/face-landmarks-detection';
import Webcam from 'react-webcam';
import { useEffect, useRef, useState } from 'react';
// import '../styles/Keyboard.css'

const characters = [
  ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
  ['h', 'i', 'j', 'k', 'l','m','n'],
  ['o', 'p', 'q', 'r','s','t','u'],
  ['v', 'w','x', 'y', 'z'],
  ['1', '2', '3', '4', '5'],
  ['6', '7', '8', '9', '0'],
  ['Spacebar']
]

function App() {
  const webcamRef = useRef();
  const IntervalRef = useRef();
  const keyBoardintervalRef = useRef();
  const padRef = useRef();

  let rowIndex = -1;
  let columnIndex = -1;
  let typing = true;
  let typed = false;
  let rowTraversing = true;
  let columnTraversing = false;


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

  const detectFace = async (model) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;

      // const video = webcamRef.current.video;
      const face = await model.estimateFaces({
        input: video
      })

      // document.querySelector('h1').innerHTML = face[0].scaledMesh[14][1] - face[0].scaledMesh[13][1] > 10? "mouth is open":"mouth is close";

      if (face.length) {

        if (face[0].scaledMesh[374][1] - face[0].scaledMesh[386][1] < 4) {
          if (typing && columnTraversing) {
            if(characters[rowIndex][columnIndex] === 'Spacebar') padRef.current.value += ' ';
            else padRef.current.value += characters[rowIndex][columnIndex];
            //  (text + characters[rowIndex][columnIndex]);
            typing = false;
            typed = true;

            columnTraversing = false;
            rowTraversing = true;
            columnIndex = 0;
            clearUI();
            // rowIndex = 0;

            setTimeout(() => {
              typing = true;
            }, 500);
          }

          if (rowTraversing && typing) {
            columnTraversing = true;
            rowTraversing = false;

            typing = false;

            setInterval(() => {
              typing = true;
            }, 1000);
          }

        } 
      }

    } else {
      console.log('loading...');
    }
  }


  const setRowUI = () => {
    const rows = document.querySelectorAll(".keyboard-row");
    console.log(rows);
    rows.forEach(row => {
      document.getElementById(row.id).classList.remove("blue");
    })

    document.getElementById(rows[rowIndex].id).classList.add("blue");
  }

  const setColumnUI = () => {
    const chars = document.querySelectorAll(`#row_${rowIndex} .char`);

    chars.forEach(char => {
      document.getElementById(char.id).classList.remove("red");
    })

    document.getElementById(chars[columnIndex].id).classList.add("red");
  }

  const clearUI = () => {
    document.querySelectorAll(".char").forEach(char => {
      char.classList.remove("red");
    });
  }

  useEffect(runFaceLandmarksDetector, []);

  useEffect(() => {
    keyBoardintervalRef.current = setInterval(() => {
      if (rowTraversing) {
        if (rowIndex === -1) rowIndex = 0;
        else if (rowIndex === characters.length - 1) rowIndex = 0;
        else rowIndex++;

        setRowUI();
      } else if (columnTraversing) {
        if (columnIndex === -1) {
          columnIndex = 0;
          if (rowIndex === -1) rowIndex = 0;
        }
        else if (columnIndex === characters[rowIndex].length - 1) columnIndex = 0;
        else columnIndex++;

        setColumnUI();
      }

    }, 1000);
  }, [])

  return (
    <>
      <h1>`Blink-to-type` Keyboard</h1>
      <div className="keyboard-container">
        <div style={{ display: 'flex', alignContent: 'center' }}>
          <Webcam ref={webcamRef} id="webcam" />
        </div>

        <div className="keyboard">
          {
            characters.map((row, index) => {
              return (
                <div className="keyboard-row" id={`row_${index}`} key={index}>
                  {
                    row.map((char, index__) => {
                      return <h2 className="char" id={char} key={char}>{char}</h2>
                    })
                  }
                </div>
              )
            })
          }
        </div>

        <div>
          <textarea className="pad" placeholder="Your text goes here..." ref={padRef} value={""} />
        </div>
      </div>
      <button onClick={() => { clearInterval(IntervalRef.current); clearInterval(keyBoardintervalRef.current) }}>Stop</button>
    </>
  );
}

export default App;