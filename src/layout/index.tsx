"use client"

import type React from "react"
import { useState, useEffect } from "react"

// Importar Framer Motion al inicio del archivo
import { motion, AnimatePresence } from "framer-motion"
import { useAlerts } from "@/components/AlertsContext"
import AlertNotification from "@/components/AlertNotification"
import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"
import { Link, useLocation } from "react-router"


interface LayouProps {
    children: React.ReactNode
}
const App: React.FC<LayouProps> = ({ children }) => {
    const path = useLocation()
    const [activeFilter, setActiveFilter] = useState<string | null>(null)
    const [sidebarOpen, setSidebarOpen] = useState(false) // Cerrado por defecto en móvil
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

    // Detectar si es un dispositivo táctil
    useEffect(() => {
        const checkIfTouchDevice = () => {
            return "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.maxTouchPoints > 0
        }

        const isTouchDevice = checkIfTouchDevice()
        if (isTouchDevice) {
            document.body.classList.add("touch-device")
        }
    }, [])

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen)
    }

    // Cerrar sidebar al cambiar de página en móvil
    useEffect(() => {
        if (isMobile) {
            setSidebarOpen(false)
        }
    }, [path.pathname, isMobile])

    // Añadir el componente de notificación dentro del componente App
    const { notificationVisible, notificationMessage, notificationType, hideNotification } = useAlerts()

    return (
        <div className="flex flex-col h-screen bg-gray-50 overflow-hidden md:flex-row">
            <AlertNotification
                show={notificationVisible}
                message={notificationMessage}
                type={notificationType}
                onClose={hideNotification}
            />

            {/* Sidebar - Condicional en móvil */}
            <AnimatePresence>
                {(sidebarOpen || !isMobile) && (
                    <>
                        {/* Overlay para cerrar sidebar en móvil */}
                        {sidebarOpen && isMobile && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="fixed inset-0 bg-black/50 z-20"
                                onClick={toggleSidebar}
                            />
                        )}

                        <motion.div
                            initial={isMobile ? { x: -80 } : { x: 0 }}
                            animate={{ x: 0 }}
                            exit={isMobile ? { x: -80 } : { x: 0 }}
                            transition={{ duration: 0.3 }}
                            className={`${isMobile ? "fixed left-0 top-0 bottom-0 z-30" : "relative z-10"}`}
                        >
                            <Sidebar />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header con búsqueda y "Manage Sites" */}
                <Header
                    toggleSidebar={toggleSidebar}
                    title={path.pathname === "/" ? "Cámaras" : "Alertas"}
                    subtitle={path.pathname === "/" ? "Todas las cámaras" : "Todas las alertas"}
                />

                {/* Navegación principal - Versión mobile first */}
                <div className="bg-[#0A1A40] shadow-sm z-10 text-white">
                    <div className="px-4 py-3">
                        {/* Selector de sitio - Siempre visible */}
                        <div className="flex items-center justify-between mb-3">
                            <div className="bg-[#152A5A] text-white rounded-full px-4 py-2 flex items-center shadow-sm whitespace-nowrap">
                                <span className="mr-2 text-sm font-medium">Todos los Sitios</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="size-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path
                                        fillRule="evenodd"
                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>

                            {/* Botones de acción contextuales - Siempre visibles */}
                            <div className="flex items-center gap-2">
                                {path.pathname === "/" ? (
                                    <button className="bg-[#152A5A] text-white rounded-full w-10 h-10 flex items-center justify-center shadow-sm hover:bg-[#0A1A40] border border-[#7FFF00]/30 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#7FFF00] focus:ring-opacity-50 md:w-auto md:px-4">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="size-5 md:mr-2"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <rect x="3" y="3" width="7" height="7"></rect>
                                            <rect x="14" y="3" width="7" height="7"></rect>
                                            <rect x="14" y="14" width="7" height="7"></rect>
                                            <rect x="3" y="14" width="7" height="7"></rect>
                                        </svg>
                                        <span className="hidden md:inline text-sm font-medium">Cuadrículas</span>
                                    </button>
                                ) : (
                                    <button className="bg-[#152A5A] text-white rounded-full w-10 h-10 flex items-center justify-center shadow-sm hover:bg-[#0A1A40] border border-[#7FFF00]/30 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#7FFF00] focus:ring-opacity-50 md:w-auto md:px-4">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="size-5 md:mr-2"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                                        </svg>
                                        <span className="hidden md:inline text-sm font-medium">Filtros</span>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Navegación principal - Tabs */}
                        <div className="flex items-center overflow-x-auto scrollbar-hide -mx-4 px-4 pb-1">
                            <Link to="/" className="flex items-center justify-center">

                                <button
                                    className={`flex items-center justify-center min-w-[80px] px-3 py-2 mr-2 rounded-md transition-colors duration-200 ${path.pathname === "/"
                                        ? "bg-[#152A5A] text-[#7FFF00] font-medium"
                                        : "text-gray-300 hover:text-white hover:bg-[#152A5A]/50"
                                        }`}
                                >
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
                                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                                        <circle cx="12" cy="13" r="4"></circle>
                                    </svg>
                                    <span className="text-sm whitespace-nowrap">Cámaras</span>
                                </button>
                            </Link>

                            <Link to="/alerts" className="flex items-center justify-center">
                                <button
                                    className={`flex items-center justify-center min-w-[80px] px-3 py-2 mr-2 rounded-md transition-colors duration-200 ${path.pathname === "/alerts"
                                        ? "bg-[#152A5A] text-[#7FFF00] font-medium"
                                        : "text-gray-300 hover:text-white hover:bg-[#152A5A]/50"
                                        }`}
                                >
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
                                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                                        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                                    </svg>
                                    <span className="text-sm whitespace-nowrap">Alertas</span>
                                </button>

                            </Link>


                            <button className="flex items-center justify-center min-w-[80px] px-3 py-2 mr-2 rounded-md transition-colors duration-200 text-gray-300 hover:text-white hover:bg-[#152A5A]/50">
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
                                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                                    <polyline points="10 17 15 12 10 7"></polyline>
                                    <line x1="15" y1="12" x2="3" y2="12"></line>
                                </svg>
                                <span className="text-sm whitespace-nowrap">Acceso</span>
                            </button>

                            <button className="flex items-center justify-center min-w-[80px] px-3 py-2 mr-2 rounded-md transition-colors duration-200 text-gray-300 hover:text-white hover:bg-[#152A5A]/50">
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
                                    <path d="M2 12h6"></path>
                                    <path d="M22 12h-6"></path>
                                    <path d="M12 2v6"></path>
                                    <path d="M12 22v-6"></path>
                                    <path d="M20 16l-4-4 4-4"></path>
                                    <path d="M4 8l4 4-4 4"></path>
                                    <path d="M16 4l-4 4-4-4"></path>
                                    <path d="M8 20l4-4 4 4"></path>
                                </svg>
                                <span className="text-sm whitespace-nowrap">Entorno</span>
                            </button>

                            <button className="flex items-center justify-center min-w-[80px] px-3 py-2 mr-2 rounded-md transition-colors duration-200 text-gray-300 hover:text-white hover:bg-[#152A5A]/50">
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
                                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                                    <line x1="12" y1="9" x2="12" y2="13"></line>
                                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                                </svg>
                                <span className="text-sm whitespace-nowrap">Alarmas</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="px-4 py-3 bg-[#152A5A] border-b border-[#0A1A40]/50 text-white overflow-x-auto">
                    <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0">
                        <div className="flex items-center text-sm whitespace-nowrap">
                            <span className="font-medium">Exterior</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="size-4 mx-1 text-gray-400"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span>HQ - Synergy - 1</span>
                        </div>

                        <div className="md:ml-auto flex flex-wrap gap-2">
                            <div className="flex bg-[#0A1A40] rounded-lg p-1">
                                <button
                                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors duration-200 ${activeFilter === "online" ? "bg-[#7FFF00] text-[#0A1A40] shadow-sm" : "text-gray-300 hover:text-white"}`}
                                    onClick={() => setActiveFilter(activeFilter === "online" ? null : "online")}
                                >
                                    En línea
                                </button>
                                <button
                                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors duration-200 ${activeFilter === "offline" ? "bg-[#7FFF00] text-[#0A1A40] shadow-sm" : "text-gray-300 hover:text-white"}`}
                                    onClick={() => setActiveFilter(activeFilter === "offline" ? null : "offline")}
                                >
                                    Fuera de línea
                                </button>
                            </div>

                            <div className="relative flex-1 min-w-[200px]">
                                <input
                                    type="text"
                                    placeholder="Buscar cámaras..."
                                    className="w-full pl-9 pr-4 py-1.5 text-sm rounded-lg border border-[#7FFF00]/30 bg-[#0A1A40] focus:outline-none focus:ring-2 focus:ring-[#7FFF00] focus:border-transparent text-white placeholder-gray-400"
                                />
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="size-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                <main className="flex-1 overflow-y-auto p-3 md:p-4 bg-[#0A1A40]/10">
                    {children}

                    <div className="fixed bottom-4 right-4">
                        <button className="bg-[#7FFF00] text-[#0A1A40] rounded-full p-3 shadow-lg flex items-center justify-center hover:bg-[#65CC00] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 font-medium">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="size-5 mr-1"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
                                <line x1="8" y1="2" x2="8" y2="18"></line>
                                <line x1="16" y1="6" x2="16" y2="22"></line>
                            </svg>
                            <span className="text-sm font-medium">Mapa</span>
                        </button>
                    </div>
                </main>

            </div>
        </div>
    )
}

export default App

