"use client"

import type React from "react"
import { createContext, useState, useContext } from "react"

interface AlertContextType {
  showNotification: (message: string, type?: "info" | "warning" | "error") => void
  hideNotification: () => void
  notificationVisible: boolean
  notificationMessage: string
  notificationType: "info" | "warning" | "error"
  alertCount: number
  incrementAlertCount: () => void
  resetAlertCount: () => void
}

const AlertContext = createContext<AlertContextType>({
  showNotification: () => {},
  hideNotification: () => {},
  notificationVisible: false,
  notificationMessage: "",
  notificationType: "info",
  alertCount: 0,
  incrementAlertCount: () => {},
  resetAlertCount: () => {},
})

export const useAlerts = () => useContext(AlertContext)

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notificationVisible, setNotificationVisible] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState("")
  const [notificationType, setNotificationType] = useState<"info" | "warning" | "error">("info")
  const [alertCount, setAlertCount] = useState(0)

  const showNotification = (message: string, type: "info" | "warning" | "error" = "info") => {
    setNotificationMessage(message)
    setNotificationType(type)
    setNotificationVisible(true)
  }

  const hideNotification = () => {
    setNotificationVisible(false)
  }

  const incrementAlertCount = () => {
    setAlertCount((prev) => prev + 1)
  }

  const resetAlertCount = () => {
    setAlertCount(0)
  }

  return (
    <AlertContext.Provider
      value={{
        showNotification,
        hideNotification,
        notificationVisible,
        notificationMessage,
        notificationType,
        alertCount,
        incrementAlertCount,
        resetAlertCount,
      }}
    >
      {children}
    </AlertContext.Provider>
  )
}

