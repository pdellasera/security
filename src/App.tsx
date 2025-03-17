// "use client"

// import type React from "react"
// import { useState } from "react"
// import CameraGrid from "./components/CameraGrid"
// import Sidebar from "./components/Sidebar"
// import { cameras } from "./data/cameras"
// import "./index.css"

// const App: React.FC = () => {
//   const [activeFilter, setActiveFilter] = useState<string | null>(null)

//   return (
//     <div className="flex h-screen bg-gray-50">
//       {/* Sidebar */}
//       <Sidebar />

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col overflow-hidden">
//         <header className="bg-[#0A1A40] shadow-sm z-10 text-white">
//           {/* Top Navigation */}
//           <div className="flex items-center px-4 py-3">
//             <div className="bg-[#152A5A] text-white rounded-full px-4 py-2 flex items-center shadow-sm">
//               <span className="mr-2 text-sm font-medium">Todos los Sitios</span>
//               <svg xmlns="http://www.w3.org/2000/svg" className="size-4" viewBox="0 0 20 20" fill="currentColor">
//                 <path
//                   fillRule="evenodd"
//                   d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//             </div>

//             <nav className="flex items-center ml-6 gap-6">
//               <a href="#" className="text-[#7FFF00] font-medium border-b-2 border-[#7FFF00] pb-2 text-sm">
//                 Cámaras
//               </a>
//               <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors duration-200">
//                 Acceso
//               </a>
//               <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors duration-200">
//                 Entorno
//               </a>
//               <a
//                 href="#"
//                 className="text-gray-300 hover:text-white flex items-center text-sm transition-colors duration-200"
//               >
//                 Invitado
//                 <span className="ml-1 text-xs bg-[#7FFF00] text-[#0A1A40] px-1 rounded font-bold">NUEVO</span>
//               </a>
//             </nav>

//             <button className="p-2 bg-[#152A5A] rounded-full shadow-sm ml-4 hover:bg-[#0A1A40] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#7FFF00] focus:ring-opacity-50">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="size-5 text-white"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//                 />
//               </svg>
//             </button>

//             <div className="ml-auto flex items-center gap-2">
//               <button className="bg-[#152A5A] text-white rounded-full px-4 py-2 text-sm font-medium shadow-sm hover:bg-[#0A1A40] border border-[#7FFF00]/30 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#7FFF00] focus:ring-opacity-50">
//                 Cuadrículas
//               </button>
//               <button className="bg-[#152A5A] text-white rounded-full px-4 py-2 text-sm font-medium shadow-sm hover:bg-[#0A1A40] border border-[#7FFF00]/30 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#7FFF00] focus:ring-opacity-50">
//                 Archivo
//               </button>
//               {/* <button className="bg-[#152A5A] text-white rounded-full px-4 py-2 text-sm font-medium shadow-sm hover:bg-[#0A1A40] border border-[#7FFF00]/30 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#7FFF00] focus:ring-opacity-50">
//                 Planos
//               </button> */}
//               <button className="bg-[#7FFF00] text-[#0A1A40] rounded-full px-4 py-2 text-sm font-medium shadow-sm hover:bg-[#65CC00] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50">
//                 Gestionar Sitios
//               </button>
//             </div>
//           </div>
//         </header>

//         <div className="px-4 py-3 bg-[#152A5A] border-b border-[#0A1A40]/50 text-white">
//           <div className="flex items-center">
//             <div className="flex items-center text-sm">
//               <span className="font-medium">Exterior</span>
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="size-4 mx-1 text-gray-400"
//                 viewBox="0 0 20 20"
//                 fill="currentColor"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//               <span>HQ - Synergy - 1</span>
//             </div>

//             <div className="ml-auto flex gap-2">
//               <div className="flex bg-[#0A1A40] rounded-lg p-1">
//                 <button
//                   className={`px-3 py-1 text-xs font-medium rounded-md transition-colors duration-200 ${activeFilter === "online" ? "bg-[#7FFF00] text-[#0A1A40] shadow-sm" : "text-gray-300 hover:text-white"}`}
//                   onClick={() => setActiveFilter(activeFilter === "online" ? null : "online")}
//                 >
//                   En línea
//                 </button>
//                 <button
//                   className={`px-3 py-1 text-xs font-medium rounded-md transition-colors duration-200 ${activeFilter === "offline" ? "bg-[#7FFF00] text-[#0A1A40] shadow-sm" : "text-gray-300 hover:text-white"}`}
//                   onClick={() => setActiveFilter(activeFilter === "offline" ? null : "offline")}
//                 >
//                   Fuera de línea
//                 </button>
//               </div>

//               <div className="relative">
//                 <input
//                   type="text"
//                   placeholder="Buscar cámaras..."
//                   className="pl-9 pr-4 py-1.5 text-sm rounded-lg border border-[#7FFF00]/30 bg-[#0A1A40] focus:outline-none focus:ring-2 focus:ring-[#7FFF00] focus:border-transparent w-48 text-white placeholder-gray-400"
//                 />
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="size-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//                   />
//                 </svg>
//               </div>
//             </div>
//           </div>
//         </div>

//         <main className="flex-1 overflow-y-auto p-4 bg-[#0A1A40]/10">
//           <CameraGrid
//             cameras={
//               activeFilter
//                 ? cameras.filter((camera) =>
//                     activeFilter === "online" ? camera.status === "online" : camera.status === "offline",
//                   )
//                 : cameras
//             }
//           />

//           <div className="fixed bottom-4 right-4">
//             <button className="bg-[#7FFF00] text-[#0A1A40] rounded-full p-3 shadow-lg flex items-center justify-center hover:bg-[#65CC00] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 font-medium">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="size-5 mr-1"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               >
//                 <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
//                 <line x1="8" y1="2" x2="8" y2="18"></line>
//                 <line x1="16" y1="6" x2="16" y2="22"></line>
//               </svg>
//               <span className="text-sm font-medium">Mapa</span>
//             </button>
//           </div>
//         </main>
//       </div>
//     </div>
//   )
// }

// export default App


import { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import router from "@/navigate"
import "./index.css";
import SplashScreen from '@/components/splashScreen';

const App = () => {
  return (
    <Suspense fallback={<SplashScreen />}>
        <RouterProvider router={router} />
    </Suspense>
  );
};

export default App;
