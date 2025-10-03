import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ManageEvent() {
  const [showDashboard, setShowDashboard] = useState(true);
  const [events, setEvents] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [selectedEventBookings, setSelectedEventBookings] = useState<any[]>([]);
  const [showBookings, setShowBookings] = useState(false);

  const [editingEvent, setEditingEvent] = useState<any>(null); // for edit

  // Fetch events
  const fetchEvents = () => {
    axios
      .get("http://localhost:5297/api/Events")
      .then((res) => setEvents(res.data))
      .catch((err) => console.error(err));
  };

  // Fetch bookings
  const fetchBookings = () => {
    axios
      .get("http://localhost:5297/api/EventBookings")
      .then((res) => setBookings(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchEvents();
    fetchBookings();
    const interval = setInterval(fetchBookings, 5000);
    return () => clearInterval(interval);
  }, []);

  // Delete
  const handleDelete = (eventId: number) => {
    if (confirm("Are you sure you want to delete this event?")) {
      axios
        .delete(`http://localhost:5297/api/Events/${eventId}`)
        .then(() => setEvents(events.filter((e) => e.id !== eventId)))
        .catch((err) => console.error(err));
    }
  };

  // View bookings
  const handleViewBookings = (eventId: number) => {
    const eventBookings = bookings.filter((b) => b.eventId === eventId);
    setSelectedEventBookings(eventBookings);
    setShowBookings(true);
    setShowDashboard(false);
  };

  // Edit
  const handleEdit = (event: any) => {
    setEditingEvent(event);
  };

  // Save edited event
  const handleSaveEdit = async () => {
    try {
      await axios.put(`http://localhost:5297/api/Events/${editingEvent.id}`, {
        name: editingEvent.name,
        startDate: editingEvent.startDate,
        endDate: editingEvent.endDate,
      });
      // Update local state
      setEvents(events.map((e) => (e.id === editingEvent.id ? editingEvent : e)));
      setEditingEvent(null);
    } catch (err) {
      console.error(err);
      alert("Failed to update event");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="p-6">
        {/* Events Dashboard */}
        {showDashboard && (
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-2xl font-bold mb-4">Events</h2>
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border px-4 py-2">Event Name</th>
                   <th className="border px-4 py-2">Description</th>
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
                     <td className="border px-4 py-2">{event.description}</td>
                    <td className="border px-4 py-2">
                      {new Date(event.startDate).toLocaleDateString()}
                    </td>
                    <td className="border px-4 py-2">
                      {new Date(event.endDate).toLocaleDateString()}
                    </td>
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

       {/* Edit Event Modal */}
{editingEvent && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
    <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
      <h2 className="text-xl font-bold mb-4">Edit Event</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            value={editingEvent.name}
            onChange={(e) =>
              setEditingEvent({ ...editingEvent, name: e.target.value })
            }
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            value={editingEvent.description || ""}
            onChange={(e) =>
              setEditingEvent({ ...editingEvent, description: e.target.value })
            }
            className="w-full border px-3 py-2 rounded"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Start Date</label>
          <input
            type="date"
            value={editingEvent.startDate.split("T")[0]}
            onChange={(e) =>
              setEditingEvent({ ...editingEvent, startDate: e.target.value })
            }
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">End Date</label>
          <input
            type="date"
            value={editingEvent.endDate.split("T")[0]}
            onChange={(e) =>
              setEditingEvent({ ...editingEvent, endDate: e.target.value })
            }
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={() => setEditingEvent(null)}
            className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveEdit}
            className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
)}


        {/* Bookings Table */}
        {showBookings && (
          <div className="bg-white p-4 rounded shadow mt-6">
            <h2 className="text-2xl font-bold mb-4">User's Event Bookings</h2>
            <button
              className="mb-4 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-400"
              onClick={() => {
                setShowDashboard(true);
                setShowBookings(false);
              }}
            >
              Back to Events
            </button>
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border px-4 py-2">User Name</th>
                  <th className="border px-4 py-2">Booking Date</th>
                </tr>
              </thead>
              <tbody>
                {selectedEventBookings.length > 0 ? (
                  selectedEventBookings.map((b) => (
                    <tr key={b.id} className="border-b">
                      <td className="border px-4 py-2">{b.userName}</td>
                      <td className="border px-4 py-2">
                        {new Date(b.bookingDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={3}
                      className="border px-4 py-2 text-center text-gray-500"
                    >
                      No bookings yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
