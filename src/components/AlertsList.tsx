"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useAlerts } from "./AlertsContext"

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

// Actualizar los iconos para que representen los nuevos tipos de alertas
const alertIcons = {
    sobrecarga: (
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
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
        </svg>
    ),
    fallo: (
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
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
        </svg>
    ),
    intrusion: (
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
    mantenimiento: (
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
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
        </svg>
    ),
    voltaje: (
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
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
        </svg>
    ),
    emergencia: (
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
            <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
    ),
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
    const [showFilterMenu, setShowFilterMenu] = useState(false)
    const [showMobileDetail, setShowMobileDetail] = useState(false)
    const filterMenuRef = useRef<HTMLDivElement>(null)

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

    // Cerrar el menú de filtros cuando se hace clic fuera de él
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (filterMenuRef.current && !filterMenuRef.current.contains(event.target as Node)) {
                setShowFilterMenu(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

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
        setShowMobileDetail(true)
        if (onSelectAlert) {
            onSelectAlert(alert)
        }

        // Marcar la alerta como vista (ya no es nueva)
        setAlerts((prevAlerts) => prevAlerts.map((a) => (a.id === alert.id ? { ...a, isNew: false } : a)))
    }

    // Volver a la lista desde la vista de detalles en móvil
    const handleBackToList = () => {
        setShowMobileDetail(false)
    }

    // Actualizar la función useEffect que genera alertas aleatorias
    useEffect(() => {
        // Contador para limitar a 10 alertas
        let alertCount = 0
        const maxAlerts = 10

        const interval = setInterval(() => {
            // Detener después de 10 alertas
            if (alertCount >= maxAlerts) {
                clearInterval(interval)
                return
            }

            alertCount++

            const alertTypes: Array<Alert["type"]> = [
                "sobrecarga",
                "fallo",
                "intrusion",
                "mantenimiento",
                "voltaje",
                "emergencia",
            ]
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

            const areas = [
                "Subestación Norte",
                "Subestación Sur",
                "Línea de Transmisión Este",
                "Perímetro Principal",
                "Central Térmica",
            ]
            const detalles = {
                sobrecarga: [
                    "Sobrecarga detectada en transformador principal",
                    "Sobrecarga en línea de transmisión de alta tensión",
                    "Sobrecarga en sistema de distribución secundario",
                ],
                fallo: [
                    "Fallo en sistema de refrigeración de transformador",
                    "Fallo en aisladores de línea de transmisión",
                    "Fallo en sistema de respaldo de energía",
                ],
                intrusion: [
                    "Intrusión detectada en perímetro de seguridad",
                    "Acceso no autorizado a subestación",
                    "Intrusión en torre de transmisión",
                ],
                mantenimiento: [
                    "Mantenimiento programado requerido en transformador",
                    "Alerta de mantenimiento preventivo en línea",
                    "Mantenimiento urgente en sistema de protección",
                ],
                voltaje: [
                    "Fluctuación de voltaje detectada en línea principal",
                    "Caída de voltaje en subestación secundaria",
                    "Pico de voltaje detectado en sistema de distribución",
                ],
                emergencia: [
                    "Condición crítica en transformador principal",
                    "Emergencia por sobrecalentamiento en subestación",
                    "Alerta de incendio en instalaciones eléctricas",
                ],
            }

            const criticidadPorTipo = {
                sobrecarga: "alto",
                fallo: "medio",
                intrusion: "alto",
                mantenimiento: "bajo",
                voltaje: "medio",
                emergencia: "critico",
            }

            const detallesPorTipo = detalles[randomType]
            const detalle = detallesPorTipo[Math.floor(Math.random() * detallesPorTipo.length)]
            const nivelCriticidad = criticidadPorTipo[randomType] as "bajo" | "medio" | "alto" | "critico"

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
                nivelCriticidad: nivelCriticidad,
            }

            // Añadir la nueva alerta al principio de la lista
            setAlerts((prevAlerts) => [newAlert, ...prevAlerts.slice(0, 19)])

            // Mostrar notificación y actualizar contador
            showNotification(`Nueva alerta: ${newAlert.details}`, "warning")
            incrementAlertCount()
        }, 30000) // Cada 30 segundos

        // Para demostración, generamos la primera alerta inmediatamente
        setTimeout(() => {
            const alertTypes: Array<Alert["type"]> = [
                "sobrecarga",
                "fallo",
                "intrusion",
                "mantenimiento",
                "voltaje",
                "emergencia",
            ]
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

            const areas = [
                "Subestación Norte",
                "Subestación Sur",
                "Línea de Transmisión Este",
                "Perímetro Principal",
                "Central Térmica",
            ]
            const detalles = {
                sobrecarga: [
                    "Sobrecarga detectada en transformador principal",
                    "Sobrecarga en línea de transmisión de alta tensión",
                    "Sobrecarga en sistema de distribución secundario",
                ],
                fallo: [
                    "Fallo en sistema de refrigeración de transformador",
                    "Fallo en aisladores de línea de transmisión",
                    "Fallo en sistema de respaldo de energía",
                ],
                intrusion: [
                    "Intrusión detectada en perímetro de seguridad",
                    "Acceso no autorizado a subestación",
                    "Intrusión en torre de transmisión",
                ],
                mantenimiento: [
                    "Mantenimiento programado requerido en transformador",
                    "Alerta de mantenimiento preventivo en línea",
                    "Mantenimiento urgente en sistema de protección",
                ],
                voltaje: [
                    "Fluctuación de voltaje detectada en línea principal",
                    "Caída de voltaje en subestación secundaria",
                    "Pico de voltaje detectado en sistema de distribución",
                ],
                emergencia: [
                    "Condición crítica en transformador principal",
                    "Emergencia por sobrecalentamiento en subestación",
                    "Alerta de incendio en instalaciones eléctricas",
                ],
            }

            const criticidadPorTipo = {
                sobrecarga: "alto",
                fallo: "medio",
                intrusion: "alto",
                mantenimiento: "bajo",
                voltaje: "medio",
                emergencia: "critico",
            }

            const detallesPorTipo = detalles[randomType]
            const detalle = detallesPorTipo[Math.floor(Math.random() * detallesPorTipo.length)]
            const nivelCriticidad = criticidadPorTipo[randomType] as "bajo" | "medio" | "alto" | "critico"

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
                nivelCriticidad: nivelCriticidad,
            }

            alertCount++
            setAlerts((prevAlerts) => [newAlert, ...prevAlerts.slice(0, 19)])
        }, 2000)

        return () => clearInterval(interval)
    }, [showNotification, incrementAlertCount])

    // Renderizar el icono según el tipo de alerta
    const renderAlertIcon = (type: Alert["type"]) => {
        return alertIcons[type] || null
    }

    return (
        <div className="flex flex-col h-full bg-gray-50 md:flex-row">
            {/* Lista de alertas - Siempre visible en desktop, visible solo cuando !showMobileDetail en móvil */}
            <div
                className={`w-full bg-white text-gray-800 flex flex-col h-full md:w-1/3 md:border-r md:border-gray-200 ${showMobileDetail ? "hidden md:flex" : "flex"
                    }`}
            >
                {/* Header con filtros */}
                <div className="sticky top-0 z-10 bg-white shadow-sm">
                    <div className="p-3 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                        <h2 className="text-lg font-medium text-gray-800">Alertas</h2>
                        <div className="relative" ref={filterMenuRef}>
                            <button
                                className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                                onClick={() => setShowFilterMenu(!showFilterMenu)}
                                aria-label="Filtrar alertas"
                            >
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
                                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                                </svg>
                            </button>

                            {/* Menú desplegable de filtros */}
                            {showFilterMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 border border-gray-200">
                                    <div className="py-1">
                                        <button
                                            className={`w-full text-left px-4 py-3 text-sm ${filter === "all" ? "bg-gray-100 font-medium" : ""}`}
                                            onClick={() => {
                                                setFilter("all")
                                                setShowFilterMenu(false)
                                            }}
                                        >
                                            Todas las alertas
                                        </button>
                                        <button
                                            className={`w-full text-left px-4 py-3 text-sm ${filter === "sobrecarga" ? "bg-gray-100 font-medium" : ""}`}
                                            onClick={() => {
                                                setFilter("sobrecarga")
                                                setShowFilterMenu(false)
                                            }}
                                        >
                                            Sobrecargas
                                        </button>
                                        <button
                                            className={`w-full text-left px-4 py-3 text-sm ${filter === "voltaje" ? "bg-gray-100 font-medium" : ""}`}
                                            onClick={() => {
                                                setFilter("voltaje")
                                                setShowFilterMenu(false)
                                            }}
                                        >
                                            Voltaje
                                        </button>
                                        <button
                                            className={`w-full text-left px-4 py-3 text-sm ${filter === "intrusion" ? "bg-gray-100 font-medium" : ""}`}
                                            onClick={() => {
                                                setFilter("intrusion")
                                                setShowFilterMenu(false)
                                            }}
                                        >
                                            Seguridad
                                        </button>
                                        <button
                                            className={`w-full text-left px-4 py-3 text-sm ${filter === "emergencia" ? "bg-gray-100 font-medium" : ""}`}
                                            onClick={() => {
                                                setFilter("emergencia")
                                                setShowFilterMenu(false)
                                            }}
                                        >
                                            Emergencias
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Barra de búsqueda */}
                    {/* <div className="p-3 border-b border-gray-200 bg-gray-50">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Buscar alertas"
                                className="w-full bg-white text-gray-800 px-10 py-3 rounded-md text-base border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#0A1A40] focus:border-[#0A1A40]"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="size-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2"
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
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2"
                                    onClick={() => setSearchQuery("")}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="size-5 text-gray-500"
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
                    </div> */}

                    {/* Filtro activo */}
                    {filter !== "all" && (
                        <div className="px-4 py-2 bg-gray-100 border-b border-gray-200 flex justify-between items-center">
                            <div className="flex items-center">
                                <span className="text-sm font-medium">Filtro: </span>
                                <span className="ml-2 text-sm bg-[#0A1A40] text-white px-2 py-1 rounded-full">
                                    {filter === "sobrecarga"
                                        ? "Sobrecargas"
                                        : filter === "voltaje"
                                            ? "Voltaje"
                                            : filter === "intrusion"
                                                ? "Seguridad"
                                                : filter === "emergencia"
                                                    ? "Emergencias"
                                                    : filter}
                                </span>
                            </div>
                            <button className="text-sm text-gray-600" onClick={() => setFilter("all")}>
                                Limpiar
                            </button>
                        </div>
                    )}
                </div>

                {/* Lista de alertas */}
                <div className="flex-1 overflow-y-auto">
                    <div className="text-sm text-gray-500 px-4 py-2 sticky top-0 bg-white z-10 font-medium border-b border-gray-200">
                        Hoy
                    </div>

                    {filteredAlerts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-500 p-4">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="size-16 mb-4"
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
                            <p className="text-center">No hay alertas que coincidan con tu búsqueda</p>
                            {(filter !== "all" || searchQuery) && (
                                <button
                                    className="mt-4 text-[#0A1A40] font-medium"
                                    onClick={() => {
                                        setFilter("all")
                                        setSearchQuery("")
                                    }}
                                >
                                    Limpiar filtros
                                </button>
                            )}
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
                                    className={`flex p-4 border-b border-gray-200 hover:bg-gray-50 active:bg-gray-100 cursor-pointer ${selectedAlert?.id === alert.id ? "bg-gray-100" : ""
                                        } ${alert.isNew ? "border-l-4 border-l-[#7FFF00]" : ""}`}
                                    onClick={() => handleSelectAlert(alert)}
                                >
                                    {/* Imagen a la izquierda */}
                                    <div className="mr-4 w-24 h-24 flex-shrink-0 overflow-hidden rounded-md">
                                        <motion.img
                                            initial={{ scale: 1.1 }}
                                            animate={{ scale: 1 }}
                                            transition={{ duration: 0.5 }}
                                            src={alert.thumbnail || "/placeholder.svg"}
                                            alt={alert.details || "Alerta"}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                // Fallback a una imagen por defecto si hay error
                                                e.currentTarget.src = availableImages[0]
                                            }}
                                        />
                                    </div>

                                    {/* Contenido de texto a la derecha */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <div className="font-medium text-base truncate text-gray-800 pr-2">
                                                {alert.details || "Alerta sin detalles"}
                                            </div>
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.2 }}
                                                className="text-sm text-gray-500 ml-2 whitespace-nowrap"
                                            >
                                                {formatTime(alert.timestamp)}
                                            </motion.div>
                                        </div>
                                        <motion.div
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 }}
                                            className="text-sm text-gray-600 mt-2 truncate"
                                        >
                                            Equipo: {alert.codigoEquipo}
                                        </motion.div>
                                        <motion.div
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.2 }}
                                            className="text-sm text-gray-500 mt-1 truncate"
                                        >
                                            {alert.cameraName} — {alert.area}
                                        </motion.div>

                                        {/* Indicador de tipo de alerta */}
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.3, type: "spring" }}
                                            className="mt-3 flex items-center"
                                        >
                                            <div className="flex items-center mr-3">
                                                <div
                                                    className={`size-5 rounded-full flex items-center justify-center mr-1 ${alert.nivelCriticidad === "critico"
                                                            ? "bg-red-600"
                                                            : alert.nivelCriticidad === "alto"
                                                                ? "bg-orange-500"
                                                                : alert.nivelCriticidad === "medio"
                                                                    ? "bg-yellow-500"
                                                                    : "bg-green-500"
                                                        }`}
                                                >
                                                    <motion.div
                                                        animate={{ scale: alert.isNew ? [1, 1.2, 1] : 1 }}
                                                        transition={{ repeat: alert.isNew ? Number.POSITIVE_INFINITY : 0, duration: 2 }}
                                                        className="size-2.5 bg-white rounded-full"
                                                    />
                                                </div>
                                                <span className="text-sm text-gray-600">{alert.nivelCriticidad}</span>
                                            </div>

                                            <div className="flex items-center">
                                                <span className="mr-1">{renderAlertIcon(alert.type)}</span>
                                                <span className="text-sm text-gray-600 capitalize">{alert.type}</span>
                                            </div>
                                        </motion.div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}

                    <div className="p-4 flex justify-center">
                        <button className="flex items-center text-sm text-gray-500 hover:text-gray-800 bg-gray-100 px-4 py-2 rounded-full">
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

            {/* Vista previa de la alerta - En desktop siempre visible, en móvil solo cuando showMobileDetail */}
            <div className={`flex-1 bg-white h-full flex-col ${showMobileDetail ? "flex" : "hidden md:flex"}`}>
                {selectedAlert ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="h-full flex flex-col"
                    >
                        {/* Título del panel de detalles con botón de regreso en móvil */}
                        <div className="sticky top-0 z-10 p-4 bg-[#0A1A40] text-white border-b border-gray-200 flex items-center">
                            {showMobileDetail && (
                                <button
                                    onClick={handleBackToList}
                                    className="mr-3 p-2 rounded-full hover:bg-[#152A5A] transition-colors"
                                    aria-label="Volver a la lista"
                                >
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
                                        <path d="M19 12H5"></path>
                                        <path d="M12 19l-7-7 7-7"></path>
                                    </svg>
                                </button>
                            )}
                            <h2 className="text-lg font-medium">Detalles de Alerta</h2>
                        </div>

                        {/* Imagen */}
                        <div className="p-4 bg-gray-50">
                            <div className="w-full aspect-video relative rounded-lg overflow-hidden">
                                <img
                                    src={selectedAlert.thumbnail || "/placeholder.svg"}
                                    alt={selectedAlert.details || "Vista previa de alerta"}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        // Fallback a una imagen por defecto si hay error
                                        e.currentTarget.src = availableImages[0]
                                    }}
                                />

                                {/* Indicador de tipo y criticidad */}
                                <div className="absolute top-3 left-3 flex items-center bg-black/70 text-white px-3 py-1.5 rounded-full">
                                    <span className="mr-2">{renderAlertIcon(selectedAlert.type)}</span>
                                    <span className="text-sm font-medium capitalize">{selectedAlert.type}</span>
                                </div>

                                <div
                                    className={`absolute top-3 right-3 px-3 py-1.5 rounded-full text-white text-sm font-medium ${selectedAlert.nivelCriticidad === "critico"
                                            ? "bg-red-600"
                                            : selectedAlert.nivelCriticidad === "alto"
                                                ? "bg-orange-500"
                                                : selectedAlert.nivelCriticidad === "medio"
                                                    ? "bg-yellow-500"
                                                    : "bg-green-500"
                                        }`}
                                >
                                    {selectedAlert.nivelCriticidad}
                                </div>
                            </div>
                        </div>

                        {/* Detalles de la alerta */}
                        <div className="p-4">
                            <h3 className="text-xl font-medium text-gray-800 mb-4">{selectedAlert.details}</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="text-sm font-medium text-gray-500 mb-1">Código de Equipo</h4>
                                    <p className="text-lg font-semibold">{selectedAlert.codigoEquipo}</p>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="text-sm font-medium text-gray-500 mb-1">Ubicación</h4>
                                    <p className="text-lg font-semibold">{selectedAlert.location}</p>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="text-sm font-medium text-gray-500 mb-1">Área</h4>
                                    <p className="text-lg font-semibold">{selectedAlert.area}</p>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="text-sm font-medium text-gray-500 mb-1">Fecha y Hora</h4>
                                    <p className="text-lg font-semibold">{formatDate(selectedAlert.timestamp)}</p>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg mb-6">
                                <h4 className="text-sm font-medium text-gray-500 mb-2">Cámara</h4>
                                <p className="text-lg font-semibold">{selectedAlert.cameraName}</p>
                            </div>

                            {/* Acciones */}
                            <div className="flex flex-col sm:flex-row gap-3 mt-6">
                                <button className="flex-1 bg-[#0A1A40] hover:bg-[#152A5A] text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="size-5 mr-2"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M9 12l2 2 4-4"></path>
                                        <circle cx="12" cy="12" r="10"></circle>
                                    </svg>
                                    Resolver Alerta
                                </button>

                                <button className="flex-1 border border-[#0A1A40] text-[#0A1A40] font-medium py-3 px-4 rounded-lg flex items-center justify-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="size-5 mr-2"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                    </svg>
                                    Añadir Nota
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500 p-6">
                        <div className="text-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="size-16 mx-auto mb-4 text-gray-400"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"></path>
                            </svg>
                            <p className="text-lg">Selecciona una alerta para ver los detalles</p>
                            <p className="mt-2 text-gray-400">Las alertas aparecerán aquí cuando se detecten</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AlertsList

