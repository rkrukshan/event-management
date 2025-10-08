import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { TbBrandBooking } from "react-icons/tb";

export default function UserEventBooking() {
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser && storedUser !== "undefined") {
        try {
          const user = JSON.parse(storedUser);
          if (user?.userId) setUserId(user.userId);
          else navigate("/login");
        } catch {
          localStorage.removeItem("user");
          navigate("/login");
        }
      } else navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    axios
      .get("http://localhost:5297/api/Events")
      .then((res) => setEvents(res.data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (!userId) return;
    axios
      .get(`http://localhost:5297/api/EventBookings/user/${userId}`)
      .then((res) => setBookings(res.data))
      .catch((err) => console.error(err));
  }, [userId]);

  const handleDelete = async (id: number) => {
    if (!userId) return;
    try {
      await axios.delete(
        `http://localhost:5297/api/EventBookings/${id}/user/${userId}`
      );
      setBookings((prev) => prev.filter((b) => b.id !== id));
      toast.success("Booking deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete booking");
    }
  };

  const handleBooking = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedEvent || !userId) return;
    const booking = { eventId: selectedEvent.id, userId };
    try {
      const res = await axios.post(
        "http://localhost:5297/api/EventBookings",
        booking
      );
      toast.success(`Successfully booked ${selectedEvent.name}!`);
      setBookings([...bookings, res.data]);
      setSelectedEvent(null);
    } catch (err: any) {
      toast.error(err.response?.data || "Failed to book event");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold mb-6 text-center text-[#1976d2]">
        Available Events
      </h1>

      {/* Responsive Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-xl">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="bg-gradient-to-r from-gray-400 to-gray-500 text-stone-100">
            <tr>
              <th className="p-4">Event Name</th>
              <th className="p-4">Description</th>
              <th className="p-4 text-center">Start Date</th>
              <th className="p-4 text-center">End Date</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event, index) => (
              <tr
                key={event.id}
                className={`transition hover:bg-blue-50 ${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                }`}
              >
                <td className="p-4 font-medium text-gray-800">{event.name}</td>
                <td className="p-4 truncate max-w-xs">{event.description}</td>
                <td className="p-4 text-center">
                  {new Date(event.startDate).toLocaleDateString()}
                </td>
                <td className="p-4 text-center">
                  {new Date(event.endDate).toLocaleDateString()}
                </td>
                <td className="p-4 text-center">
                  <button
                    onClick={() => setSelectedEvent(event)}
                    className="relative group px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
                  >
                    <TbBrandBooking size={25} />
                    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      Book Now
                    </span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Booking Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 bg-opacity-50 z-50 transition">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-11/12 sm:w-96 animate-fade-in">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Book Event:{" "}
              <span className="text-blue-600">{selectedEvent.name}</span>
            </h2>
            <form onSubmit={handleBooking}>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setSelectedEvent(null)}
                  className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                >
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* My Bookings Section */}
      {bookings.length > 0 && (
        <div className="mt-12">
          <h2 className="text-3xl font-semibold text-[#1976d2] mb-4 text-center">
            My Bookings
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="p-5 bg-white shadow-md shadow-blue-200 rounded-xl flex flex-col justify-between hover:shadow-lg transition-all delay-300 "
              >
                <div className="flex flex-col justify-center">
                  <h3 className="text-lg font-semibold text-center text-blue-700">
                    {b.eventName}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1 text-center">
                    Booked by: <span className="font-medium">{b.userName}</span>
                  </p>
                  <p className="text-sm text-gray-500 mt-2 text-center">
                    Date: {new Date(b.bookingDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex justify-center">
                  <button
                    onClick={() => handleDelete(b.id)}
                    className="w-[90px] mt-4 px-2 py-2 bg-red-900 text-white rounded-md hover:bg-red-600 transition to-black-100 text-m font-semibold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
