"use client"

import type React from "react"
import { useState, useEffect } from "react"
import CameraSimulation from "./CameraSimulation"

interface CameraFeedProps {
  width?: number
  height?: number
  cameraName?: string
  cameraId?: string | number
  showTimestamp?: boolean
  showCameraInfo?: boolean
  isOffline?: boolean
}

const CameraFeed: React.FC<CameraFeedProps> = ({
  width = 640,
  height = 360,
  cameraName = "CAM-01",
  cameraId = "CCTV-1",
  showTimestamp = false,
  showCameraInfo = true,
  isOffline = false,
}) => {
  const [useRealImage, setUseRealImage] = useState(true)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  // Imágenes reales de cámaras - Usando exactamente el array proporcionado
  const realCameraImages = [
    "https://ensegundos.com.pa/wp-content/uploads/2023/05/La-Empresa-de-Transmision-Electrica.jpg",
    "https://cdn.www.gob.pe/uploads/document/file/2148305/Inversiones%20en%20transmisi%C3%B3n%20el%C3%A9ctrica.jpg.jpg",
    "https://www.el19digital.com/files/articulos/262070.jpg",
    "https://www.prensalibre.com/wp-content/uploads/2018/12/9c50a257-3f80-4640-b9cf-4a6d38bd9de4.jpg?quality=52",
    "https://media.ecotvpanama.com/p/c023c81db499a36d6b4da77d01d5cd4e/adjuntos/323/imagenes/018/510/0018510808/855x0/smart/etesa-mantenimiento-2024jpeg.jpeg",
    "https://pbs.twimg.com/media/EQweMjIXYAAOGAf.jpg:large",
  ]

  // Verificar si el ID es mayor a 6 para mostrar offline
  const numericId = typeof cameraId === "string" ? Number.parseInt(cameraId.replace(/\D/g, "")) || 1 : cameraId

  // Si el ID es mayor a 6, mostrar como offline
  const shouldShowOffline = numericId > 6 || isOffline

  // Seleccionar imagen basada en el ID de la cámara
  const getImageForCamera = (id: string | number) => {
    const numId = typeof id === "string" ? Number.parseInt(id.replace(/\D/g, "")) || 1 : id
    // Asegurarse de que el índice esté dentro del rango del array (1-6)
    const index = (numId - 1) % 6
    return realCameraImages[index]
  }

  // Manejar errores de carga de imagen
  const handleImageError = () => {
    setImageError(true)
  }

  // Manejar carga exitosa de imagen
  const handleImageLoad = () => {
    setImageLoaded(true)
    setImageError(false)
  }

  useEffect(() => {
    // Resetear el estado de carga de imagen cuando cambia el ID de la cámara
    setImageLoaded(false)
    setImageError(false)

    // No precargar si debería mostrar offline
    if (shouldShowOffline) return

    // Precargar la imagen
    const img = new Image()
    img.onload = handleImageLoad
    img.onerror = handleImageError
    img.src = getImageForCamera(cameraId)

    return () => {
      // Limpiar eventos al desmontar
      img.onload = null
      img.onerror = null
    }
  }, [cameraId, shouldShowOffline])

  if (shouldShowOffline) {
    return (
      <CameraSimulation
        width={width}
        height={height}
        cameraName={typeof cameraName === "string" ? cameraName : String(cameraName)}
        cameraId={typeof cameraId === "string" ? cameraId : String(cameraId)}
        showTimestamp={showTimestamp}
        showCameraInfo={showCameraInfo}
        isOffline={true}
      />
    )
  }

  if (useRealImage) {
    return (
      <div className="relative" style={{ width, height }}>
        <div className="w-full h-full bg-black overflow-hidden rounded-md">
          {/* Mostrar simulación mientras la imagen carga o si hay error */}
          {(!imageLoaded || imageError) && (
            <div className="absolute inset-0">
              <CameraSimulation
                width={width}
                height={height}
                cameraName={typeof cameraName === "string" ? cameraName : String(cameraName)}
                cameraId={typeof cameraId === "string" ? cameraId : String(cameraId)}
                showTimestamp={false}
                showCameraInfo={false}
                cameraType={
                  typeof cameraId === "number"
                    ? cameraId % 4 === 0
                      ? "night"
                      : cameraId % 3 === 0
                        ? "thermal"
                        : cameraId % 2 === 0
                          ? "indoor"
                          : "outdoor"
                    : "outdoor"
                }
              />
            </div>
          )}

          <img
            src={getImageForCamera(cameraId) || "/placeholder.svg"}
            alt={`Cámara ${cameraId}`}
            className={`w-full h-full object-cover ${!imageLoaded ? "opacity-0" : "opacity-100"}`}
            onError={handleImageError}
            onLoad={handleImageLoad}
            style={{ transition: "opacity 0.3s ease-in-out" }}
            crossOrigin="anonymous"
          />
        </div>

        {/* Timestamp overlay */}
        {showTimestamp && (
          <div className="absolute bottom-2 right-2 text-xs bg-black/50 text-white px-1.5 py-0.5 rounded">
            {new Date().toLocaleString()}
          </div>
        )}

        {/* Camera info overlay */}
        {showCameraInfo && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1">{cameraName}</div>
        )}

        {/* Recording indicator */}
        <div className="absolute top-2 left-2 flex items-center">
          <div className="size-2 rounded-full bg-red-500 mr-1 animate-pulse"></div>
          <span className="text-xs text-white bg-black/50 px-1 rounded">REC</span>
        </div>
      </div>
    )
  }

  // Fallback a la simulación si no hay imágenes reales
  return (
    <CameraSimulation
      width={width}
      height={height}
      cameraName={typeof cameraName === "string" ? cameraName : String(cameraName)}
      cameraId={typeof cameraId === "string" ? cameraId : String(cameraId)}
      showTimestamp={showTimestamp}
      showCameraInfo={showCameraInfo}
      isOffline={isOffline}
      cameraType={
        typeof cameraId === "number"
          ? cameraId % 4 === 0
            ? "night"
            : cameraId % 3 === 0
              ? "thermal"
              : cameraId % 2 === 0
                ? "indoor"
                : "outdoor"
          : "outdoor"
      }
    />
  )
}

export default CameraFeed

