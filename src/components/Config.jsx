import { useState } from 'react'
import { Box, Tabs, Tab } from '@mui/material'

import Uploader from './Uploader'
import Editor from './Editor'

export default function Config() {

	const [value, setValue] = useState(0)

	const handleChange = (event, newValue) => {
		setValue(newValue)
	}

	// const [songName, setSongName] = useState('roxanne')
	// const [songName, setSongName] = useState('lilac')
	const [songName, setSongName] = useState('bbibbi')
	// const [songName, setSongName] = useState('stay')

	return (
		// <Box sx={{ width: '100%' }}>
		// 	<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
		// 		<Tabs value={value} onChange={handleChange}>
    //       <Tab label="Uploader" value="1"/>
    //       <Tab label="Editor" value="2"/>
    //     </Tabs>
    //   </Box>
		// </Box>
		<Uploader songName={songName}></Uploader>
		// <Editor songName={songName}></Editor>
	)
}
