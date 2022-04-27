import { createDetector, movenet, SupportedModels } from '@tensorflow-models/pose-detection'
import '@tensorflow/tfjs-backend-webgl'

import { useState, useCallback, useEffect, useRef } from 'react'

import Box from "@mui/material/Box"

// import PoseCanvas from './PoseCanvas'
import assert from 'assert'
import { firestore } from "./Firestore"
import { getStorage, ref, uploadBytes } from "firebase/storage"

const MusicVideo = () => {

    const [startFrame, setStartFrame] = useState(0)
    const [frame, setFrame] = useState(0)
    const [detector, setDetector] = useState(null)
    
    const mvRef = useRef()
    const cvRef = useRef()

    useEffect(() => {
        mvRef.current.playbackRate = 1.0
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
            console.log('mv detector loaded.')
        } catch(e) {
          console.log(e)
        }
    }

    const [poses, setPoses] = useState([])

    // Get a reference to the storage service, which is used to create references in your storage bucket
    const storage = getStorage()

    const getPoses = useCallback(async (frame) => {
        assert(detector != null)
        try {
            const poses = await detector.estimatePoses(mvRef.current)
            console.log(poses[0])
            setPoses(poses)
        } catch(e) {
            console.log(e)
        }
    }, [detector])

    const zeroPad = (num, places) => String(num).padStart(places, '0')
    
    const frameCallback = useCallback((_, metadata) => {
        // get pose of humans in video
        const currFrame = metadata.presentedFrames - startFrame
        setFrame(currFrame)
        // getPoses(currFrame)

        const cv = cvRef.current
        const ctx = cv.getContext('2d')
        ctx.drawImage(mvRef.current, 0, 0, 854, 480)
        cv.toBlob((blob) => {
            const storageRef = ref(storage, `frames/roxanne-${zeroPad(currFrame, 4)}.png`)
            uploadBytes(storageRef, blob)
            console.log(`uploaded ${currFrame}`)
        })
        
        mvRef.current.requestVideoFrameCallback(frameCallback)
    }, [getPoses, startFrame, storage])

    const playMv = useCallback(() => {
        mvRef.current.requestVideoFrameCallback(frameCallback)
    }, [frameCallback,])

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
                    <video ref={mvRef} width={"854"} height={"480"} src={"roxanne.mov"} onPlay={playMv} onEnded={mvEnded} hidden={true} muted={true}/>
                    {/* <video ref={mvRef} width={"854"} height={"480"} src={"roxanne.mov"} onPlay={playMv} onEnded={mvEnded} controls={true}/> */}
                </Box>

                <Box sx={{
                    position: 'absolute',
                    width: '854',
                    height: '400',
                    top: 20,
                }}>
                    <canvas ref={cvRef} width={"854"} height={"480"}/>
                </Box>
            </Box>
        </>
    )
}

{/* <PoseCanvas poses={poses} width={"854"} height={"400"} color={"red"}/> */}

export default MusicVideo