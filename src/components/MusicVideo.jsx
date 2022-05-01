import assert from 'assert'
import { useRef, useState, useCallback, useEffect } from 'react'
import { Box, Typography } from '@mui/material'

import PoseCanvas from './PoseCanvas'

export default function MusicVideo({ songName, poseArr }) {

	const mvRef = useRef()

  const [startFrame, setStartFrame] = useState(0)
	const [frame, setFrame] = useState(0)

	const poseIndex = useRef(0)
  const [targetPose, setTargetPose] = useState(null)

	const poseLeeway = 6
	const poseOffset = 3

  const [score, setScore] = useState(0)

	const frameCallback = useCallback((_, metadata) => {
		// console.log('frameCallback')
		const currFrame = metadata.presentedFrames - startFrame
		setFrame(currFrame)

		const i = poseIndex.current
		// console.log(i)

		if (poseArr != null && i < poseArr.length) {
			const targetFrame = poseArr[i].frame
			if (Math.abs(targetFrame - currFrame - poseOffset) <= poseLeeway) {
				setTargetPose(poseArr[i].pose)
			} else {
				if (currFrame > targetFrame + poseLeeway - poseOffset) {
					poseIndex.current += 1
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
	}, [poseArr, poseIndex, startFrame])

	const mvStart = useCallback(() => {
		console.log('mvStart')
		assert(poseArr != null)
    mvRef.current.requestVideoFrameCallback(frameCallback)
	}, [frameCallback, poseArr])

	const mvEnded = useCallback(() => {
		console.log('mvEnded')
		setStartFrame(frame)
		setFrame(frame - startFrame)
	}, [frame, startFrame])

	useEffect(() => {
		if (poseArr != null) {
			mvRef.current.play()
		}
	}, [poseArr])

	return (
		<div style={{ position: 'relative'}}>
			<Typography variant="h5" component="h2"> { `SCORE: ${score}` }</Typography>
			<Typography variant="h7" component="h2"> { `frame ${frame}, pose ${poseIndex.current}` }</Typography>
			<video 
				src={`${songName}.mov`}
				ref={mvRef} 
				width="100%"
				onPlay={mvStart}
				onEnded={mvEnded}
				// controls={true}
				// muted={true}
				// hidden={true}
				style={{
					aspectRatio: 16 / 9 
				}}
			/>
			<PoseCanvas 
				pose={targetPose} 
				width={852 * 0.5}
				height={480 * 0.5} 
				color='red' 
				scale={0.5}
				/>
		</div>
	)
}
