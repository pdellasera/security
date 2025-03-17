"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"

interface CameraSimulationProps {
  width?: number
  height?: number
  cameraName?: string
  cameraId?: string
  noiseLevel?: number
  showTimestamp?: boolean
  showCameraInfo?: boolean
  motionFrequency?: number
  isOffline?: boolean
  cameraType?: "outdoor" | "indoor" | "thermal" | "night"
}

const CameraSimulation: React.FC<CameraSimulationProps> = ({
  width = 640,
  height = 360,
  cameraName = "CAM-01",
  cameraId = "CCTV-1",
  noiseLevel = 0.05,
  showTimestamp = true,
  showCameraInfo = true,
  motionFrequency = 0.2,
  isOffline = false,
  cameraType = "outdoor",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const requestIdRef = useRef<number>(0)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isPlaying, setIsPlaying] = useState(true)

  // Simulated objects for motion
  const objectsRef = useRef<
    Array<{
      x: number
      y: number
      size: number
      speed: number
      direction: number
      type: "person" | "vehicle" | "animal"
    }>
  >([])

  // Background elements
  const backgroundRef = useRef<
    Array<{
      x: number
      y: number
      width: number
      height: number
      type: "building" | "tree" | "road" | "desk" | "chair" | "wall"
    }>
  >([])

  // Initialize simulated environment based on camera type
  useEffect(() => {
    // Clear previous objects
    objectsRef.current = []
    backgroundRef.current = []

    // Create background elements based on camera type
    if (cameraType === "outdoor") {
      // Add buildings
      backgroundRef.current.push(
        { x: 50, y: 50, width: 200, height: 150, type: "building" },
        { x: 400, y: 80, width: 180, height: 120, type: "building" },
        { x: 0, y: 200, width: width, height: 20, type: "road" },
        { x: 300, y: 30, width: 50, height: 80, type: "tree" },
        { x: 100, y: 30, width: 40, height: 70, type: "tree" },
      )
    } else if (cameraType === "indoor") {
      // Add office/indoor elements
      backgroundRef.current.push(
        { x: 0, y: 0, width: width, height: height, type: "wall" },
        { x: 100, y: 150, width: 120, height: 80, type: "desk" },
        { x: 250, y: 180, width: 50, height: 60, type: "chair" },
        { x: 400, y: 150, width: 120, height: 80, type: "desk" },
        { x: 450, y: 180, width: 50, height: 60, type: "chair" },
      )
    }

    // Create 1-3 random moving objects
    const objectCount = Math.floor(Math.random() * 3) + 1
    const objectTypes: Array<"person" | "vehicle" | "animal"> = ["person", "vehicle", "animal"]

    for (let i = 0; i < objectCount; i++) {
      objectsRef.current.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 20 + 10,
        speed: Math.random() * 1 + 0.5,
        direction: Math.random() * Math.PI * 2,
        type: objectTypes[Math.floor(Math.random() * objectTypes.length)],
      })
    }
  }, [width, height, cameraType])

  // Update timestamp every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Main animation loop
  useEffect(() => {
    if (!canvasRef.current || !isPlaying) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const animate = () => {
      if (!ctx) return

      // Clear canvas
      ctx.clearRect(0, 0, width, height)

      if (isOffline) {
        // Draw "No Signal" pattern
        drawNoSignal(ctx, width, height)
      } else {
        // Draw base video simulation
        drawVideoSimulation(ctx, width, height, noiseLevel, cameraType)

        // Draw background elements
        drawBackground(ctx)

        // Draw moving objects with probability based on motionFrequency
        if (Math.random() < motionFrequency) {
          updateAndDrawObjects(ctx)
        }

        // Add camera effects based on type
        applyCameraEffects(ctx, width, height, cameraType)

        // Add scan line effect
        drawScanLines(ctx, width, height)

        // Add timestamp
        if (showTimestamp) {
          drawTimestamp(ctx, width, height, currentTime)
        }

        // Add camera info
        if (showCameraInfo) {
          drawCameraInfo(ctx, width, height, cameraName)
        }
      }

      requestIdRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(requestIdRef.current)
    }
  }, [
    width,
    height,
    noiseLevel,
    showTimestamp,
    showCameraInfo,
    currentTime,
    cameraName,
    cameraId,
    isPlaying,
    isOffline,
    motionFrequency,
    cameraType,
  ])

  // Draw functions
  const drawVideoSimulation = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    noiseLevel: number,
    cameraType: string,
  ) => {
    // Draw base background based on camera type
    if (cameraType === "night") {
      // Dark blue-green tint for night vision
      ctx.fillStyle = "#001a1a"
      ctx.fillRect(0, 0, width, height)
    } else if (cameraType === "thermal") {
      // Black background for thermal
      ctx.fillStyle = "#000"
      ctx.fillRect(0, 0, width, height)
    } else {
      // Standard dark gray for normal cameras
      ctx.fillStyle = "#111"
      ctx.fillRect(0, 0, width, height)
    }

    // Add noise
    const imageData = ctx.getImageData(0, 0, width, height)
    const data = imageData.data

    for (let i = 0; i < data.length; i += 4) {
      // Random noise
      const noise = Math.random() * noiseLevel * 255

      if (cameraType === "night") {
        // Green tint for night vision
        data[i] += noise * 0.2 // R
        data[i + 1] += noise // G
        data[i + 2] += noise * 0.2 // B
      } else if (cameraType === "thermal") {
        // No noise for thermal, will add heat patterns later
      } else {
        // Standard noise
        data[i] += noise // R
        data[i + 1] += noise // G
        data[i + 2] += noise // B
      }
    }

    ctx.putImageData(imageData, 0, 0)
  }

  const drawBackground = (ctx: CanvasRenderingContext2D) => {
    backgroundRef.current.forEach((element) => {
      ctx.globalAlpha = 0.3

      if (element.type === "building") {
        ctx.fillStyle = "#555"
        ctx.fillRect(element.x, element.y, element.width, element.height)

        // Windows
        ctx.fillStyle = "#888"
        const windowSize = 15
        const windowGap = 25
        for (let x = element.x + 20; x < element.x + element.width - 20; x += windowGap) {
          for (let y = element.y + 20; y < element.y + element.height - 20; y += windowGap) {
            ctx.fillRect(x, y, windowSize, windowSize)
          }
        }
      } else if (element.type === "road") {
        ctx.fillStyle = "#333"
        ctx.fillRect(element.x, element.y, element.width, element.height)

        // Road markings
        ctx.fillStyle = "#aaa"
        const markingWidth = 30
        const markingGap = 40
        for (let x = element.x; x < element.x + element.width; x += markingWidth + markingGap) {
          ctx.fillRect(x, element.y + element.height / 2 - 2, markingWidth, 4)
        }
      } else if (element.type === "tree") {
        // Tree trunk
        ctx.fillStyle = "#543"
        ctx.fillRect(element.x + element.width / 2 - 5, element.y + element.height / 2, 10, element.height / 2)

        // Tree top
        ctx.fillStyle = "#363"
        ctx.beginPath()
        ctx.arc(element.x + element.width / 2, element.y + element.height / 3, element.width / 2, 0, Math.PI * 2)
        ctx.fill()
      } else if (element.type === "wall") {
        ctx.fillStyle = "#eee"
        ctx.fillRect(element.x, element.y, element.width, element.height)
      } else if (element.type === "desk") {
        ctx.fillStyle = "#964"
        ctx.fillRect(element.x, element.y, element.width, element.height)
      } else if (element.type === "chair") {
        ctx.fillStyle = "#446"
        ctx.fillRect(element.x, element.y, element.width, element.height)
      }

      ctx.globalAlpha = 1.0
    })
  }

  const applyCameraEffects = (ctx: CanvasRenderingContext2D, width: number, height: number, cameraType: string) => {
    if (cameraType === "night") {
      // Add night vision effect (green tint and noise)
      ctx.fillStyle = "rgba(0, 255, 0, 0.1)"
      ctx.fillRect(0, 0, width, height)

      // Add light amplification artifacts
      if (Math.random() < 0.03) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.3)"
        ctx.beginPath()
        const x = Math.random() * width
        const y = Math.random() * height
        const radius = Math.random() * 30 + 10
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.fill()
      }
    } else if (cameraType === "thermal") {
      // Add thermal imaging effect
      // Create random heat sources
      for (let i = 0; i < 10; i++) {
        const x = Math.random() * width
        const y = Math.random() * height
        const radius = Math.random() * 40 + 20

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
        gradient.addColorStop(0, "rgba(255, 0, 0, 0.5)")
        gradient.addColorStop(0.5, "rgba(255, 255, 0, 0.3)")
        gradient.addColorStop(1, "rgba(0, 0, 255, 0.1)")

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.fill()
      }

      // Add thermal camera overlay
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)"
      ctx.fillRect(0, 0, width, height)
    }
  }

  const drawScanLines = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.globalAlpha = 0.1

    for (let y = 0; y < height; y += 2) {
      ctx.fillStyle = "#000"
      ctx.fillRect(0, y, width, 1)
    }

    // Occasional horizontal distortion
    if (Math.random() < 0.05) {
      const y = Math.random() * height
      const h = Math.random() * 5 + 1
      ctx.fillStyle = "#fff"
      ctx.globalAlpha = 0.1
      ctx.fillRect(0, y, width, h)
    }

    ctx.globalAlpha = 1.0
  }

  const drawTimestamp = (ctx: CanvasRenderingContext2D, width: number, height: number, date: Date) => {
    const timeString = date.toLocaleTimeString()
    const dateString = date.toLocaleDateString()

    ctx.font = "16px monospace"
    ctx.fillStyle = "#fff"
    ctx.strokeStyle = "#000"
    ctx.lineWidth = 2
    ctx.textBaseline = "bottom"
    ctx.textAlign = "right"

    // Draw text with outline for better visibility
    ctx.strokeText(`${dateString} ${timeString}`, width - 10, height - 10)
    ctx.fillText(`${dateString} ${timeString}`, width - 10, height - 10)
  }

  const drawCameraInfo = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    cameraName: string,
    // cameraId: string,
    // cameraType: string,
  ) => {
    ctx.font = "14px sans-serif"
    ctx.fillStyle = "#fff"
    ctx.strokeStyle = "#000"
    ctx.lineWidth = 2
    ctx.textBaseline = "bottom"
    ctx.textAlign = "left"

    // Crear un fondo semitransparente para el texto
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
    ctx.fillRect(0, height - 24, width, 24)

    // Escribir el nombre de la cámara
    ctx.fillStyle = "#fff"
    ctx.font = "12px sans-serif"
    const text = cameraName
    ctx.fillText(text, 8, height - 8)
  }

  const drawNoSignal = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Draw static noise pattern
    const imageData = ctx.createImageData(width, height)
    const data = imageData.data

    for (let i = 0; i < data.length; i += 4) {
      const value = Math.random() * 255

      data[i] = value // R
      data[i + 1] = value // G
      data[i + 2] = value // B
      data[i + 3] = 255 // A
    }

    ctx.putImageData(imageData, 0, 0)

    // Draw "NO SIGNAL" text
    ctx.font = "bold 32px sans-serif"
    ctx.fillStyle = "#f00"
    ctx.textBaseline = "middle"
    ctx.textAlign = "center"
    ctx.fillText("SIN SEÑAL", width / 2, height / 2)
  }

  const updateAndDrawObjects = (ctx: CanvasRenderingContext2D) => {
    objectsRef.current.forEach((obj) => {
      // Update position
      obj.x += Math.cos(obj.direction) * obj.speed
      obj.y += Math.sin(obj.direction) * obj.speed

      // Bounce off walls
      if (obj.x < 0 || obj.x > width) {
        obj.direction = Math.PI - obj.direction
      }
      if (obj.y < 0 || obj.y > height) {
        obj.direction = -obj.direction
      }

      // Keep within bounds
      obj.x = Math.max(0, Math.min(width, obj.x))
      obj.y = Math.max(0, Math.min(height, obj.y))

      // Draw object based on type
      if (obj.type === "person") {
        // Draw person silhouette
        ctx.fillStyle = "rgba(200, 200, 200, 0.4)"

        // Head
        ctx.beginPath()
        ctx.arc(obj.x, obj.y - obj.size / 2, obj.size / 4, 0, Math.PI * 2)
        ctx.fill()

        // Body
        ctx.beginPath()
        ctx.ellipse(obj.x, obj.y, obj.size / 3, obj.size / 2, 0, 0, Math.PI * 2)
        ctx.fill()

        // Add bounding box for motion detection effect
        ctx.strokeStyle = "rgba(0, 255, 0, 0.5)"
        ctx.strokeRect(obj.x - obj.size / 2, obj.y - obj.size, obj.size, obj.size * 1.5)
      } else if (obj.type === "vehicle") {
        // Draw vehicle silhouette
        ctx.fillStyle = "rgba(200, 200, 200, 0.4)"
        ctx.fillRect(obj.x - obj.size, obj.y - obj.size / 2, obj.size * 2, obj.size)

        // Add bounding box for motion detection effect
        ctx.strokeStyle = "rgba(255, 0, 0, 0.5)"
        ctx.strokeRect(obj.x - obj.size - 5, obj.y - obj.size / 2 - 5, obj.size * 2 + 10, obj.size + 10)
      } else {
        // Draw animal or other object
        ctx.fillStyle = "rgba(200, 200, 200, 0.3)"
        ctx.beginPath()
        ctx.ellipse(obj.x, obj.y, obj.size / 2, obj.size / 3, 0, 0, Math.PI * 2)
        ctx.fill()

        // Add bounding box for motion detection effect
        ctx.strokeStyle = "rgba(0, 0, 255, 0.5)"
        ctx.strokeRect(obj.x - obj.size / 2, obj.y - obj.size / 3, obj.size, obj.size / 1.5)
      }
    })
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  return (
    <div className="relative" style={{ width, height }}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="rounded-md cursor-pointer"
        onClick={togglePlayPause}
      />

      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <div className="bg-black/70 text-white px-4 py-2 rounded-full">PAUSA</div>
        </div>
      )}

      {/* Recording indicator */}
      {!isOffline && (
        <div className="absolute top-2 left-2 flex items-center">
          <div className="size-2 rounded-full bg-red-500 mr-1 animate-pulse"></div>
          <span className="text-xs text-white bg-black/50 px-1 rounded">REC</span>
        </div>
      )}
    </div>
  )
}

export default CameraSimulation

