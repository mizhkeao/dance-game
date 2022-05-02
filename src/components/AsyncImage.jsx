import { useState, useEffect, useRef, useCallback} from "react"
import { getStorage, ref, getDownloadURL } from "firebase/storage"
import { getFirestore, doc, getDoc } from "firebase/firestore"
import { Box } from "@mui/material"

import fbApp from "./Firestore"

export default function AsyncImage({ songName, urlKey }) {

    const storage = getStorage()
    const db = getFirestore(fbApp)

    const [url, setUrl] = useState(null)
    const [pose, setPose] = useState(null)

    const cvRef = useRef(null)

    const r = 320/1280

    const drawLine = useCallback((ctx, p1, p2) => {
        if (p1 && p2) { 
          ctx.beginPath()
          ctx.moveTo(p1.x * r, p1.y * r)
          ctx.lineTo(p2.x * r, p2.y * r)
          ctx.stroke()
          ctx.closePath()
        }
    }, [r])

    useEffect(() => {
        setUrl(null)
        setPose(null)

        // console.log(urlKey)
        if (urlKey) {
            const getImgUrl = async (urlKey) => {
                // console.log(urlKey)
                try {
                    const url = await getDownloadURL(ref(storage, `${songName}/${urlKey}.png`))
                    setUrl(url)
                } catch(e) {
                    console.log(e)
                }
            }

            const getPoseUrl = async (urlKey) => {
                const poseRef = doc(db, 'mvs', songName, 'poses', urlKey)
                try {
                    const poseSnap = await getDoc(poseRef)
                    setPose(poseSnap.data())
                } catch(e) {
                    console.log(e)
                }
            }

            console.log(urlKey)
            getImgUrl(urlKey)
            getPoseUrl(urlKey)
        }
    }, [db, storage, songName, urlKey])

    useEffect(() => {
        if (pose == null) { return }
        const ctx = cvRef.current.getContext('2d')
        ctx.clearRect(0, 0, 320, 180)
        ctx.lineWidth = 2
        ctx.strokeStyle = 'red'

        const p = pose.keypoints

        // head
        drawLine(ctx, p[ 4], p[ 2])
        drawLine(ctx, p[ 2], p[ 0])
        drawLine(ctx, p[ 0], p[ 1])
        drawLine(ctx, p[ 1], p[ 3])

        // torso and arms
        drawLine(ctx, p[10], p[ 8])
        drawLine(ctx, p[ 8], p[ 6])
        drawLine(ctx, p[ 8], p[ 6])
        drawLine(ctx, p[ 6], p[ 5])
        drawLine(ctx, p[ 5], p[ 7])
        drawLine(ctx, p[ 7], p[ 9])
        drawLine(ctx, p[ 7], p[ 9])
        drawLine(ctx, p[ 6], p[12])
        drawLine(ctx, p[ 5], p[11])
        drawLine(ctx, p[12], p[11])

        drawLine(ctx, p[12], p[14])
        drawLine(ctx, p[14], p[16])
        drawLine(ctx, p[11], p[13])
        drawLine(ctx, p[13], p[15])

    }, [drawLine, pose])

    return (
        <Box>
            <img src={url} alt={urlKey} width="320" height="180" hidden={ url==null } loading='lazy'/>
            <canvas ref={cvRef} width="320" height="180" style={{ 
                position: 'absolute',
                top: 0,
                left: 0,
            }} 
            hidden={ pose==null }/>
        </Box>
    )
}