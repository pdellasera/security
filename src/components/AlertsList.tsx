"use client"

import type React from "react"
import { useState, useEffect } from "react"

interface Alert {
  id: string
  type: "motion" | "crowd" | "person" | "vehicle" | "device" | "alarm"
  subtype?: string
  location: string
  timestamp: Date
  cameraId: number
  cameraName: string
  thumbnail?: string
  details?: string
  isNew?: boolean
}

const alertIcons = {
  motion: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="size-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21.64 3.64a1.5 1.5 0 0 1 0 2.12l-1.64 1.64a1.5 1.5 0 0 1-2.12 0l-1.64-1.64a1.5 1.5 0 0 1 0-2.12l1.64-1.64a1.5 1.5 0 0 1 2.12 0l1.64 1.64z"></path>
      <path d="m19 11 2 2"></path>
      <path d="m21 3-2 2"></path>
      <path d="M11 19H5c-1.1 0-2-.9-2-2V7c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2v7.5"></path>
      <path d="m7 13 4-4 4 4"></path>
    </svg>
  ),
  crowd: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="size-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  ),
  person: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="size-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  ),
  vehicle: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="size-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.6-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.3 1 12.1 1 13v3c0 .6.4 1 1 1h2"></path>
      <circle cx="7" cy="17" r="2"></circle>
      <path d="M9 17h6"></path>
      <circle cx="17" cy="17" r="2"></circle>
    </svg>
  ),
  device: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="size-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="11" width="18" height="10" rx="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  ),
  alarm: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="size-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
    </svg>
  ),
}

// Imágenes disponibles para las alertas
const availableImages = [
  "https://ensegundos.com.pa/wp-content/uploads/2023/05/La-Empresa-de-Transmision-Electrica.jpg",
  "https://www.prensalibre.com/wp-content/uploads/2018/12/9c50a257-3f80-4640-b9cf-4a6d38bd9de4.jpg?quality=52",
  "https://www.el19digital.com/files/articulos/262070.jpg",
  "https://cdn.www.gob.pe/uploads/document/file/2148305/Inversiones%20en%20transmisi%C3%B3n%20el%C3%A9ctrica.jpg.jpg",
  "https://media.ecotvpanama.com/p/c023c81db499a36d6b4da77d01d5cd4e/adjuntos/323/imagenes/018/510/0018510808/855x0/smart/etesa-mantenimiento-2024jpeg.jpeg",
  "https://pbs.twimg.com/media/EQweMjIXYAAOGAf.jpg:large",
]

// Datos de ejemplo para alertas con imágenes para todas
const mockAlerts: Alert[] = [
  {
    id: "1",
    type: "motion",
    location: "Exterior",
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutos atrás
    cameraId: 1,
    cameraName: "Torre de Transmisión CD41-E",
    details: "Movimiento detectado en área restringida",
    thumbnail: availableImages[0],
    isNew: true,
  },
  {
    id: "2",
    type: "crowd",
    subtype: "vehicle",
    location: "Exterior",
    timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10 minutos atrás
    cameraId: 2,
    cameraName: "Subestación Eléctrica CD62-E",
    details: "5 o más vehículos",
    thumbnail: availableImages[1],
    isNew: true,
  },
  {
    id: "3",
    type: "crowd",
    subtype: "person",
    location: "Exterior",
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutos atrás
    cameraId: 3,
    cameraName: "Línea de Transmisión CD51-E",
    details: "2 o más personas",
    thumbnail: availableImages[2],
    isNew: true,
  },
  {
    id: "4",
    type: "vehicle",
    location: "Exterior",
    timestamp: new Date(Date.now() - 1000 * 60 * 20), // 20 minutos atrás
    cameraId: 4,
    cameraName: "Transformador Principal CP81-E",
    details: "Vehículos detectados",
    thumbnail: availableImages[3],
  },
  {
    id: "5",
    type: "person",
    location: "Exterior",
    timestamp: new Date(Date.now() - 1000 * 60 * 25), // 25 minutos atrás
    cameraId: 5,
    cameraName: "Estación de Control CB61-E",
    details: "Personas detectadas",
    thumbnail: availableImages[4],
  },
  {
    id: "6",
    type: "device",
    location: "Exterior",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutos atrás
    cameraId: 6,
    cameraName: "Cruce de Líneas CD41-E",
    details: "Dispositivo de entrada auxiliar de puerta modificado",
    thumbnail: availableImages[5],
  },
  {
    id: "7",
    type: "motion",
    location: "Exterior",
    timestamp: new Date(Date.now() - 1000 * 60 * 35), // 35 minutos atrás
    cameraId: 1,
    cameraName: "Torre de Transmisión CD41-E",
    details: "Movimiento detectado",
    thumbnail: availableImages[0],
  },
]

