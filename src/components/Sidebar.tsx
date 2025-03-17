import type React from "react"
import { Link } from "react-router"

const Sidebar: React.FC = () => {
  return (
    <div className="w-20 bg-white border-r border-gray-200 text-gray-700 flex flex-col items-center shadow-sm">
      {/* Logo */}
      <div className="py-6 flex flex-col items-center">
        <div className="size-12 rounded-full bg-[#0A1A40] flex items-center justify-center text-white shadow-sm">
          <div className="relative size-8">
            {/* Stylized globe with green stripes similar to the Synergy logo */}
            <div className="absolute inset-0 rounded-full bg-[#0A1A40]"></div>
            <div className="absolute h-1 w-6 bg-[#7FFF00] rounded-full top-1 left-1"></div>
            <div className="absolute h-1 w-5 bg-[#7FFF00] rounded-full top-3 left-1.5"></div>
            <div className="absolute h-1 w-4 bg-[#7FFF00] rounded-full top-5 left-2"></div>
          </div>
        </div>
        <div className="mt-2 text-xs font-medium text-center">
          <div>SYNERGY</div>
          <div>GLOBAL</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 w-full">
        <ul className="flex flex-col items-center">
          <li className="w-full py-4 flex flex-col items-center text-[#0A1A40] relative">
            <div className="absolute left-0 w-1 h-8 bg-[#0A1A40] rounded-r-md"></div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span className="text-xs mt-1 font-medium">Inicio</span>
          </li>
          <li className="w-full py-4 flex flex-col items-center text-gray-500 hover:text-[#0A1A40] transition-colors duration-200">
            <Link to="/alerts" className="flex flex-col items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span className="text-xs mt-1 font-medium">Alertas</span>
            </Link>

          </li>
          <li className="w-full py-4 flex flex-col items-center text-gray-500 hover:text-[#0A1A40] transition-colors duration-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-6"
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
            <span className="text-xs mt-1 font-medium">Buscar</span>
          </li>
          <li className="w-full py-4 flex flex-col items-center text-gray-500 hover:text-[#0A1A40] transition-colors duration-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
              />
            </svg>
            <span className="text-xs mt-1 font-medium">Dispositivos</span>
          </li>
          <li className="w-full py-4 flex flex-col items-center text-gray-500 hover:text-[#0A1A40] transition-colors duration-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
            </svg>
            <span className="text-xs mt-1 font-medium">Ajustes</span>
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default Sidebar
