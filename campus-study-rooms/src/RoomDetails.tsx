import type { StudyRoom } from './rooms'

export type RoomDetailsProps = {
	room: StudyRoom | null
	onClose: () => void
	onRequestBooking: (room: StudyRoom) => void
}

export function RoomDetails({ room, onClose, onRequestBooking }: RoomDetailsProps) {
	if (!room) {
		return null
	}

	return (
		<div className="room-details-overlay" role="dialog" aria-modal="true">
			<div className="room-details-card">
				<header className="room-details-header">
					<h2>
						{room.building} – Room {room.roomNumber}
					</h2>
				</header>

				<section className="room-details-body">
					<p>
						<strong>Capacity:</strong> {room.capacity} students
					</p>
					<p>
						<strong>Floor:</strong> {room.floor}
					</p>
					<p>
						<strong>Features:</strong>{' '}
						{room.features.length ? room.features.join(', ') : 'None listed'}
					</p>
					<ul className="room-details-flags">
						<li>{room.isQuiet ? 'Quiet space' : 'Not marked as quiet'}</li>
						<li>
							{room.hasWhiteboard
								? 'Includes whiteboard'
								: 'No whiteboard listed'}
						</li>
						<li>
							{room.hasMonitor
								? 'Includes monitor'
								: 'No monitor listed'}
						</li>
					</ul>
				</section>

				<footer className="room-details-actions">
					<button
						type="button"
						className="room-details-button primary"
						onClick={() => onRequestBooking(room)}
					>
						Request booking
					</button>
					<button
						type="button"
						className="room-details-button"
						onClick={onClose}
					>
						Close
					</button>
				</footer>
			</div>
		</div>
	)
}

export default RoomDetails

