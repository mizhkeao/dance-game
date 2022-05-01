
import { Container, Typography } from '@mui/material'

import PoseCam from './PoseCam'

export default function GameView() {

    const songName = "roxanne"

    return (
    <Container>
        <Typography variant="h4" component="h2"> { songName }</Typography>
        <PoseCam />
    </Container>
    )
}
