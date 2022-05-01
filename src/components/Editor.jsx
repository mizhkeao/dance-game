import { useEffect } from 'react'
import { Grid, Container, Typography, ImageList, ImageListItem, ImageListItemBar } from '@mui/material'
import { getStorage, ref, deleteObject } from "firebase/storage"

import AsyncImage from './AsyncImage'

export default function Editor() {

    // const [songName, setSongName] = useState('roxanne')
    const songName = 'roxanne'

    // function getRandomColor() {
    //     var letters = '0123456789ABCDEF';
    //     var color = '#';
    //     for (var i = 0; i < 6; i++) {
    //       color += letters[Math.floor(Math.random() * 16)];
    //     }
    //     console.log(color)
    //     return color;
    // }

    const zeroPad = (num, places) => String(num).padStart(places, '0')

    // const [frameArr, setFrameArr] = useState([])

    // useEffect(() => {
    //     const newArr = Array.from(Array(1000), (_, i) => { return `${songName}-${zeroPad(i, 5)}`})
    //     setFrameArr(newArr)
    //     console.log(frameArr)    
    // }, [])

    const songBpm = 117
    const songFps = 29.97
    const spacing = 60 / songBpm * songFps * 4
    const startFrame = 202

    // const spacing = 1
    // const startFrame = 29.97*6.74

    const frameArr = Array.from(Array(93), (_, i) => {
        const index = parseInt(i * spacing + startFrame) 
        return `${songName}-${zeroPad(index, 5)}`
    })

    useEffect(() => {
        console.log(frameArr)
    })

    const sleep = ms => new Promise(r => setTimeout(r, ms));

    useEffect(() => {
        // deleteOldPics()
    })

    const deleteOldPics = async () => {
        for (let i = 0; i < 5000; i ++) {
            const fileName = `roxanne/${songName}-${zeroPad(i, 4)}.png`
            deleteFile(fileName)
            await sleep(5)
        }
    }

    const storage = getStorage()

    const deleteFile = async (fileName) => {
        const fileRef = ref(storage, fileName)
        try {
            await deleteObject(fileRef)
            console.log(`deleted ${fileName}`)
        } catch(e) {
            console.log(e)   
        }
    }

    return (
        <Container>
        <Grid container spacing={2} margin={1}>
            <Grid item xs={12}>
                <Typography variant="h3" component="h2"> { songName }</Typography>
            </Grid>
            <Grid item xs={12}>
                <ImageList sx={{ width: '100%', height: '100%' }} cols={6} gap={4}>
                {frameArr.map((urlKey) => (
                    <ImageListItem key={urlKey}>
                        {/* <img alt={key} width="164" height="164" loading="lazy"></img>*/}
                        <AsyncImage urlKey={urlKey}></AsyncImage>
                        {/* <canvas height={164} width={164} style={{ backgroundColor: getRandomColor() }}></canvas> */}
                        <ImageListItemBar title={urlKey}/>
                    </ImageListItem>
                ))}
                </ImageList>
            </Grid>
        </Grid>
        </Container>
    )
}