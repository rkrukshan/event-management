import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function UserEventBooking() {
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);

  const userId = 1;

  useEffect(() => {
    axios
      .get("http://localhost:5206/api/Events")
      .then((response) => setEvents(response.data))
      .catch((error) => console.error("Error fetching events:", error));
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:5206/api/EventBookings")
      .then((response) => {
        const userBookings = response.data.filter(
          (b: any) => b.userId === userId
        );
        setBookings(userBookings);
      })
      .catch((error) => console.error("Error fetching bookings:", error));
  }, []);

  const handleBooking = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedEvent) return;

    const booking = {
      eventId: selectedEvent.id,
      userId: userId,
    };

    try {
      const response = await axios.post(
        "http://localhost:5206/api/EventBookings",
        booking
      );
      toast.success(`Successfully booked ${selectedEvent.name}!`);

      setBookings([...bookings, response.data]);

      setSelectedEvent(null);
    } catch (err: any) {
      toast.error(err.response?.data || "Failed to book event");
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Toaster position="top-right" />

      <h1 className="text-2xl font-bold mb-6">Available Events</h1>

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
              <td className="p-3">
                {new Date(event.startDate).toLocaleDateString()}
              </td>
              <td className="p-3">
                {new Date(event.endDate).toLocaleDateString()}
              </td>
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

      {selectedEvent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            <h2 className="text-xl font-bold mb-4">
              Book Event: {selectedEvent.name}
            </h2>
            <form onSubmit={handleBooking} className="space-y-4">
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
                  {b.eventName} - {b.userName}
                </span>
                <span className="text-sm text-gray-600">
                  {new Date(b.bookingDate).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
