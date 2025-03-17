"use client"

import type React from "react"
import { useState, useEffect } from "react"
import CameraCard from "./CameraCard"
import { cameras } from "@/data/cameras"
import { Camera } from "@/types/Camera"



const CameraGrid: React.FC = () => {
  const [displayCameras, setDisplayCameras] = useState<Camera[]>(cameras)
  const [isMobile, setIsMobile] = useState(false)

  // Detectar si es un dispositivo móvil
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Comprobar al cargar
    checkIfMobile()

    // Comprobar al cambiar el tamaño de la ventana
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  // Efecto para simular actividad en las cámaras (cambios de estado aleatorios)
  useEffect(() => {
    if (cameras.length === 0) return

    const interval = setInterval(() => {
      // Pequeña probabilidad de que una cámara cambie de estado
      if (Math.random() < 0.05) {
        // 5% de probabilidad cada 30 segundos
        const updatedCameras = [...displayCameras]
        const randomIndex = Math.floor(Math.random() * updatedCameras.length)

        // No modificar la cámara 6 que está siempre offline para el ejemplo
        if (updatedCameras[randomIndex].id !== 6) {
          updatedCameras[randomIndex] = {
            ...updatedCameras[randomIndex],
            status: updatedCameras[randomIndex].status === "online" ? "offline" : "online",
            lastMotion: updatedCameras[randomIndex].status === "offline" ? "Ahora mismo" : "2 horas atrás",
          }
          setDisplayCameras(updatedCameras)
        }
      }
    }, 30000) // Cada 30 segundos

    return () => clearInterval(interval)
  }, [cameras, displayCameras])

  // Actualizar displayCameras cuando cambia cameras (por ejemplo, al aplicar filtros)
  useEffect(() => {
    setDisplayCameras(cameras)
  }, [cameras])

  if (displayCameras.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-[#0A1A40]">
        <div className="text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="size-12 mx-auto text-[#0A1A40]/50"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          <p className="mt-2 text-sm font-medium">Ninguna cámara coincide con tu filtro</p>
          <button className="mt-2 text-[#7FFF00] text-sm hover:text-[#65CC00] transition-colors duration-200 font-medium">
            Limpiar filtros
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
      {displayCameras.map((camera) => (
        <CameraCard key={camera.id} camera={camera} isMobile={isMobile} />
      ))}
    </div>
  )
}

export default CameraGrid

