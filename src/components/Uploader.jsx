import { createDetector, movenet, SupportedModels } from '@tensorflow-models/pose-detection'
import '@tensorflow/tfjs-backend-webgl'

import { useState, useCallback, useEffect, useRef } from 'react'

import Box from "@mui/material/Box"

import fbApp from "./Firestore"
import PoseCanvas from "./PoseCanvas"
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { getFirestore, doc, setDoc } from "firebase/firestore"


const Uploader = ({ songName }) => {

	const [startFrame, setStartFrame] = useState(0)
	const [frame, setFrame] = useState(0)
	const [detector, setDetector] = useState(null)
	
	const mvRef = useRef()
	const cvRef = useRef()

	useEffect(() => {
		mvRef.current.playbackRate = 0.5
		getDetector()
	}, [])
	
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
		} catch(e) {
			console.log(e)
		}
	}

	const [pose, setPose] = useState(null)

	// Get a reference to the storage service, which is used to create references in your storage bucket
	const storage = getStorage()

	// Uploading Poses to Firebase
	const db = getFirestore(fbApp)

	const detectPoses = useCallback(async (currFrame) => {
		// if (detector == null) { return }
		// console.log('getPoses')
		try {
			const poses = await detector.estimatePoses(mvRef.current)
			
			// !: upload frame pose data
			const pose = poses[0]
			const poseName = `${songName}-${zeroPad(currFrame, 5)}`
			const ref = doc(db, 'mvs', songName, 'poses', poseName)
			if (pose != null) {
				setPose(pose)
				setDoc(ref, {
						frame: currFrame,
						keypoints: pose.keypoints,
						score: pose.score,
				})
				console.log(`got pose for ${currFrame}`)
			} else {
				setDoc(ref, {
					frame: currFrame,
					keypoints: [],
					score: 1.0,
				})
				console.log(`null pose for ${currFrame}`)
			}
		} catch(e) {
				console.log(e)
		}
	}, [db, detector, frame, songName])

	const zeroPad = (num, places) => String(num).padStart(places, '0')

	const frameCallback = useCallback((_, metadata) => {
			// if (detector == null) { return }
			// console.log('frameCallback')
			// get pose of humans in video
			const currFrame = metadata.presentedFrames - startFrame
			detectPoses(currFrame)
			setFrame(currFrame)

			// !: upload frame image data
			// const cv = cvRef.current
			// const ctx = cv.getContext('2d')
			// ctx.drawImage(mvRef.current, 0, 0, 854, 480)
			// cv.toBlob(async (blob) => {
			//     const storageRef = ref(storage, `${songName}/${songName}-${zeroPad(currFrame, 5)}.png`)
			// 		try {
			// 			const currFrameUrl = await getDownloadURL(storageRef)
			// 			console.log(`${currFrameUrl} exists, skipping`)
			// 		} catch (e) {
			// 			uploadBytes(storageRef, blob)
			//     	console.log(`upload img ${currFrame}`)
			// 		}
			// })
			
			mvRef.current.requestVideoFrameCallback(frameCallback)
	}, [detector, startFrame, detectPoses, storage, songName])

	useEffect(() => {
		if (detector != null) {
			console.log('playMv')
			mvRef.current.play()
			mvRef.current.requestVideoFrameCallback(frameCallback)
		}
	}, [detector])

	// const playMv = useCallback(() => {
	// 		if (detector == null) { return }
	// 		console.log('playMv')
	// 		mvRef.current.requestVideoFrameCallback(frameCallback)
	// }, [frameCallback, detector])

	const mvEnded = useCallback(() => {
			setStartFrame(frame)
			setFrame(frame - startFrame)
	}, [frame, startFrame])

	// useEffect(() => {
	// 	console.log(`${songName}.mp4`)
	// }, [])
	
	return (
			<>
					<> frame {frame} </>
					<Box>
							<Box sx={{
									width: '854',
									height: '480',
									position: 'relative',
							}}>
									<video ref={mvRef} 
											width={"854"} height={"480"} 
											src={`/dance-game/${songName}.mp4`}
											// onPlay={playMv}
											onEnded={mvEnded}
											muted={true}
											autoPlay={true}
											controls={true}
											hidden={true}
									/>
									<canvas ref={cvRef} width={"854"} height={"480"}/>
									<PoseCanvas pose={pose} color='red' width='854' height='480' scale={0.64} sx={{
										position: 'absolute',
										top: 0,
										left: 0,
									}}/>
							</Box>
					</Box>
			</>
	)
}


export default Uploader