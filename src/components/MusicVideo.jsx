import assert from 'assert'
import { useRef, useState, useCallback, useEffect } from 'react'
import { Box } from '@mui/material'

export default function MusicVideo({ 
	mvUrl,
	songName,
	poseArr,
	userPose,
	refPoseIndex,
	setP1Score,
	p1Streak,
	targetPose,
	setTargetPose,
	globalMvRef,
	peerConn,
	}) {

	const mvRef = useRef()

  const [startFrame, setStartFrame] = useState(0)
	const [frame, setFrame] = useState(0)

	// const refPoseIndex = useRef(0)

	const poseLeeway = 5
	const poseOffset = 0

	const poseLoss = useRef(100)

	const frameCallback = useCallback((_, metadata) => {
		// console.log('frameCallback')
		const currFrame = metadata.presentedFrames - startFrame
		setFrame(currFrame)

		const i = refPoseIndex.current
		// console.log(i)

		if (poseArr != null && i < poseArr.length) {
			const targetFrame = poseArr[i].frame
			if (Math.abs(targetFrame - currFrame - poseOffset) <= poseLeeway) {
				// if (poseArr[i] != null) {
				if (poseArr[i].pose != null && poseArr[i].pose.keypoints != null) {
					setTargetPose(poseArr[i].pose.keypoints)
				}
				// } else {
					// console.log(targetFrame)
					// console.log(poseArr[i])
					// setTargetPose(null)
					// refPoseIndex.current += 1
				// }
			} else {
				if (currFrame > targetFrame + poseLeeway - poseOffset) {
					refPoseIndex.current += 1
					// console.log(poseLoss.current)
					if (poseLoss.current < 12) {
						setP1Score((s) => { return s + 10 })
						p1Streak.current += 1
					} else if (poseLoss.current < 24) {
						setP1Score((s) => { return s + 5 })
						p1Streak.current += 1
					} else {
						p1Streak.current = 0
					}

					poseLoss.current = 100
					// console.log(currFrame)
					// console.log(targetFrame)
					// console.log('\n')
				}
				setTargetPose(null)
			}
		} else {
			setTargetPose(null)
		}

    mvRef.current.requestVideoFrameCallback(frameCallback)
	}, [p1Streak, poseArr, refPoseIndex, setP1Score, setTargetPose, startFrame])

	const mvStart = useCallback(() => {
		console.log('mvStart')
		assert(poseArr != null)
    mvRef.current.requestVideoFrameCallback(frameCallback)
		const conn = peerConn.current
			if (conn != null) {
				conn.send({
					play: 'play',
				})
			}
	}, [frameCallback, peerConn, poseArr])

	const mvEnded = useCallback(() => {
		console.log('mvEnded')
		setStartFrame(frame)
		setFrame(frame - startFrame)
	}, [frame, startFrame])

	// useEffect(() => {
	// 	if (poseArr != null) {
	// 		mvRef.current.play()
	// 	}
	// }, [poseArr])

	useEffect(() => {
		globalMvRef.current = mvRef.current
	}, [globalMvRef])

	useEffect(() => {
		setP1Score(0)
		poseLoss.current = 100
		p1Streak.current = 0
		setTargetPose(null)
	}, [p1Streak, setP1Score, setTargetPose, songName])

	const dist2D = useCallback((p1, p2) => {
		// console.log(p1)
		// console.log(p2)
		const dx = p1.x - p2.x
		const dy = p1.y - p2.y
		return Math.sqrt(dx * dx + dy * dy)
	}, [])

	const featureVectorForPose = useCallback((pose) => {
		
		// normalization constant
		// console.log(pose)
		const n = dist2D(pose[6], pose[5]) / 2

		const f0 = dist2D(pose[ 0], pose[10]) / n // nose to right_hand
		const f1 = dist2D(pose[ 0], pose[ 9]) / n // nose to left_hand
		const f2 = dist2D(pose[10], pose[12]) / n // right_hand to right_waist
		const f3 = dist2D(pose[ 9], pose[11]) / n // left_hand to left_waist
		const f4 = dist2D(pose[10], pose[ 6]) / n // right_hand to right_shoulder
		const f5 = dist2D(pose[ 9], pose[ 5]) / n // left_hand to left_shoulder
		const f6 = dist2D(pose[10], pose[ 9]) / n // right hand to left hand

		return [f0, f1, f2, f3, f4, f5, f6]
	}, [dist2D])

	const scorePose = useCallback((p1, p2) => {
		const fv1 = featureVectorForPose(p1)
		const fv2 = featureVectorForPose(p2)

		const diff = [0,1,2,3,4,5,6].map((i) => {
			return fv1[i] - fv2[i]
		})
		// console.log(diff)

		const rms = diff.map((x) => { return x*x })
										.reduce((a, x) => { return a+x })
		return rms

	}, [featureVectorForPose])

	useEffect(() => {
		if (userPose != null && targetPose != null) {
			const candidateScore = scorePose(userPose, targetPose)
			poseLoss.current =  Math.min(poseLoss.current, candidateScore)
		}
	}, [scorePose, targetPose, userPose])

	return (
		<div style={{ position: 'relative' }}>			
			<Box sx={{ border: 4 }}>
				<video 
					src={mvUrl}
					ref={mvRef} 
					width="100%"
					onPlay={mvStart}
					onEnded={mvEnded}
					controls={true}
					// muted={true}
					// hidden={true}
					style={{
						aspectRatio: 16 / 9 
					}}
				/>
			</Box>
		</div>
	)
}
