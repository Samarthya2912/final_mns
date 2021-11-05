import * as tf from '@tensorflow/tfjs';
import * as faceLandmarksDetector from '@tensorflow-models/face-landmarks-detection';
import Webcam from 'react-webcam';
import { useEffect, useRef } from 'react';
import '../styles/Keyboard.css'

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
  const IntervalRef = useRef();
  const keyBoardintervalRef = useRef();

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
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // const video = webcamRef.current.video;
      const face = await model.estimateFaces({
        input: video
      })

      // document.querySelector('h1').innerHTML = face[0].scaledMesh[14][1] - face[0].scaledMesh[13][1] > 10? "mouth is open":"mouth is close";

      if (face.length) {

        if (face[0].scaledMesh[374][1] - face[0].scaledMesh[386][1] < 4) {
          document.querySelector('#eyestatus').innerHTML = "eye is close";

          if (typing && columnTraversing) {
            document.querySelector('.pad').innerHTML += characters[rowIndex][columnIndex];
            typing = false;
            typed = true;

            columnTraversing = false;
            rowTraversing = true;
            columnIndex = 0;
            clearUI();
            // rowIndex = 0;

            setTimeout(() => {
              typing = true;
            }, 1000);
          }

          if (rowTraversing && typing) {
            columnTraversing = true;
            rowTraversing = false;

            typing = false;

            setInterval(() => {
              typing = true;
            }, 1000);
          }

        } else {
          document.querySelector('#eyestatus').innerHTML = "eye is open";
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
      document.getElementById(row.id).style.color = "black";
    })

    document.getElementById(rows[rowIndex].id).style.color = "blue"
  }

  const setColumnUI = () => {
    const chars = document.querySelectorAll(`#row_${rowIndex} .char`);

    chars.forEach(char => {
      document.getElementById(char.id).style.color = "black"
    })

    document.getElementById(chars[columnIndex].id).style.color = "red";
  }

  const clearUI = () => {
    document.querySelectorAll(".char").forEach(char => {
      char.style = "";
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
    <div className="keyboard-container">
      <div style={{ display: 'flex', alignContent: 'center' }}>
        <Webcam ref={webcamRef} id="webcam" />
      </div>
      <h1 id="eyestatus">Eyestatus</h1>

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
        <p className="pad"></p>
        <h1>Writing Pad</h1>
      </div>
      <button onClick={() => { clearInterval(IntervalRef.current); clearInterval(keyBoardintervalRef.current) }}>Stop Animation</button>

    </div>
  );
}

export default App;