interface AlertsListProps {
  onSelectAlert?: (alert: Alert) => void
}

const AlertsList: React.FC<AlertsListProps> = ({ onSelectAlert }) => {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts)
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null)
  const [filter, setFilter] = useState<string>("all")

  // Formatear la hora en formato de 24 horas (HH:MM)
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", hour12: false })
  }

  // Filtrar alertas
  const filteredAlerts = alerts.filter((alert) => {
    if (filter === "all") return true
    return alert.type === filter
  })

  // Seleccionar una alerta
  const handleSelectAlert = (alert: Alert) => {
    setSelectedAlert(alert)
    if (onSelectAlert) {
      onSelectAlert(alert)
    }

    // Marcar la alerta como vista (ya no es nueva)
    setAlerts((prevAlerts) => prevAlerts.map((a) => (a.id === alert.id ? { ...a, isNew: false } : a)))
  }

  // Simular nuevas alertas periódicamente
  useEffect(() => {
    const interval = setInterval(() => {
      // 10% de probabilidad de generar una nueva alerta
      if (Math.random() < 0.1) {
        const alertTypes: Array<Alert["type"]> = ["motion", "crowd", "person", "vehicle", "device", "alarm"]
        const randomType = alertTypes[Math.floor(Math.random() * alertTypes.length)]
        const randomCamera = Math.floor(Math.random() * 6) + 1 // Cámaras 1-6
        const cameraNames = [
          "Torre de Transmisión CD41-E",
          "Subestación Eléctrica CD62-E",
          "Línea de Transmisión CD51-E",
          "Transformador Principal CP81-E",
          "Estación de Control CB61-E",
          "Cruce de Líneas CD41-E",
        ]

        const newAlert: Alert = {
          id: Date.now().toString(),
          type: randomType,
          location: "Exterior",
          timestamp: new Date(),
          cameraId: randomCamera,
          cameraName: cameraNames[randomCamera - 1],
          details: `${
            randomType === "motion"
              ? "Movimiento"
              : randomType === "crowd"
                ? "Multitud"
                : randomType === "person"
                  ? "Persona"
                  : randomType === "vehicle"
                    ? "Vehículo"
                    : randomType === "device"
                      ? "Dispositivo"
                      : "Alarma"
          } detectado`,
          thumbnail: availableImages[randomCamera - (1 % availableImages.length)],
          isNew: true,
        }

        // Añadir la nueva alerta al principio de la lista
        setAlerts((prevAlerts) => [newAlert, ...prevAlerts.slice(0, 19)]) // Mantener solo las 20 alertas más recientes
      }
    }, 30000) // Cada 30 segundos

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex h-full">
      {/* Lista de alertas */}
      <div className="w-full md:w-1/3 bg-white text-gray-800 border-r border-gray-200 flex flex-col h-full">
        <div className="p-3 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <div className="flex space-x-2">
            <button
              className={`px-3 py-1 text-xs rounded-full ${filter === "all" ? "bg-[#0A1A40] text-white" : "bg-gray-200 text-gray-600"}`}
              onClick={() => setFilter("all")}
            >
              Alertas
            </button>
            <button
              className={`px-3 py-1 text-xs rounded-full ${filter === "motion" ? "bg-[#0A1A40] text-white" : "bg-gray-200 text-gray-600"}`}
              onClick={() => setFilter("motion")}
            >
              Eventos del dispositivo
            </button>
          </div>
          <button className="text-gray-600 hover:text-gray-800">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="1"></circle>
              <circle cx="19" cy="12" r="1"></circle>
              <circle cx="5" cy="12" r="1"></circle>
            </svg>
          </button>
        </div>

        <div className="p-3 border-b border-gray-200 bg-gray-50">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar alertas"
              className="w-full bg-white text-gray-800 px-10 py-2 rounded-md text-sm border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#0A1A40] focus:border-[#0A1A40]"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-4 text-gray-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 3 21 3 21 9"></polyline>
                <polyline points="9 21 3 21 3 15"></polyline>
                <line x1="21" y1="3" x2="14" y2="10"></line>
                <line x1="3" y1="21" x2="10" y2="14"></line>
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="text-xs text-gray-500 px-4 py-2 sticky top-0 bg-white z-10 font-medium">Hoy</div>

          {filteredAlerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-12 mb-2"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <p>No hay alertas que mostrar</p>
            </div>
          ) : (
            filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`flex p-3 border-b border-gray-200 hover:bg-gray-100 cursor-pointer ${
                  selectedAlert?.id === alert.id ? "bg-gray-100" : ""
                } ${alert.isNew ? "border-l-2 border-l-[#7FFF00]" : ""}`}
                onClick={() => handleSelectAlert(alert)}
              >
                {/* Imagen a la izquierda */}
                <div className="mr-3 w-20 h-20 flex-shrink-0">
                  <img
                    src={alert.thumbnail || "/placeholder.svg"}
                    alt={alert.details || "Alerta"}
                    className="w-full h-full object-cover rounded-md"
                    onError={(e) => {
                      // Fallback a una imagen por defecto si hay error
                      e.currentTarget.src = availableImages[0]
                    }}
                  />
                </div>

                {/* Contenido de texto a la derecha con altura fija */}
                <div className="flex-1 min-w-0 h-20 flex flex-col justify-between overflow-hidden">
                  {/* Encabezado con tipo y hora */}
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className="size-4 bg-[#0A1A40] rounded-full flex items-center justify-center text-[#7FFF00] mr-1.5">
                        <div className="size-2 bg-[#7FFF00] rounded-full"></div>
                      </div>
                      <div className="font-medium text-sm text-gray-800">
                        {alert.type === "motion"
                          ? "Movimiento"
                          : alert.type === "crowd" && alert.subtype === "vehicle"
                            ? "Multitud"
                            : alert.type === "crowd" && alert.subtype === "person"
                              ? "Multitud"
                              : alert.type === "person"
                                ? "Movimiento"
                                : alert.type === "vehicle"
                                  ? "Movimiento"
                                  : alert.type === "device"
                                    ? "Dispositivo"
                                    : "Alarma"}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 ml-2 whitespace-nowrap bg-gray-100 px-1.5 py-0.5 rounded">
                      {formatTime(alert.timestamp)}
                    </div>
                  </div>

                  {/* Detalles de la alerta */}
                  <div className="mt-1">
                    <p className="text-xs font-medium text-gray-700 truncate">{alert.details}</p>
                    <div className="flex items-center mt-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="size-3 text-gray-500 mr-1"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      <p className="text-xs text-gray-500 truncate">
                        {alert.cameraName} — {alert.location}
                      </p>
                    </div>
                  </div>

                  {/* Etiqueta de tipo de alerta */}
                  <div className="mt-auto">
                    <span className="inline-block text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full truncate">
                      {alert.type === "motion"
                        ? "Detección de movimiento"
                        : alert.type === "crowd"
                          ? "Detección de multitud"
                          : alert.type === "person"
                            ? "Detección de persona"
                            : alert.type === "vehicle"
                              ? "Detección de vehículo"
                              : alert.type === "device"
                                ? "Alerta de dispositivo"
                                : "Alarma de seguridad"}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}

          <div className="p-4 flex justify-center">
            <button className="flex items-center text-xs text-gray-500 hover:text-gray-800">
              <span>Volver arriba</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-4 ml-1"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="18 15 12 9 6 15"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Vista previa de la alerta */}
      <div className="hidden md:block md:w-2/3 bg-black h-full">
        {selectedAlert ? (
          <div className="h-full flex flex-col">
            <div className="flex-1 relative">
              <img
                src={selectedAlert.thumbnail || "/placeholder.svg"}
                alt={selectedAlert.details || "Vista previa de alerta"}
                className="w-full h-[65vh] object-cover"
                onError={(e) => {
                  // Fallback a una imagen por defecto si hay error
                  e.currentTarget.src = availableImages[0]
                }}
              />

              {/* Controles de video */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                <div className="flex items-center justify-center space-x-4">
                  <button className="text-white hover:text-[#7FFF00]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-6"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="19 20 9 12 19 4 19 20"></polygon>
                      <line x1="5" y1="19" x2="5" y2="5"></line>
                    </svg>
                  </button>
                  <button className="text-white hover:text-[#7FFF00]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-8"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <polygon points="10 8 16 12 10 16 10 8"></polygon>
                    </svg>
                  </button>
                  <button className="text-white hover:text-[#7FFF00]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-6"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="5 4 15 12 5 20 5 4"></polygon>
                      <line x1="19" y1="5" x2="19" y2="19"></line>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-gray-800 font-medium">
                    {selectedAlert.type === "motion"
                      ? "Movimiento"
                      : selectedAlert.type === "crowd"
                        ? "Multitud"
                        : selectedAlert.type === "person"
                          ? "Persona"
                          : selectedAlert.type === "vehicle"
                            ? "Vehículo"
                            : selectedAlert.type === "device"
                              ? "Dispositivo"
                              : "Alarma"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {selectedAlert.cameraName} — {selectedAlert.location}
                  </p>
                </div>
                <div className="text-sm text-gray-600">Hoy, a las {formatTime(selectedAlert.timestamp)} GMT-5</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center bg-gray-100">
            <div className="text-center text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-16 mx-auto mb-2"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"></path>
              </svg>
              <p>Selecciona una alerta para ver los detalles</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AlertsList

