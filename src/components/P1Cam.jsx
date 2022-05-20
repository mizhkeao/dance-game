
import React, { useEffect, useState, useRef, useCallback } from 'react'

import { createDetector, movenet, SupportedModels } from '@tensorflow-models/pose-detection'
import '@tensorflow/tfjs-backend-webgl'

import { Camera } from '@mediapipe/camera_utils'
import Box from "@mui/material/Box"

import PoseCanvas from './PoseCanvas'

export default function P1Cam({ setUserPose, setP1Stream }) {
    
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
              }
						)
          
            await camera.start()
						setP1Stream(cameraRef.current.srcObject)
							
						return () => { 
							console.log("camera.stop()")
							setP1Stream(null)
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
        <Box className='gradient-border'
				sx={{ 
					transform: 'scaleX(-1)',
					position: 'absolute',
					width: 384,
					height: 216,
          bottom: 32,
          left: 32,
					justifyContent: 'center',
					alignItems: 'center,'
				}}>
						<video ref={cameraRef} width='384' height='216' style={{
							position: 'absolute',
							borderRadius: 4
						}}/>
        </Box>
    )
}
