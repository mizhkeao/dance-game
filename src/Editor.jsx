import { useEffect, useState } from 'react'
import { Grid, Container, Typography, ImageList, ImageListItem } from '@mui/material'
import SelectInput from '@mui/material/Select/SelectInput';

export default function Editor() {

    // const [songName, setSongName] = useState('roxanne')
    const songName = 'roxanne'

    function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        console.log(color)
        return color;
    }


    const zeroPad = (num, places) => String(num).padStart(places, '0')

    // const [frameArr, setFrameArr] = useState([])

    // useEffect(() => {
    //     const newArr = Array.from(Array(1000), (_, i) => { return `${songName}-${zeroPad(i, 5)}`})
    //     setFrameArr(newArr)
    //     console.log(frameArr)    
    // }, [])

    const songBpm = 117
    const songFps = 29.97
    const spacing = 60 / songBpm * songFps

    const frameArr = Array.from(Array(100), (_, i) => {
        const index = parseInt(i * spacing * 4)
        return `${songName}-${zeroPad(index, 5)}`
    })

    useEffect(() => {
        console.log(frameArr)
    })

    return (
        <Container>
        <Grid container spacing={2} margin={2}>
            <Grid item xs={12}>
                <Typography variant="h3" component="h2"> { songName }</Typography>
            </Grid>
            <Grid item xs={12}>
                <ImageList sx={{ width: '100%', height: '100%' }} cols={10} rowHeight={164}>
                {frameArr.map((item) => (
                    <ImageListItem key={item}>
                        <canvas height={164} width={164} style={{ backgroundColor: getRandomColor() }}></canvas>
                    </ImageListItem>
                ))}
                </ImageList>
            </Grid>
        </Grid>
        </Container>
    )
}
