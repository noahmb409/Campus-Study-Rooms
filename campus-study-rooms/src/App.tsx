import './App.css'
import { useMemo, useState } from 'react'
import RoomFilters, { type ActiveFilters } from './RoomFilters'
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

  // - Science Center: busy in mornings on even-numbered floors
  if (
    buildingKey.includes('science center') &&
    room.floor % 2 === 0 &&
    startMinutes < 11 * 60 &&
    endMinutes > 8 * 60
  ) {
    return false
  }

  // - Engineering Hall: busy for late-afternoon / early-evening
  if (
    buildingKey.includes('engineering hall') &&
    startMinutes < 19 * 60 &&
    endMinutes > 16 * 60
  ) {
    return false
  }

  // - Business School: busy on Fridays after 3pm
  if (
    buildingKey.includes('business school') &&
    day === 5 &&
    startMinutes < 18 * 60 &&
    endMinutes > 15 * 60
  ) {
    return false
  }

  return true
}

function filterByAvailability(
  rooms: StudyRoom[],
  date: string,
  startTime: string,
  endTime: string,
): StudyRoom[] {
  if (!date || !startTime || !endTime) {
    return rooms
  }

  return rooms.filter((room) => isRoomAvailable(room, date, startTime, endTime))
}

function App() {
  // Rooms after building/capacity/feature filters
  const [filteredByRoomFilters, setFilteredByRoomFilters] = useState<StudyRoom[]>(
    STUDY_ROOMS,
  )
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    building: null,
    minCapacity: null,
    features: [],
  })

  // Date / time selection state
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [startTime, setStartTime] = useState<string>('')
  const [endTime, setEndTime] = useState<string>('')

  const handleFilterChange = (
    rooms: StudyRoom[],
    filters: ActiveFilters,
  ): void => {
    setFilteredByRoomFilters(rooms)
    setActiveFilters(filters)
  }

  const visibleRooms = useMemo(
    () =>
      filterByAvailability(
        filteredByRoomFilters,
        selectedDate,
        startTime,
        endTime,
      ),
    [filteredByRoomFilters, selectedDate, startTime, endTime],
  )

  return (
    <div className="app-root">
      <header className="app-header">
        <h1>Campus Study Room Finder</h1>
        <p>Browse and discover study spaces across campus.</p>
      </header>

      <main className="app-layout">
        <section className="filters-panel">
          <h2>Filters</h2>
          <RoomFilters
            allRooms={STUDY_ROOMS}
            onFilterChange={handleFilterChange}
          />
        </section>

        <section className="rooms-panel">
          <h2>Study Rooms</h2>

          <div className="availability-filters">
            <div className="filters-group">
              <label className="filters-label" htmlFor="date-input">
                Date
              </label>
              <input
                id="date-input"
                type="date"
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
              />
            </div>

            <div className="filters-group">
              <label className="filters-label" htmlFor="start-time-input">
                Start time
              </label>
              <input
                id="start-time-input"
                type="time"
                value={startTime}
                onChange={(event) => setStartTime(event.target.value)}
              />
            </div>

            <div className="filters-group">
              <label className="filters-label" htmlFor="end-time-input">
                End time
              </label>
              <input
                id="end-time-input"
                type="time"
                value={endTime}
                onChange={(event) => setEndTime(event.target.value)}
              />
            </div>
          </div>

          <RoomList rooms={visibleRooms} />
        </section>
      </main>
    </div>
  )
}

type RoomListProps = {
  rooms: StudyRoom[]
}

function RoomList({ rooms }: RoomListProps) {
  if (!rooms.length) {
		return <p>No rooms available.</p>
	}

	return (
		<ul className="room-list">
			{rooms.map((room) => (
				<li key={room.id} className="room-card">
					<h3>
						{room.building} – Room {room.roomNumber}
					</h3>
					<p>Capacity: {room.capacity} students</p>
					<p>Floor: {room.floor}</p>
					<p>
						Features:
						{room.features.length ? (
							<span> {room.features.join(', ')}</span>
						) : (
							<span> None listed</span>
						)}
					</p>
				</li>
			))}
		</ul>
	)
}

export default App
