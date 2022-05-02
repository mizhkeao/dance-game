
import { useState, useEffect, useRef, useCallback} from "react"

export default function PoseCanvas({ pose, color, width, height, scale }) {

    const cvRef = useRef(null)
    
    const drawLine = useCallback((ctx, p1, p2) => {
        if (p1 == null || p2 == null) { return }
        if (p1.x * scale < width && p2.x * scale < width && p1.y * scale < height && p2.y * scale < height) { 
          ctx.beginPath()
          ctx.moveTo(p1.x * scale, p1.y * scale)
          ctx.lineTo(p2.x * scale, p2.y * scale)
          ctx.stroke()
          ctx.closePath()
        }
    }, [scale, height, width])

    useEffect(() => {
        const canvas = cvRef.current
        const ctx = canvas.getContext('2d')
        ctx.clearRect(0, 0, width, height)
				ctx.fillStyle = 'rgba(0,0,0)'
				ctx.fillRect(0, 0, width, height)

        if (pose == null) { return }

        ctx.lineWidth = 3
        ctx.strokeStyle = color
        const p = pose.keypoints
				console.log(p)

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

    }, [pose, color, drawLine, height, width])

    return (
        <canvas ref={cvRef} width={width} height={height} />
    )
}
