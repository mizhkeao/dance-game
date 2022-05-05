
import { useState, useEffect, useRef, useCallback} from "react"

export default function PoseCanvas({pose, color, width, height, scale}) {

    const cvRef = useRef(null)
    
		const drawPoint = useCallback((ctx, p, mid) => {
			ctx.beginPath()
			ctx.arc((p.x - mid.x) * scale, (p.y - mid.y) * scale, 2, 0, 2 * Math.PI)
			ctx.fill()
			ctx.stroke()
			ctx.closePath()
		}, [scale])

    const drawLine = useCallback((ctx, p1, p2, mid) => {
        if (p1 == null || p2 == null) { return }
				ctx.beginPath()
				ctx.moveTo((p1.x - mid.x) * scale, (p1.y - mid.y) * scale)
				ctx.lineTo((p2.x - mid.x) * scale, (p2.y - mid.y) * scale)
				ctx.stroke()
				ctx.closePath()
    }, [scale])

		useEffect(() => {
			const canvas = cvRef.current
			const ctx = canvas.getContext('2d')
			ctx.fillStyle = 'rgba(0,0,0,0.8)'
			ctx.fillRect(0, 0, width, height)
		}, [])

    useEffect(() => {
				// const canvas = cvRef.current
				// const ctx = canvas.getContext('2d')
				if (pose == null) {
					// ctx.fillStyle = 'rgba(0,0,0,0.3)'
					// ctx.fillRect(0, 0, width, height)
					return 
				}
				const canvas = cvRef.current
				const ctx = canvas.getContext('2d')
        ctx.clearRect(0, 0, width, height)
				ctx.fillStyle = 'rgba(0,0,0,0.8)'
				ctx.fillRect(0, 0, width, height)

        ctx.lineWidth = 3
        ctx.strokeStyle = color
				ctx.fillStyle = color
				// console.log(pose)
        const p = pose

				const midx = (p[6].x + p[5].x + p[12].x + p[11].x) / 4 - width/2 - 216
				const midy = (p[6].y + p[5].y + p[12].y + p[11].y) / 4 - height/2 - 48
				const mid = {x: midx, y: midy}

        // head
        // drawLine(ctx, p[ 4], p[ 2], mid)
        // drawLine(ctx, p[ 2], p[ 0], mid)
        // drawLine(ctx, p[ 0], p[ 1], mid)
        // drawLine(ctx, p[ 1], p[ 3], mid)

        // torso and arms
        drawLine(ctx, p[10], p[ 8], mid)
        drawLine(ctx, p[ 8], p[ 6], mid)
        drawLine(ctx, p[ 8], p[ 6], mid)
        drawLine(ctx, p[ 6], p[ 5], mid)
        drawLine(ctx, p[ 5], p[ 7], mid)
        drawLine(ctx, p[ 7], p[ 9], mid)
        drawLine(ctx, p[ 7], p[ 9], mid)
        drawLine(ctx, p[ 6], p[12], mid)
        drawLine(ctx, p[ 5], p[11], mid)
        drawLine(ctx, p[12], p[11], mid)

        drawLine(ctx, p[12], p[14], mid)
        drawLine(ctx, p[14], p[16], mid)
        drawLine(ctx, p[11], p[13], mid)
        drawLine(ctx, p[13], p[15], mid)

				// drawPoints
				// drawPoint(ctx, p[0], mid)
				// drawPoint(ctx, p[1], mid)
				// drawPoint(ctx, p[2], mid)
				// drawPoint(ctx, p[3], mid)
				// drawPoint(ctx, p[4], mid)
				ctx.beginPath()
				ctx.arc((p[0].x - mid.x) * scale, (p[0].y - mid.y) * scale, 17 * scale, 0, 2 * Math.PI)
				ctx.stroke()
				ctx.closePath()

				drawPoint(ctx, p[5], mid)
				drawPoint(ctx, p[6], mid)
				drawPoint(ctx, p[7], mid)
				drawPoint(ctx, p[8], mid)
				drawPoint(ctx, p[9], mid)
				drawPoint(ctx, p[10], mid)
				drawPoint(ctx, p[11], mid)
				drawPoint(ctx, p[12], mid)
				drawPoint(ctx, p[13], mid)
				drawPoint(ctx, p[14], mid)
				drawPoint(ctx, p[15], mid)
				drawPoint(ctx, p[16], mid)

    }, [pose, color, drawLine, height, width])

    return (
        <canvas ref={cvRef} width={width} height={height} 
					style={{
						position: 'absolute',
						top: 0,
						right: 0,
					}}
				/>
    )
}
