import React from 'react'
import TensorflowIcon from './Tensorflow.js'
import ReactIcon from './React.js'

const Home = () => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <h1>Hi there!</h1>
            <div style={{
                width: '80vw',
                height: '30vw',
                display: 'flex',
                justifyContent: 'space-evenly',
                alignItems: 'center'
            }}>
                <ReactIcon />
                <h1 style={{ fontSize: '10em' }}>+</h1>
                <TensorflowIcon />
            </div>
        </div>
    )
}

export default Home
