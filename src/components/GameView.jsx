
import { Container, Typography } from '@mui/material'
import { getFirestore, doc, getDoc } from "firebase/firestore"

import MusicVideo from './MusicVideo'
import PoseCam from './PoseCam'
import fbApp from './Firestore'
import { useEffect, useState, useRef } from 'react'

import PoseHint from './PoseHint'

export default function GameView() {

    const songName = "roxanne"

		const songBpm = 117
		const songFps = 29.97
		const spacing = 60 / songBpm * songFps * 2
		const mvStartFrame = 197
	
		const zeroPad = (num, places) => String(num).padStart(places, '0')

		const frameArr = Array.from(Array(140), (_, i) => {
				const index = parseInt(i * spacing + mvStartFrame) 
				return `${songName}-${zeroPad(index, 5)}`
		})
		
		const refPoseIndex = useRef(0)
		const [poseArr, setPoseArr] = useState(null)

		const db = getFirestore(fbApp)

		useEffect(() => {
			// console.log(frameArr)

			const getPoseArr = async() => {

				const poseArrTemp = []

				const poseUrls = frameArr.map(async (urlKey, index) => {
					const poseRef = doc(db, 'mvs', 'roxanne', 'poses', urlKey)
					const poseSnap = await getDoc(poseRef)
					const frame = parseInt(urlKey.split('-')[1].split('.')[0])
					poseArrTemp[index] = {frame: frame, pose: poseSnap.data()}
					// console.log(`${urlKey}`)
				})

				await Promise.all(poseUrls)
				setPoseArr(poseArrTemp)
				console.log(poseArrTemp)
			}

			getPoseArr()
		}, [])

		const [userPose, setUserPose] = useState(null)

    return (
    <Container>
        {/* <Typography variant="h4" component="h2"> { songName }</Typography> */}
        <MusicVideo songName={songName} poseArr={poseArr} userPose={userPose} refPoseIndex={refPoseIndex}/>
				<PoseHint 
					pose={poseArr ? poseArr[refPoseIndex.current].pose.keypoints : null} 
					width={852 * 0.45}
					height={480 * 0.45} 
					color='white' 
					scale={0.8}
				/>
        <PoseCam setUserPose={setUserPose}/>

    </Container>
    )
}
