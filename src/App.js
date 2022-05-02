import './App.css'

import { useState } from 'react'

import Config from './components/Config'
import GameView from './components/GameView'

import {
	BrowserRouter as Router,
	Routes,
	Route,
} from 'react-router-dom'

export default function App() {

	// const [songName, setSongName] = useState(null)

  return (
		<Router>
			<Routes>
			<Route path='/' element={ <GameView /> } />
			<Route path='/config' element={ <Config /> } />
			</Routes>
		</Router>
  );
}
