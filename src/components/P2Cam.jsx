import React, { useRef, useState } from 'react'

import { Box, Button, Typography } from '@mui/material'
import CopyToClipboard from 'react-copy-to-clipboard'

export default function P2Cam({ peerId, hostId, p2Stream}) {
	
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
			border: 4,
			borderColor: `${p2Stream.current && p2Stream.current.srcObject ? 'blue' : 'rgb(190,190,190)'}`,
		}}>
			{ peerId != null && hostId != null && hostId === peerId && (p2Stream.current && !p2Stream.current.srcObject) ?
				<CopyToClipboard text={ `${window.location.href}/${hostId}` }>
					<Button size="large" variant="container" disableElevation>
						Invite Player 2!
					</Button>
				</CopyToClipboard>
				: null
			}
			<video ref={p2Stream} onLoadedMetadata={playP2Stream} style={{ 
				transform: 'scaleX(-1)',
				visibility: `${p2Stream.current && p2Stream.current.srcObject ? 'visible' : 'hidden'}`
			}}/>
		</Box>
	)
}
