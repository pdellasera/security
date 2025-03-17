"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useAlerts } from "@/components/AlertsContext"

// Modificar la interfaz Alert para incluir tipos específicos de una empresa de transmisión eléctrica
interface Alert {
  id: string
  type: "sobrecarga" | "fallo" | "intrusion" | "mantenimiento" | "voltaje" | "emergencia"
  subtype?: string
  location: string
  timestamp: Date
  cameraId: number
  cameraName: string
  thumbnail?: string
  details?: string
  isNew?: boolean
  codigoEquipo?: string
  area?: string
  nivelCriticidad?: "bajo" | "medio" | "alto" | "critico"
}

// Imágenes disponibles para las alertas
const availableImages = [
  "https://ensegundos.com.pa/wp-content/uploads/2023/05/La-Empresa-de-Transmision-Electrica.jpg",
  "https://www.prensalibre.com/wp-content/uploads/2018/12/9c50a257-3f80-4640-b9cf-4a6d38bd9de4.jpg?quality=52",
  "https://www.el19digital.com/files/articulos/262070.jpg",
  "https://cdn.www.gob.pe/uploads/document/file/2148305/Inversiones%20en%20transmisi%C3%B3n%20el%C3%A9ctrica.jpg.jpg",
  "https://media.ecotvpanama.com/p/c023c81db499a36d6b4da77d01d5cd4e/adjuntos/323/imagenes/018/510/0018510808jpg.jpeg",
  "https://pbs.twimg.com/media/EQweMjIXYAAOGAf.jpg:large",
]

// Generar códigos de equipo aleatorios para transmisión eléctrica
const generarCodigoEquipo = () => {
  const prefijos = ["TR", "SE", "LT", "CT", "PT"]
  const prefijo = prefijos[Math.floor(Math.random() * prefijos.length)]
  const numero = Math.floor(Math.random() * 900) + 100
  return `${prefijo}-${numero}`
}

// Datos de ejemplo para alertas específicas de transmisión eléctrica
const mockAlerts: Alert[] = [
  {
    id: "1",
    type: "sobrecarga",
    location: "Subestación Norte",
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutos atrás
    cameraId: 1,
    cameraName: "Torre de Transmisión CD41-E",
    details: "Sobrecarga detectada en transformador principal",
    thumbnail: availableImages[0],
    isNew: true,
    codigoEquipo: "TR-347",
    area: "Subestación Norte",
    nivelCriticidad: "alto",
  },
  {
    id: "2",
    type: "voltaje",
    location: "Línea de Transmisión Este",
    timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10 minutos atrás
    cameraId: 2,
    cameraName: "Subestación Eléctrica CD62-E",
    details: "Fluctuación de voltaje detectada en línea principal",
    thumbnail: availableImages[1],
    isNew: true,
    codigoEquipo: "LT-113",
    area: "Sector Este",
    nivelCriticidad: "medio",
  },
  {
    id: "3",
    type: "intrusion",
    location: "Perímetro Subestación",
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutos atrás
    cameraId: 3,
    cameraName: "Línea de Transmisión CD51-E",
    details: "Intrusión detectada en perímetro de seguridad",
    thumbnail: availableImages[2],
    isNew: true,
    codigoEquipo: "SE-113",
    area: "Perímetro Sur",
    nivelCriticidad: "alto",
  },
]

interface AlertsListProps {
  onSelectAlert?: (alert: Alert) => void
}

