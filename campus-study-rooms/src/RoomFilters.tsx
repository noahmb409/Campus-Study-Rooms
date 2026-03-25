import { useEffect, useMemo, useState } from 'react'
import type { StudyRoom } from './rooms'

export type ActiveFilters = {
	building: string | null
	minCapacity: number | null
	features: string[]
}

type RoomFiltersProps = {
	allRooms: StudyRoom[]
	onFilterChange: (filteredRooms: StudyRoom[], activeFilters: ActiveFilters) => void
}

const FEATURE_OPTIONS: { label: string; value: string }[] = [
	{ label: 'Whiteboard', value: 'whiteboard' },
	{ label: 'Monitor', value: 'monitor' },
	{ label: 'Quiet', value: 'quiet' },
]

function applyFilters(rooms: StudyRoom[], filters: ActiveFilters): StudyRoom[] {
	return rooms.filter((room) => {
		if (filters.building && room.building !== filters.building) {
			return false
		}

		if (
			typeof filters.minCapacity === 'number' &&
			!Number.isNaN(filters.minCapacity) &&
			room.capacity < filters.minCapacity
		) {
			return false
		}

		if (filters.features.length > 0) {
			const roomFeatures = room.features.map((f) => f.toLowerCase())
			const hasAllSelected = filters.features.every((feature) =>
				roomFeatures.includes(feature.toLowerCase()),
			)
			if (!hasAllSelected) {
				return false
			}
		}

		return true
	})
}

export function RoomFilters({ allRooms, onFilterChange }: RoomFiltersProps) {
	const [filters, setFilters] = useState<ActiveFilters>({
		building: null,
		minCapacity: null,
		features: [],
	})

	const buildingOptions = useMemo(() => {
		const unique = new Set<string>()
		allRooms.forEach((room) => unique.add(room.building))
		return Array.from(unique).sort()
	}, [allRooms])

	useEffect(() => {
		const filtered = applyFilters(allRooms, filters)
		onFilterChange(filtered, filters)
	}, [allRooms, filters, onFilterChange])

	const handleBuildingChange = (
		event: React.ChangeEvent<HTMLSelectElement>,
	) => {
		const value = event.target.value || null
		setFilters((prev) => ({ ...prev, building: value }))
	}

	const handleMinCapacityChange = (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		const value = event.target.value
		const parsed = value === '' ? null : Number(value)
		setFilters((prev) => ({ ...prev, minCapacity: parsed }))
	}

	const handleFeatureToggle = (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		const { value, checked } = event.target
		setFilters((prev) => {
			const current = new Set(prev.features)
			if (checked) {
				current.add(value)
			} else {
				current.delete(value)
			}
			return { ...prev, features: Array.from(current) }
		})
	}

	return (
		<form
			className="filters-form"
			onSubmit={(event) => event.preventDefault()}
		>
			<div className="filters-group">
				<label className="filters-label" htmlFor="building-select">
					Building
				</label>
				<select
					id="building-select"
					value={filters.building ?? ''}
					onChange={handleBuildingChange}
				>
					<option value="">All buildings</option>
					{buildingOptions.map((building) => (
						<option key={building} value={building}>
							{building}
						</option>
					))}
				</select>
			</div>

			<div className="filters-group">
				<label className="filters-label" htmlFor="min-capacity-input">
					Minimum capacity
				</label>
				<input
					id="min-capacity-input"
					type="number"
					min={1}
					value={filters.minCapacity ?? ''}
					onChange={handleMinCapacityChange}
				/>
			</div>

			<fieldset className="filters-group">
				<legend className="filters-label">Features</legend>
				{FEATURE_OPTIONS.map((feature) => (
					<label key={feature.value} className="filters-checkbox">
						<input
							type="checkbox"
							value={feature.value}
							checked={filters.features.includes(feature.value)}
							onChange={handleFeatureToggle}
						/>
						<span>{feature.label}</span>
					</label>
				))}
			</fieldset>
		</form>
	)
}

export default RoomFilters

