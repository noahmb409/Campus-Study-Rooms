import './App.css'
import { STUDY_ROOMS, type StudyRoom } from './rooms'

function App() {
  return (
    <div className="app-root">
      <header className="app-header">
        <h1>Campus Study Room Finder</h1>
        <p>Browse and discover study spaces across campus.</p>
      </header>

      <main className="app-layout">
        <section className="filters-panel">
          <h2>Filters</h2>
          <p>(Coming soon)</p>
        </section>

        <section className="rooms-panel">
          <h2>Study Rooms</h2>
          <RoomList rooms={STUDY_ROOMS} />
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
