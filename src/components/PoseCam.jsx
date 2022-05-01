
import React, { useEffect, useState, useRef, useCallback } from 'react'

import { createDetector, movenet, SupportedModels } from '@tensorflow-models/pose-detection'
import '@tensorflow/tfjs-backend-webgl'

import { Camera } from '@mediapipe/camera_utils'
import Box from "@mui/material/Box"

import PoseCanvas from './PoseCanvas'

export default function PoseCam({ setUserPose }) {
    
    // const [pose, setPose] = useState(null)
    const [detector, setDetector] = useState(null)

    const cameraRef = useRef()

    const getDetector = async() => {
        try {
            const detectorConfig = {
                modelUrl: "/dance-game/movenet/model.json",
                modelType: movenet.modelType.SINGLEPOSE_THUNDER,
                minPoseScore: 0.5,
                enableSmoothing: true,
            }
            const detector = await createDetector(SupportedModels.MoveNet, detectorConfig)
            setDetector(detector)
            console.log('detector loaded.')

            const camera = new Camera(cameraRef.current, {
                onFrame: async () => {
                  const poses = await detector.estimatePoses(cameraRef.current)
									if (poses.length === 0) {
										setUserPose(null)
									} else {
										setUserPose(poses[0].keypoints)
										// console.log(poses[0])
									}
                },
                faceingMode: 'user',
                width: 384,
                height: 216,
              })
          
              camera.start()
          
              return () => { 
                console.log("camera.stop()")
                camera.stop()
              }
        } catch(e) {
          console.log(e)
        }
    }

    useEffect(() => {
        getDetector()
    }, [])

    return (
        <Box>
            <video ref={cameraRef} width="384" height="216" style={{
              transform: 'scaleX(-1)',
              position: 'absolute',
              bottom: 0,
              left: 0,
            }}/>
            {/* <PoseCanvas pose={pose} color="red" width="384" height="216" scale={1} /> */}
        </Box>
    )
}
