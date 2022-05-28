import './App.css'

import Editor from './components/Editor'
import Uploader from './components/Uploader'
import GameView from './components/GameView'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { useState } from 'react'

import {
	BrowserRouter as Router,
	Routes,
	Route,
} from 'react-router-dom'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});


export default function App() {

	// const [songName, setSongName] = useState('roxanne')
	// const [songName, setSongName] = useState('lilac')
	// const [songName, setSongName] = useState('bbibbi')
	const [songName, setSongName] = useState('old-town-road')

  return (
		<ThemeProvider theme={darkTheme}>
			<Router basename="/dance-game">
				<Routes>
					<Route path='/' element={ <GameView/> } />
					<Route path='/:hostId' element={ <GameView/> } />
					<Route path='/upload' element={ <Uploader songName={songName}/> } />
					<Route path='/editor' element={ <Editor songName={songName}/> } />
				</Routes>
			</Router>
		</ThemeProvider>
  );
}
