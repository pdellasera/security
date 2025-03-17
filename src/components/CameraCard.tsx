"use client"

import type React from "react"
import { useState, useEffect } from "react"
import CameraFeed from "./CameraFeed"
import type { Camera } from "../types/Camera"

interface CameraCardProps {
  camera: Camera
}

const CameraCard: React.FC<CameraCardProps> = ({ camera }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [lastMotionTime, setLastMotionTime] = useState(camera.lastMotion)

  // Actualizar el tiempo de último movimiento periódicamente para cámaras en línea
  useEffect(() => {
    if (camera.status !== "online") return

    const interval = setInterval(() => {
      const randomUpdate = Math.random()
      if (randomUpdate < 0.3) {
        // 30% de probabilidad de actualizar
        const times = ["Ahora mismo", "1 min atrás", "2 min atrás", "3 min atrás", "5 min atrás"]
        const newTime = times[Math.floor(Math.random() * times.length)]
        setLastMotionTime(newTime)
      }
    }, 10000) // Cada 10 segundos

    return () => clearInterval(interval)
  }, [camera.status])

  return (
    <div
      className="bg-white rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-[#0A1A40]/10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-video">
        <CameraFeed
          width={640}
          height={360}
          cameraName={camera.name}
          cameraId={camera.id}
          isOffline={camera.status === "offline"}
          showCameraInfo={true}
        />

        {/* Status indicator */}
        <div className="absolute top-2 right-2 flex items-center">
          <div
            className={`size-2 rounded-full ${camera.status === "online" ? "bg-[#7FFF00]" : "bg-red-500"} mr-1`}
          ></div>
          <span className="text-xs bg-black/50 text-white px-1.5 py-0.5 rounded">
            {camera.status === "online" ? "EN VIVO" : "FUERA DE LÍNEA"}
          </span>
        </div>

        {/* Hover controls */}
        {isHovered && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
            <div className="flex gap-2">
              <button className="bg-[#0A1A40]/80 text-white p-2 rounded-full hover:bg-[#7FFF00] hover:text-[#0A1A40] transition-colors duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="size-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path
                    fillRule="evenodd"
                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <button className="bg-[#0A1A40]/80 text-white p-2 rounded-full hover:bg-[#7FFF00] hover:text-[#0A1A40] transition-colors duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="size-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <button className="bg-[#0A1A40]/80 text-white p-2 rounded-full hover:bg-[#7FFF00] hover:text-[#0A1A40] transition-colors duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="size-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Last motion indicator */}
        {camera.status === "online" && (
          <div className="absolute bottom-2 left-2 text-xs bg-black/50 text-white px-1.5 py-0.5 rounded flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="size-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
            {lastMotionTime}
          </div>
        )}
      </div>
      <div className="p-2 bg-[#0A1A40] text-white text-xs">
        <h3 className="truncate font-medium">{camera.name}</h3>
      </div>
    </div>
  )
}

export default CameraCard

