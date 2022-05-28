
import { getFirestore, doc, getDoc } from "firebase/firestore"
import { getStorage, getDownloadURL, ref } from "firebase/storage"
import { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import Peer from 'peerjs'

import { Container, FormControl, Select, MenuItem, Typography, Box } from '@mui/material'

import MusicVideo from './MusicVideo'
import P1Cam from './P1Cam'
import P2Cam from './P2Cam'
import fbApp from './Firestore'

export default function GameView() {

    const [songName, setSongName] = useState('')

		const db = getFirestore(fbApp)
		const storage = getStorage()
		const [mvUrl, setMvUrl] = useState(null)

		const zeroPad = (num, places) => String(num).padStart(places, '0')
	
		const [poseArr, setPoseArr] = useState(null)
		const [hostId, setHostId] = useState(null)

		const peerRef = useRef()
		const [p1Stream, setP1Stream] = useState(null)
		const p2Stream = useRef()

		const params = useParams()
		const [call, setCall] = useState(null)
		const peerConn = useRef()

		const [p1Score, setP1Score] = useState(0)
		const p1Streak = useRef(0)
	
		const [p2Score, setP2Score] = useState(0)
		const [p2Streak, setP2Streak] = useState(0)

		const globalMvRef = useRef()

		useEffect(() => {
			if (p1Stream == null) { return }

			const hostId = params.hostId 
			peerRef.current = new Peer()

			peerRef.current.on('open', (id) => {
				
				if (hostId == null) {
					console.log(`I'm the host, my id is ${id}!`)
					setHostId(peerRef.current.id)
					
					// * I'm the host
					peerRef.current.on('call', (call) => {
						setCall(call)
						call.answer(p1Stream)
					})

					peerRef.current.on('connection', (conn) => {
						peerConn.current = conn

						conn.on('data', (data) => {
							console.log(data)
							if (data['songName'] != null) {
								setSongName(data['songName'])
							} else if (data['play'] != null) {
								globalMvRef.current.play()
							} else {
								setP2Score(data['score'])
								setP2Streak(data['streak'])
							}
						})
					})
					
				} else {
					console.log(`I'm the client, my id is ${id}!`)
					
					console.log(`The host is ${hostId}!`)
					setHostId(hostId)

					// * client call host
					const call = peerRef.current.call(hostId, p1Stream)
					setCall(call)

					const conn = peerRef.current.connect(hostId)
					peerConn.current = conn
					conn.on('data', (data) => {
						console.log(data)
						if (data['songName'] != null) {
							setSongName(data['songName'])
						} else if (data['play'] != null) {
							globalMvRef.current.play()
						} else {
							setP2Score(data['score'])
							setP2Streak(data['streak'])
						}
					})
				}

			});

		}, [p1Stream, params.hostId])

		useEffect(() => {
			const conn = peerConn.current
			if (conn != null) {
				conn.send({
					score: p1Score,
					streak: p1Streak.current,
				})
			}
		}, [p1Score])
		
		useEffect(() => {
			const conn = peerConn.current
			if (conn != null) {
				conn.send({
					songName: songName,
				})
			}
		}, [songName])

		useEffect(() => {
			if (call == null) { return }

			call.on('stream', (remoteStream) => {
				p2Stream.current.srcObject = remoteStream
			})
			call.on('close', () => {
				p2Stream.current.srcObject = null
			})
		}, [call])

		useEffect(() => {
			const setSong = async (songName) => {
				if (songName === '') { return }
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
					const frame = parseInt(urlKey.split('-').slice(-1)[0])
					const framePose = {frame: frame, pose: poseSnap.data()}
					if (framePose.pose == null) {
						 console.log(`\n\n${framePose}\n\n`)
					}
					poseArrTemp[index] = framePose
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
			console.log(`songName = ${songName}`)

		}, [db, songName, storage])

		const refPoseIndex = useRef(0)
		const [userPose, setUserPose] = useState(null)
  	const [targetPose, setTargetPose] = useState(null)

		const percentScore = (score) => {
			const perfectScore = (refPoseIndex.current) * 10
			return parseInt( 100 * score / (perfectScore === 0 ? 1 : perfectScore))
		}

    return (
			<Box sx={{ backgroundColor: 'rgb(18,18,18)' }}>
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
							<MenuItem value={'bbibbi'}> Bbibbi - IU </MenuItem>
							<MenuItem value={'old-town-road'}> Old Town Road - Lil Nas X </MenuItem>
						</Select>
				</FormControl>
				<Box sx={{ display: 'flex', flexDirection: 'horizontal', alignItems: 'stretch' }}>
					<Box sx={{ display: 'flex', flexDirection: 'row', flexGrow: '1' }}>
						<Box sx={{ display: 'flex', flexDirection: 'column'}}>
							<Typography align="left" variant="h5" component="h2" color="red"> { `Player 1` } </Typography>
							<Typography align="left" variant="h5" component="h2" color="red"> { `Score: ${ percentScore(p1Score) }%` } </Typography>
							<Typography align="left" variant="h5" component="h2" color="red"> { `Streak: ${ p1Streak.current }` } </Typography>
						</Box>
					</Box>
					{ call != null && 
						<Box sx={{ display: 'flex', flexDirection: 'row-reverse', flexGrow: '1' }}>
						<Box sx={{ display: 'flex', flexDirection: 'column' }}>
							<Typography align="right" variant="h5" component="h2" color="blue"> { `Player 2` } </Typography>
							<Typography align="right" variant="h5" component="h2" color="blue"> { `Score: ${ percentScore(p2Score) }%` } </Typography>
							<Typography align="right" variant="h5" component="h2" color="blue"> { `Streak: ${ p2Streak }` } </Typography>
						</Box>
					</Box>
					}
				</Box>
				<MusicVideo 
					mvUrl={mvUrl}
					songName={songName} 
					poseArr={poseArr} 
					userPose={userPose} 
					refPoseIndex={refPoseIndex}
					setP1Score={setP1Score}
					p1Streak={p1Streak}
					targetPose={targetPose}
					setTargetPose={setTargetPose}
					globalMvRef={globalMvRef}
					peerConn={peerConn}
				/>
				{/* <PoseHint 
					pose={targetPose}
					width={384}
					height={216} 
					color='white' 
					scale={0.5}
				/> */}
				<P1Cam setUserPose={setUserPose} setP1Stream={setP1Stream}/>
				<P2Cam peerId={peerRef.current?.id} hostId={hostId} p2Stream={p2Stream} />

			</Container>
		</Box>
    )
}
