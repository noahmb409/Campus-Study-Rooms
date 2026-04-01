# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  ## Campus Study Room Finder

  Campus Study Room Finder is a small React + TypeScript web application that helps students discover and filter study spaces across campus.

  It demonstrates a realistic front-end for browsing room inventory, applying rich filters (building, capacity, features), and simulating time-based availability and booking requests.

  ---

  ## Project Overview

  The application presents a catalog of study rooms sourced from a static data set. Users can:

  - Filter rooms by building, minimum capacity, and room features.
  - Choose a date and time range to see which rooms are available.
  - Open a detailed view for a specific room.
  - Submit a simulated “booking request” for the selected room and time window.

  The goal is to provide a clear, extendable structure for a campus space-finder style UI that could later be connected to a real backend or reservation system.

  ---

  ## Key Features

  - Building and capacity filters with live updates.
  - Feature-based filtering (e.g., whiteboard, monitor, quiet).
  - Date and time range selection that filters rooms based on simulated availability.
  - Modal-style room details view with room metadata and amenities.
  - Simple booking request flow (front-end only, no persistence).
  - Type-safe data model for rooms using TypeScript.

  ---

  ## Technology Stack

  - **Framework:** React
  - **Language:** TypeScript
  - **Build tool / Dev server:** Vite
  - **Tooling:**
    - ESLint (TypeScript + React rules)
    - Modern ES modules and JSX/TSX

  ---

  ## Application Architecture

  At a high level, the application is a single-page React app composed of a few focused components and a static data module:

  - **`src/rooms.ts`**
    - Defines the `StudyRoom` type and the `STUDY_ROOMS` array used as the in-memory dataset.

  - **`src/App.tsx`**
    - Top-level application component.
    - Holds the primary state for:
      - Active room filters (building, capacity, features) via `RoomFilters`.
      - Date and time range (`selectedDate`, `startTime`, `endTime`).
      - The list of rooms after applying the room filters.
      - The currently selected room for details/booking (`selectedRoom`).
    - Computes `visibleRooms` by combining:
      - Filtering from `RoomFilters` (building/capacity/features).
      - Time-based availability filtering via helper functions.
    - Renders:
      - The filters panel (`RoomFilters`).
      - Availability inputs (date and time range fields).
      - The room list (`RoomList`).
      - The room details modal (`RoomDetails`).

  - **`src/RoomFilters.tsx`**
    - Encapsulates UI and state for building, minimum capacity, and features.
    - Accepts all rooms and an `onFilterChange` callback.
    - Applies filter logic and returns the filtered list and current filter values to `App`.

  - **`src/roomDetails.tsx`**
    - Modal-style component that displays detailed information for a single `StudyRoom`.
    - Accepts `room`, `onClose`, and `onRequestBooking` props.
    - Renders building, room number, capacity, floor, features, and amenity flags (quiet, whiteboard, monitor).

  - **`src/main.tsx`**
    - Entry point that mounts the React app into the DOM.

  **Data flow (high level):**

  1. `STUDY_ROOMS` is the source of truth for all rooms.
  2. `RoomFilters` takes `STUDY_ROOMS`, applies building/capacity/feature filters, and passes the filtered rooms back up via `onFilterChange`.
  3. `App` stores these filtered rooms and then applies a time-based availability filter using helper functions.
  4. The resulting `visibleRooms` are passed to `RoomList` for display.
  5. When a room card is clicked, `App` updates `selectedRoom`, and `RoomDetails` is rendered as a modal.
  6. Booking requests trigger a simple confirmation message that includes the selected date/time.

  ---

  ## Getting Started

  ### Prerequisites

  - Node.js (LTS version recommended)
  - npm (comes with Node.js) or a compatible package manager

  ### Installation

  Clone the repository and install dependencies:

  ```bash
  git clone <your-repo-url>.git
  cd study-room-finder/campus-study-rooms
  npm install
  ```

  ### Running the Development Server

  Start the Vite dev server:

  ```bash
  npm run dev
  ```

  Then open the URL printed in the terminal (by default, `http://localhost:5173/`).

  ### Building for Production

  ```bash
  npm run build
  ```

  To preview the production build locally:

  ```bash
  npm run preview
  ```

  ---

  ## Folder Structure

  Key folders and files for this app:

  ```text
  campus-study-rooms/
  ├─ index.html
  ├─ package.json
  ├─ vite.config.ts
  ├─ tsconfig.json
  ├─ public/
  └─ src/
     ├─ main.tsx           # React entry point
     ├─ App.tsx            # Root application component and high-level state
     ├─ RoomFilters.tsx    # Filter controls and logic
     ├─ roomDetails.tsx    # Room details modal component
     ├─ rooms.ts           # StudyRoom type and room dataset
     ├─ App.css            # App-specific styles
     ├─ index.css          # Global styles
     └─ assets/            # Static assets (images, icons, etc.)
  ```

  ---

  ## How Availability Is Simulated

  Availability is computed entirely on the client using a simple, deterministic rule set. There is no backend or real calendar integration.

  - `App.tsx` defines helper functions such as `isRoomAvailable` and `filterByAvailability`.
  - `isRoomAvailable(room, date, startTime, endTime)`:
    - Parses the selected start and end times.
    - Derives the day of the week from the selected date.
    - Applies a series of deterministic rules based on the room’s building and floor. For example (illustrative rules):
      - Some buildings are marked “busy” during midday on weekdays.
      - Certain floors in the Science Center may be busy in the morning.
      - Engineering Hall rooms may be busy in late afternoon.
      - Business School rooms may be busy on Friday afternoons.
  - If a room is considered busy for the selected date/time, it is excluded from the list of visible rooms.

  This approach makes availability predictable and easily adjustable while keeping the app fully front-end only.

  ---

  ## Future Enhancements / Roadmap

  Potential next steps for this project include:

  - **Real booking backend:** Integrate with an API for real availability and reservations.
  - **Authentication:** Allow users to sign in with campus credentials and manage their bookings.
  - **Room photos and maps:** Add images and building floor maps for better context.
  - **Advanced filtering:** Add filters for time-of-day presets, equipment combinations, or accessibility features.
  - **Persisted preferences:** Remember a user’s preferred buildings or capacities.
  - **Testing:** Add unit and integration tests (e.g., React Testing Library, Vitest).

  ---

  ## Contribution Guidelines

  Contributions are welcome. To propose changes:

  1. Fork the repository and create a feature branch.
  2. Make your changes in `campus-study-rooms/src/` and update or add documentation as needed.
  3. Run the application locally (`npm run dev`) to verify everything works.
  4. Open a pull request with a clear description of the change and any relevant screenshots.

  For larger features, consider opening an issue first to discuss the approach.

  ---

  ## License

  This project is currently provided under a placeholder license. Replace this section with your chosen license (for example, MIT, Apache 2.0, or an internal company license) before using in production.
