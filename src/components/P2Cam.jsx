import React, { useRef, useState } from 'react'

import { Box, Button, Typography } from '@mui/material'

export default function P2Cam({ hostId, p2Stream}) {

	const [waitingForP2, setWaitingForP2] = useState(false)
	
	const playP2Stream = () => {
		p2Stream.current.play()
	}

	return (
		<Box sx={{ 
			position: 'absolute',
			backgroundColor: 'white',
			width: 384,
			height: 216,
			bottom: 0,
			right: 0,
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			visibility: `${p2Stream.current && p2Stream.current.srcObject ? 'visible' : 'hidden'}`,
			border: 4,
			borderColor: 'blue',
			transform: 'scaleX(-1)',
		}}>
		<video ref={p2Stream} onLoadedMetadata={playP2Stream} />
			{/* <Button 
				size="large" 
				variant="container" 
				disableElevation 
				onClick={invitePlayer2}
				loading={waitingForP2}
			>
				Invite Player 2
			</Button>
			{ peerRef.current != null && <Typography> { peerRef.current.id } </Typography> } */}
		</Box>
	)
}
