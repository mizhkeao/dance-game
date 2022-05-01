import { createDetector, movenet, SupportedModels } from '@tensorflow-models/pose-detection'
import '@tensorflow/tfjs-backend-webgl'

import { useState, useCallback, useEffect, useRef } from 'react'

import Box from "@mui/material/Box"

// import PoseCanvas from './PoseCanvas'
import assert from 'assert'
import fbApp from "./Firestore"
import { getStorage, ref, uploadBytes } from "firebase/storage"
import { getFirestore, doc, setDoc } from "firebase/firestore"


const Uploader = () => {

    const [startFrame, setStartFrame] = useState(0)
    const [frame, setFrame] = useState(0)
    const [detector, setDetector] = useState(null)
    
    const mvRef = useRef()
    const cvRef = useRef()

    useEffect(() => {
        mvRef.current.playbackRate = 0.1
        getDetector()
    }, [])

    useEffect(() => {
        if (detector != null) {
            mvRef.current.play()
        }
    }, [detector])
    
    const getDetector = async() => {
        try {
            const detectorConfig = {
                // modelUrl: "models/movenet/model.json",
                modelType: movenet.modelType.SINGLEPOSE_THUNDER,
                enableSmoothing: true,
            }
            const detector = await createDetector(SupportedModels.MoveNet, detectorConfig)
            setDetector(detector)
            console.log('detector loaded.')
        } catch(e) {
          console.log(e)
        }
    }

    // const [poses, setPoses] = useState([])

    // Get a reference to the storage service, which is used to create references in your storage bucket
    const storage = getStorage()

    // Uploading Poses to Firebase
    const db = getFirestore(fbApp)

    const getPoses = useCallback(async (currFrame) => {
        if (detector == null) { return }
        console.log('getPoses')
        try {
            const poses = await detector.estimatePoses(mvRef.current)
            // setDbPose(poses[0], currFrame)
            const pose = poses[0]
            const poseName = `roxanne-${zeroPad(currFrame, 5)}`
            const ref = doc(db, 'mvs', 'roxanne', 'poses', poseName)
            setDoc(ref, {
                keypoints: pose.keypoints,
                score: pose.score,
            })
            console.log(`getPose ${poseName}`)
            // setPoses(poses)
        } catch(e) {
            console.log(e)
        }
    }, [db, detector])

    const zeroPad = (num, places) => String(num).padStart(places, '0')

    const frameCallback = useCallback((_, metadata) => {
        if (detector == null) { return }
        console.log('frameCallback')
        // get pose of humans in video
        const currFrame = metadata.presentedFrames - startFrame
        // getPoses(currFrame)
        setFrame(currFrame)

        // const cv = cvRef.current
        // const ctx = cv.getContext('2d')
        // ctx.drawImage(mvRef.current, 0, 0, 854, 480)
        // cv.toBlob((blob) => {
        //     const storageRef = ref(storage, `roxanne/roxanne-${zeroPad(currFrame, 5)}.png`)
        //     uploadBytes(storageRef, blob)
        //     console.log(`getImg ${currFrame}`)
        // })
        
        mvRef.current.requestVideoFrameCallback(frameCallback)
    }, [getPoses, startFrame, storage, detector])

    const playMv = useCallback(() => {
        if (detector == null) { return }
        console.log('playMv')
        mvRef.current.requestVideoFrameCallback(frameCallback)
    }, [frameCallback, detector])

    const mvEnded = useCallback(() => {
        setStartFrame(frame)
        setFrame(frame - startFrame)
    }, [frame, startFrame])

    return (
        <>
            <> frame {frame} </>
            <Box>
                <Box sx={{
                    position: 'absolute',
                    width: '854',
                    height: '480',
                    top: 20,
                }}>
                    <video ref={mvRef} 
                        width={"854"} height={"480"} src={"roxanne.mov"}
                        onPlay={playMv}
                        onEnded={mvEnded}
                        muted={true}
                        // autoPlay={true}
                        controls={true}
                        hidden={true}
                    />
                </Box>

                {/* <Box sx={{
                    position: 'absolute',
                    width: '854',
                    height: '400',
                    top: 20,
                }}>
                    <canvas ref={cvRef} width={"854"} height={"480"}/>
                </Box> */}
            </Box>
        </>
    )
}


export default Uploader