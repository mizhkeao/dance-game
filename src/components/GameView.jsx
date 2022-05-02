
import { Container, FormControl, Select, MenuItem } from '@mui/material'
import { getFirestore, doc, getDoc } from "firebase/firestore"
import { getStorage, getDownloadURL, ref } from "firebase/storage"

import MusicVideo from './MusicVideo'
import PoseCam from './PoseCam'
import fbApp from './Firestore'
import { useEffect, useState, useRef } from 'react'

import PoseHint from './PoseHint'

export default function GameView() {

    const [songName, setSongName] = useState('')

		const db = getFirestore(fbApp)
		const storage = getStorage()
		const [mvUrl, setMvUrl] = useState(null)

		const zeroPad = (num, places) => String(num).padStart(places, '0')
	
		const [poseArr, setPoseArr] = useState(null)

		useEffect(() => {

			const setSong = async (songName) => {

				const songRef = doc(db, 'mvs', songName)
				const songSnap = await getDoc(songRef)
				const song = songSnap.data()

				console.log(song)
		
				const frameArr = Array.from(Array(song.moves), (_, i) => {
						const framesPerBeat = (60 * song.fps ) / song.bpm
						const spacing = framesPerBeat * song.time_sig
						const index = parseInt(i * spacing + song.startFrame)
						return `${songName}-${zeroPad(index, 5)}`
				})
				const poseArrTemp = []
	
				const poseUrls = frameArr.map(async (urlKey, index) => {
					const poseRef = doc(db, 'mvs', songName, 'poses', urlKey)
					const poseSnap = await getDoc(poseRef)
					const frame = parseInt(urlKey.split('-')[1].split('.')[0])
					poseArrTemp[index] = {frame: frame, pose: poseSnap.data()}
					// console.log(`${urlKey}`)
				})

				await Promise.all(poseUrls)
				console.log(poseArrTemp)
				setPoseArr(poseArrTemp)

				const mvUrl = await getDownloadURL(ref(storage, `${songName}.mp4`))
				console.log(mvUrl)
				setMvUrl(mvUrl)
			}
	
			setSong(songName)

		}, [db, songName])

		
		const refPoseIndex = useRef(0)
		const [userPose, setUserPose] = useState(null)
  	const [targetPose, setTargetPose] = useState(null)

    return (
    <Container>
			<FormControl fullWidth>
					<Select
						value={songName}
						label="Song"
						onChange={(e) => {setSongName(e.target.value)}}
					>
						{/* <MenuItem value={''}>
  						<em>None</em>
						</MenuItem> */}
						<MenuItem value={'roxanne'}> Roxanne - Arizona Zervas</MenuItem>
						<MenuItem value={'lilac'}> Lilac - IU </MenuItem>
					</Select>
			</FormControl>
			{/* <Typography variant="h4" component="h2"> { songName }</Typography> */}
			<MusicVideo 
				mvUrl={mvUrl} 
				songName={songName} 
				poseArr={poseArr} 
				userPose={userPose} 
				refPoseIndex={refPoseIndex}
				targetPose={targetPose}
				setTargetPose={setTargetPose}
			/>
			<PoseHint 
				pose={targetPose}
				width={384}
				height={216} 
				color='white' 
				scale={0.5}
			/>
			<PoseCam setUserPose={setUserPose}/>

    </Container>
    )
}
