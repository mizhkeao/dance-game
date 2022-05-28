import React, { useRef, useState } from 'react'

import { Box, Button, Typography } from '@mui/material'
import CopyToClipboard from 'react-copy-to-clipboard'

export default function P2Cam({ peerId, hostId, p2Stream}) {
	
	const playP2Stream = () => {
		p2Stream.current.play()
	}

	return (
		<Box className='gradient-border' sx={{
			position: 'absolute',
			width: 384,
			height: 216,
			bottom: 32,
			right: 32,
			justifyContent: 'center',
			alignItems: 'center',
			backgroundColor: 'rgb(150,150,150)',
			display: 'flex',
			flexDirection: 'column',
			border: 4,
			borderColor: `${p2Stream.current && p2Stream.current.srcObject ? 'blue' : 'rgb(150,150,150)'}`,
		}}>
			{ peerId != null && hostId != null && hostId === peerId && (p2Stream.current && !p2Stream.current.srcObject) ?
				<CopyToClipboard text={ `${window.location.href}/${hostId}` }>
					<Button size="large" variant="container" disableElevation>
						Invite Player 2!
					</Button>
				</CopyToClipboard>
				: null
			}
			<video 
				ref={p2Stream} onLoadedMetadata={playP2Stream} style={{ 
				transform: 'scaleX(-1)',
				visibility: `${p2Stream.current && p2Stream.current.srcObject ? 'visible' : 'hidden'}`,
				borderRadius: 4,
			}}/>
		</Box>
	)
}
