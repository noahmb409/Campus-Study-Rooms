import './App.css'
import { useMemo, useState } from 'react'
import RoomFilters, { type ActiveFilters } from './RoomFilters'
import RoomDetails from './roomDetails'
import { STUDY_ROOMS, type StudyRoom } from './rooms'

// --- Availability helpers -------------------------------------------------

function parseTimeToMinutes(time: string): number | null {
  if (!time) return null
  const [hours, minutes] = time.split(':').map(Number)
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null
  return hours * 60 + minutes
}

export function isRoomAvailable(
  room: StudyRoom,
  date: string,
  startTime: string,
  endTime: string,
): boolean {
  if (!date || !startTime || !endTime) {
    return true
  }

  const startMinutes = parseTimeToMinutes(startTime)
  const endMinutes = parseTimeToMinutes(endTime)
  if (startMinutes == null || endMinutes == null || endMinutes <= startMinutes) {
    return true
  }

  const day = new Date(date).getDay() // 0 (Sun) - 6 (Sat)
  const buildingKey = room.building.toLowerCase()

  // Simple deterministic rules:
  // - Main Library: busy for midday slots on weekdays
  if (
    buildingKey.includes('main library') &&
    day >= 1 &&
    day <= 5 &&
    startMinutes < 14 * 60 &&
    endMinutes > 12 * 60
  ) {
    return false
  }

  // - Science Center: busy in mornings on even-numbered floor