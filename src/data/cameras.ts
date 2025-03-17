import type { Camera } from "../types/Camera"

export const cameras: Camera[] = [
  {
    id: 1,
    name: "Estacionamiento CD41-E",
    location: "Exterior",
    status: "online",
    lastMotion: "2 min atrás",
  },
  {
    id: 2,
    name: "Subestación Eléctrica CD62-E",
    location: "Exterior",
    status: "online",
    lastMotion: "Ahora mismo",
  },
  {
    id: 3,
    name: "Línea de Transmisión CD51-E",
    location: "Exterior",
    status: "online",
    lastMotion: "1 min atrás",
  },
  {
    id: 4,
    name: "Transformador Principal CP81-E",
    location: "Exterior",
    status: "online",
    lastMotion: "5 min atrás",
  },
  {
    id: 5,
    name: "Estación de Control CB61-E",
    location: "Interior",
    status: "online",
    lastMotion: "3 min atrás",
  },
  {
    id: 6,
    name: "Cruce de Líneas CD41-E",
    location: "Exterior",
    status: "offline",
    lastMotion: "2 horas atrás",
  },
  {
    id: 7,
    name: "Subestación Sur CD31-E",
    location: "Exterior",
    status: "offline",
    lastMotion: "2 min atrás",
  },
  {
    id: 8,
    name: "Estación Este CD22-E",
    location: "Exterior",
    status: "online",
    lastMotion: "Ahora mismo",
  },
]

