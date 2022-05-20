import './App.css'

import Config from './components/Config'
import GameView from './components/GameView'
import { ThemeProvider, createTheme } from '@mui/material/styles'

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

  return (
		<ThemeProvider theme={darkTheme}>
			<Router basename="/dance-game">
				<Routes>
					<Route path='/' element={ <GameView/> } />
					<Route path='/config' element={ <Config /> } />
					<Route path='/:hostId' element={ <GameView/> } />
				</Routes>
			</Router>
		</ThemeProvider>
  );
}