const AlertsList: React.FC<AlertsListProps> = ({ onSelectAlert }) => {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts)
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null)
  const [filter, setFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")

  // Añadir el uso del contexto dentro del componente AlertsList
  const { showNotification, incrementAlertCount } = useAlerts()

  // Formatear la hora en formato de 24 horas (HH:MM)
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", hour12: false })
  }

  // Formatear la fecha completa
  const formatDate = (date: Date) => {
    return (
      date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }) +
      " " +
      formatTime(date)
    )
  }

  // Filtrar alertas
  const filteredAlerts = alerts
    .filter((alert) => {
      if (filter === "all") return true
      return alert.type === filter
    })
    .filter((alert) => {
      // Aplicar filtro de búsqueda
      if (!searchQuery) return true
      const searchTerm = searchQuery.toLowerCase()
      return (
        alert.cameraName.toLowerCase().includes(searchTerm) ||
        alert.location.toLowerCase().includes(searchTerm) ||
        alert.details?.toLowerCase().includes(searchTerm) ||
        alert.type.toLowerCase().includes(searchTerm) ||
        alert.codigoEquipo?.toLowerCase().includes(searchTerm) ||
        alert.area?.toLowerCase().includes(searchTerm)
      )
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

  // Actualizar la función useEffect que genera alertas aleatorias
  useEffect(() => {
    // Contador para limitar a 10 alertas
    let alertCount = 0;
    const maxAlerts = 10;
    
    const interval = setInterval(() => {
      // Detener después de 10 alertas
      if (alertCount >= maxAlerts) {
        clearInterval(interval);
        return;
      }
      
      alertCount++;
      
      const alertTypes: Array<Alert["type"]> = ["sobrecarga", "fallo", "intrusion", "mantenimiento", "voltaje", "emergencia"]
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
      
      const areas = ["Subestación Norte", "Subestación Sur", "Línea de Transmisión Este", "Perímetro Principal", "Central Térmica"];
      const detalles = {
        sobrecarga: [
          "Sobrecarga detectada en transformador principal",
          "Sobrecarga en línea de transmisión de alta tensión",
          "Sobrecarga en sistema de distribución secundario"
        ],
        fallo: [
          "Fallo en sistema de refrigeración de transformador",
          "Fallo en aisladores de línea de transmisión",
          "Fallo en sistema de respaldo de energía"
        ],
        intrusion: [
          "Intrusión detectada en perímetro de seguridad",
          "Acceso no autorizado a subestación",
          "Intrusión en torre de transmisión"
        ],
        mantenimiento: [
          "Mantenimiento programado requerido en transformador",
          "Alerta de mantenimiento preventivo en línea",
          "Mantenimiento urgente en sistema de protección"
        ],
        voltaje: [
          "Fluctuación de voltaje detectada en línea principal",
          "Caída de voltaje en subestación secundaria",
          "Pico de voltaje detectado en sistema de distribución"
        ],
        emergencia: [
          "Condición crítica en transformador principal",
          "Emergencia por sobrecalentamiento en subestación",
          "Alerta de incendio en instalaciones eléctricas"
        ]
      };

      const criticidadPorTipo = {
        sobrecarga: "alto",
        fallo: "medio",
        intrusion: "alto",
        mantenimiento: "bajo",
        voltaje: "medio",
        emergencia: "critico"
      };

      const detallesPorTipo = detalles[randomType];
      const detalle = detallesPorTipo[Math.floor(Math.random() * detallesPorTipo.length)];
      const nivelCriticidad = criticidadPorTipo[randomType] as "bajo" | "medio" | "alto" | "critico";

      const newAlert: Alert = {
        id: Date.now().toString(),
        type: randomType,
        location: areas[Math.floor(Math.random() * areas.length)],
        timestamp: new Date(),
        cameraId: randomCamera,
        cameraName: cameraNames[randomCamera - 1],
        details: detalle,
        thumbnail: availableImages[(randomCamera - 1) % availableImages.length],
        isNew: true,
        codigoEquipo: generarCodigoEquipo(),
        area: areas[Math.floor(Math.random() * areas.length)],
        nivelCriticidad: nivelCriticidad
      }

      // Añadir la nueva alerta al principio de la lista
      setAlerts((prevAlerts) => [newAlert, ...prevAlerts.slice(0, 19)]);

      // Mostrar notificación y actualizar contador
      showNotification(`Nueva alerta: ${newAlert.details}`, "warning");
      incrementAlertCount();
      
    }, 30000) // Cada 30 segundos

    // Para demostración, generamos la primera alerta inmediatamente
    setTimeout(() => {
      const alertTypes: Array<Alert["type"]> = ["sobrecarga", "fallo", "intrusion", "mantenimiento", "voltaje", "emergencia"]
      const randomType = alertTypes[Math.floor(Math.random() * alertTypes.length)]
      const randomCamera = Math.floor(Math.random() * 6) + 1
      const cameraNames = [
        "Torre de Transmisión CD41-E",
        "Subestación Eléctrica CD62-E",
        "Línea de Transmisión CD51-E",
        "Transformador Principal CP81-E",
        "Estación de Control CB61-E",
        "Cruce de Líneas CD41-E",
      ]
      
      const areas = ["Subestación Norte", "Subestación Sur", "Línea de Transmisión Este", "Perímetro Principal", "Central Térmica"];
      const detalles = {
        sobrecarga: [
          "Sobrecarga detectada en transformador principal",
          "Sobrecarga en línea de transmisión de alta tensión",
          "Sobrecarga en sistema de distribución secundario"
        ],
        fallo: [
          "Fallo en sistema de refrigeración de transformador",
          "Fallo en aisladores de línea de transmisión",
          "Fallo en sistema de respaldo de energía"
        ],
        intrusion: [
          "Intrusión detectada en perímetro de seguridad",
          "Acceso no autorizado a subestación",
          "Intrusión en torre de transmisión"
        ],
        mantenimiento: [
          "Mantenimiento programado requerido en transformador",
          "Alerta de mantenimiento preventivo en línea",
          "Mantenimiento urgente en sistema de protección"
        ],
        voltaje: [
          "Fluctuación de voltaje detectada en línea principal",
          "Caída de voltaje en subestación secundaria",
          "Pico de voltaje detectado en sistema de distribución"
        ],
        emergencia: [
          "Condición crítica en transformador principal",
          "Emergencia por sobrecalentamiento en subestación",
          "Alerta de incendio en instalaciones eléctricas"
        ]
      };

      const criticidadPorTipo = {
        sobrecarga: "alto",
        fallo: "medio",
        intrusion: "alto",
        mantenimiento: "bajo",
        voltaje: "medio",
        emergencia: "critico"
      };

      const detallesPorTipo = detalles[randomType];
      const detalle = detallesPorTipo[Math.floor(Math.random() * detallesPorTipo.length)];
      const nivelCriticidad = criticidadPorTipo[randomType] as "bajo" | "medio" | "alto" | "critico";

      const newAlert: Alert = {
        id: Date.now().toString(),
        type: randomType,
        location: areas[Math.floor(Math.random() * areas.length)],
        timestamp: new Date(),
        cameraId: randomCamera,
        cameraName: cameraNames[randomCamera - 1],
        details: detalle,
        thumbnail: availableImages[(randomCamera - 1) % availableImages.length],
        isNew: true,
        codigoEquipo: generarCodigoEquipo(),
        area: areas[Math.floor(Math.random() * areas.length)],
        nivelCriticidad: nivelCriticidad
      }

      alertCount++;
      setAlerts((prevAlerts) => [newAlert, ...prevAlerts.slice(0, 19)])
    }, 2000);

    return () => clearInterval(interval)
  }, [showNotification, incrementAlertCount])

  return (
    <div className="flex h-full">
      {/* Lista de alertas */}
      <div className="w-full md:w-1/3 bg-white text-gray-800 border-r border-gray-200 flex flex-col h-full">
        {/* Actualizar los botones de filtro para mostrar categorías relevantes para transmisión eléctrica */}
        <div className="p-3 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <div className="flex space-x-2">
            <button
              className={`px-3 py-1 text-xs rounded-full ${filter === "all" ? "bg-[#0A1A40] text-white" : "bg-gray-200 text-gray-600"}`}
              onClick={() => setFilter("all")}
            >
              Todas las alertas
            </button>
            <button
              className={`px-3 py-1 text-xs rounded-full ${filter === "sobrecarga" ? "bg-[#0A1A40] text-white" : "bg-gray-200 text-gray-600"}`}
              onClick={() => setFilter("sobrecarga")}
            >
              Sobrecargas
            </button>
            <button
              className={`px-3 py-1 text-xs rounded-full ${filter === "intrusion" ? "bg-[#0A1A40] text-white" : "bg-gray-200 text-gray-600"}`}
              onClick={() => setFilter("intrusion")}
            >
              Seguridad
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
            {searchQuery && (
              <button
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                onClick={() => setSearchQuery("")}
              >
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
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
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
            <AnimatePresence initial={false}>
              {filteredAlerts.map((alert) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, height: 0, marginTop: -20 }}
                  animate={{ opacity: 1, height: "auto", marginTop: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex p-3 border-b border-gray-200 hover:bg-gray-100 cursor-pointer ${
                    selectedAlert?.id === alert.id ? "bg-gray-100" : ""
                  } ${alert.isNew ? "border-l-2 border-l-[#7FFF00]" : ""}`}
                  onClick={() => handleSelectAlert(alert)}
                >
                  {/* Imagen a la izquierda */}
                  <div className="mr-3 w-20 h-20 flex-shrink-0 overflow-hidden">
                    <motion.img
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5 }}
                      src={alert.thumbnail || "/placeholder.svg"}
                      alt={alert.details || "Alerta"}
                      className="w-full h-full object-cover rounded-md"
                      onError={(e: { currentTarget: { src: string } }) => {
                        // Fallback a una imagen por defecto si hay error
                        e.currentTarget.src = availableImages[0]
                      }}
                    />
                  </div>

                  {/* Contenido de texto a la derecha */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div className="font-medium text-sm truncate text-gray-800">
                        {alert.details || "Alerta sin detalles"}
                      </div>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-xs text-gray-500 ml-2 whitespace-nowrap"
                      >
                        {formatTime(alert.timestamp)}
                      </motion.div>
                    </div>
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="text-xs text-gray-600 mt-1 truncate"
                    >
                      Equipo: {alert.codigoEquipo}
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-xs text-gray-500 mt-1 truncate"
                    >
                      {alert.cameraName} — {alert.area}
                    </motion.div>

                    {/* Indicador de tipo de alerta */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3, type: "spring" }}
                      className="mt-2 flex items-center"
                    >
                      <div 
                        className={`size-4 rounded-full flex items-center justify-center mr-1 ${
                          alert.nivelCriticidad === 'critico' ? 'bg-red-600' : 
                          alert.nivelCriticidad === 'alto' ? 'bg-orange-500' : 
                          alert.nivelCriticidad === 'medio' ? 'bg-yellow-500' : 
                          'bg-green-500'
                        }`}
                      >
                        <motion.div 
                          animate={{ scale: alert.isNew ? [1, 1.2, 1] : 1 }}
                          transition={{ repeat: alert.isNew ? Number.POSITIVE_INFINITY : 0, duration: 2 }}
                          className="size-2 bg-white rounded-full"
                        />
                      </div>
                      <span className="text-xs text-gray-600">
                        Nivel: {alert.nivelCriticidad}
                      </span>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
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
      <div className="hidden md:flex md:w-2/3 bg-white h-full flex-col">
        {selectedAlert ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="h-full flex flex-col"
          >
            {/* Título del panel de detalles */}
            <div className="p-4 bg-[#0A1A40] text-white border-b border-gray-200">
              <h2 className="text-lg font-medium">Detalles de Alerta - Sistema de Transmisión Eléctrica</h2>
            </div>

            {/* Imagen más pequeña */}
            <div className="p-4 bg-gray-50">
              <div className="w-full h-64 relative">
                <img
                  src={selectedAlert.thumbnail || "/placeholder.svg"}
                  alt={selectedAlert.details || "Vista previa de alerta"}
                  className="w-full h-full object-cover rounded-md"
                  onError={(e) => {
                    // Fallback a una imagen por defecto si hay error
                    e.currentTarget.src = availableImages[0]
                  }}
                />

                {/* Controles de imagen */}
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button className="bg-white/80 hover:bg-white p-1 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="3"></circle>
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65  1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65
0 0 0 1 1.51V3a2 2 0 0 1 2 2 2 2 0 0 1 2-2v.09a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2 2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2 2 2 2 0 0 1 2 2"
                    /></svg>
                  </button>
                </div>
              </div>

              {/* Detalles de la alerta */}
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-2">{selectedAlert.details}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Código de Equipo:</strong> {selectedAlert.codigoEquipo}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Ubicación:</strong> {selectedAlert.location}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Área:</strong> {selectedAlert.area}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Nivel de Criticidad:</strong> {selectedAlert.nivelCriticidad}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Fecha y Hora:</strong> {formatDate(selectedAlert.timestamp)}
                </p>
              </div>

              {/* Acciones */}
              <div className="p-4 border-t border-gray-200">
                <button className="bg-[#0A1A40] hover:bg-[#152A5A] text-white font-medium py-2 px-4 rounded">
                  Resolver Alerta
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Seleccione una alerta para ver los detalles
          </div>
        )}
      </div>
    </div>
  )
}

export default AlertsList

