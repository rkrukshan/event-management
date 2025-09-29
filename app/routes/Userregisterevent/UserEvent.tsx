import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function UserEventBooking() {
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);

  // Example Events Data (you can fetch from backend later)
  const events = [
    { id: 1, name: "Annual Tech Summit 2024", startdate: "2025-10-10", enddate: "2025-10-13" },
    { id: 2, name: "Innovation Workshop", startdate: "2025-11-15", enddate: "2025-11-20" },
    { id: 3, name: "Startup Meetup", startdate: "2025-12-05", enddate: "2025-12-10" },
  ];

  const handleBooking = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const booking = {
      eventId: selectedEvent.id,
      eventName: selectedEvent.name,
      name: formData.get("name"),
      email: formData.get("email"),
    };

    setBookings([...bookings, booking]);
    toast.success(`Successfully booked "${selectedEvent.name}"!`);

    setSelectedEvent(null); // Close form
    e.currentTarget.reset();
  };

  return (
    <div className="container mx-auto p-6">
      <Toaster position="top-right" />

      <h1 className="text-2xl font-bold mb-6">Available Events</h1>

      {/* Events Table */}
      <table className="w-full border border-gray-200 shadow-sm rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Event Name</th>
            <th className="p-3">Start Date</th>
            <th className="p-3">End Date</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id} className="border-t">
              <td className="p-3">{event.name}</td>
              <td className="p-3">{event.startdate}</td>
              <td className="p-3">{event.enddate}</td>
              <td className="p-3 text-center">
                <button
                  onClick={() => setSelectedEvent(event)}
                  className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                >
                  Book Now
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Booking Form Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            <h2 className="text-xl font-bold mb-4">
              Book Event: {selectedEvent.name}
            </h2>
            <form onSubmit={handleBooking} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Your Name</label>
                <input
                  name="name"
                  type="text"
                  required
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Your Email</label>
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setSelectedEvent(null)}
                  className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* My Bookings Section */}
      {bookings.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4">My Bookings</h2>
          <ul className="space-y-2">
            {bookings.map((b, index) => (
              <li
                key={index}
                className="p-3 border rounded bg-gray-50 flex justify-between"
              >
                <span>
                  {b.eventName} - {b.name} ({b.email})
                </span>
                <span className="text-sm text-gray-600">Booked</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
