import React, { useState } from "react";

// Sample event and booking data
const initialEvents = [
  { id: 1, name: "Tech Summit 2024", startDate: "2025-10-01", endDate: "2025-10-03" },
  { id: 2, name: "Workshop on AI", startDate: "2025-11-05", endDate: "2025-11-05" },
];

const bookings = [
  { id: 1, eventId: 1, user: "John Doe" },
  { id: 2, eventId: 1, user: "Jane Smith" },
  { id: 3, eventId: 2, user: "Alice Johnson" },
];

export default function Manageevent() {
  const [showDashboard, setShowDashboard] = useState(true);
  const [events, setEvents] = useState(initialEvents);
  const [selectedEventBookings, setSelectedEventBookings] = useState<any[]>([]);
  const [showBookings, setShowBookings] = useState(false);

  // Edit / Delete handlers
  const handleEdit = (event: any) => {
    alert(`Edit Event: ${event.name}`);
  };

  const handleDelete = (eventId: number) => {
    if (confirm("Are you sure you want to delete this event?")) {
      setEvents(events.filter((e) => e.id !== eventId));
    }
  };

  const handleViewBookings = (eventId: number) => {
    const eventBookings = bookings.filter((b) => b.eventId === eventId);
    setSelectedEventBookings(eventBookings);
    setShowBookings(true);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar
      <nav className="bg-gray-800 text-white p-4 flex justify-between">
        <h1 className="font-bold text-xl">Admin Dashboard</h1>
        <button
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => { setShowDashboard(true); setShowBookings(false); }}
        >
          Dashboard
        </button>
      </nav> */}
      

      {/* Content */}
      <main className="p-6">
        {showDashboard && (
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-2xl font-bold mb-4">Events</h2>
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border px-4 py-2">Event Name</th>
                  <th className="border px-4 py-2">Start Date</th>
                  <th className="border px-4 py-2">End Date</th>
                  <th className="border px-4 py-2">Actions</th>
                  <th className="border px-4 py-2">Bookings</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id} className="border-b">
                    <td className="border px-4 py-2">{event.name}</td>
                    <td className="border px-4 py-2">{event.startDate}</td>
                    <td className="border px-4 py-2">{event.endDate}</td>
                    <td className="border px-4 py-2 space-x-2">
                      <button
                        onClick={() => handleEdit(event)}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => handleViewBookings(event.id)}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      >
                        View Bookings
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Bookings Table */}
        {showBookings && (
          <div className="bg-white p-4 rounded shadow mt-6">
            <h2 className="text-2xl font-bold mb-4">User's Event Booking </h2>
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border px-4 py-2">User</th>
                </tr>
              </thead>
              <tbody>
                {selectedEventBookings.map((b) => (
                  <tr key={b.id} className="border-b">
                    <td className="border px-4 py-2">{b.user}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
