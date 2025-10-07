  import React, { useState, useEffect } from "react";
  import axios from "axios";
  import toast, { Toaster } from "react-hot-toast";
  import { useNavigate } from "react-router-dom";

  interface Event {
    id: number;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
  }

  interface Booking {
    id: number;
    eventId: number;
    userId: number;
    eventName: string;
    userName: string;
    bookingDate: string;
  }

  export default function UserEventBooking() {
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [userId, setUserId] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const navigate = useNavigate();

    // Load user only on client
    useEffect(() => {
      if (typeof window !== "undefined") {
        const storedUser = localStorage.getItem("user");

        if (storedUser && storedUser !== "undefined") {
          try {
            const user = JSON.parse(storedUser);
            if (user?.userId) {
              setUserId(user.userId);
            } else {
              toast.error("Invalid user data");
              navigate("/login");
            }
          } catch (err) {
            console.error("Invalid JSON in localStorage:", err);
            localStorage.removeItem("user");
            navigate("/login");
          }
        } else {
          navigate("/login");
        }
      }
    }, [navigate]);

    // Fetch events
    useEffect(() => {
      const fetchEvents = async () => {
        try {
          const response = await axios.get("http://localhost:5297/api/Events");
          setEvents(response.data);
        } catch (error) {
          console.error("Error fetching events:", error);
          toast.error("Failed to load events");
        }
      };
      fetchEvents();
    }, []);

    // Fetch bookings only when we know userId
    useEffect(() => {
      if (!userId) return;

      const fetchBookings = async () => { 
        try {
          const response = await axios.get(
            `http://localhost:5297/api/EventBookings/user/${userId}`
          );
          setBookings(response.data);
        } catch (error) {
          console.error("Error fetching bookings:", error);
          toast.error("Failed to load your bookings");
        }
      };
      fetchBookings();
    }, [userId]);

    const handleDelete = async (id: number) => {
      if (!userId) {
        toast.error("User not found");
        return;
      }

      setLoading(true);
      try {
        console.log(`Attempting to delete booking ${id} for user ${userId}`);
        
        // Try different endpoint patterns - your API might use one of these:
        const endpoints = [
          `http://localhost:5297/api/EventBookings/${id}/user/${userId}`,
          `http://localhost:5297/api/EventBookings/${id}?userId=${userId}`,
          `http://localhost:5297/api/EventBookings/${id}`,
        ];

        let success = false;
        let lastError = null;

        // Try each endpoint pattern
        for (const endpoint of endpoints) {
          try {
            console.log(`Trying endpoint: ${endpoint}`);
            await axios.delete(endpoint);
            success = true;
            break;
          } catch (err: any) {
            lastError = err;
            console.log(`Endpoint ${endpoint} failed:`, err.response?.data);
            continue;
          }
        }

        if (success) {
          setBookings((prev) => prev.filter((b) => b.id !== id));
          toast.success("Booking deleted successfully!");
        } else {
          console.error("All delete attempts failed:", lastError);
          throw lastError;
        }
      } catch (error: any) {
        console.error("Error deleting booking:", error);
        
        // Provide specific error messages based on the response
        if (error.response) {
          const status = error.response.status;
          const message = error.response.data?.message || error.response.data;
          
          switch (status) {
            case 404:
              toast.error("Booking not found or already deleted");
              // Refresh bookings to sync with server
              const response = await axios.get(
                `http://localhost:5297/api/EventBookings/user/${userId}`
              );
              setBookings(response.data);
              break;
            case 403:
              toast.error("You don't have permission to delete this booking");
              break;
            case 401:
              toast.error("Please login again");
              navigate("/login");
              break;
            default:
              toast.error(message || "Failed to delete booking");
          }
        } else if (error.request) {
          toast.error("Network error - please check if server is running");
        } else {
          toast.error("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    const handleBooking = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!selectedEvent || !userId) return;

      setLoading(true);
      try {
        const booking = { 
          eventId: selectedEvent.id, 
          userId: userId 
        };

        console.log("Creating booking:", booking);

        const response = await axios.post(
          "http://localhost:5297/api/EventBookings",
          booking
        );
        
        toast.success(`Successfully booked ${selectedEvent.name}!`);
        setBookings([...bookings, response.data]);
        setSelectedEvent(null);
      } catch (err: any) {
        console.error("Booking error:", err);
        
        if (err.response?.status === 409) {
          toast.error("You have already booked this event");
        } else {
          toast.error(err.response?.data?.message || err.response?.data || "Failed to book event");
        }
      } finally {
        setLoading(false);
      }
    };

    // Check if user has already booked an event
    const isEventBooked = (eventId: number) => {
      return bookings.some(booking => booking.eventId === eventId);
    };

    return (
      <div className="container mx-auto p-6">
        <Toaster position="top-right" />

        <h1 className="text-2xl font-bold mb-6">Available Events</h1>

        {events.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No events available at the moment.</p>
          </div>
        ) : (
          <table className="w-full border border-gray-200 shadow-sm rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Event Name</th>
                <th className="p-3 text-left">Description</th>
                <th className="p-3">Start Date</th>
                <th className="p-3">End Date</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => {
                const isBooked = isEventBooked(event.id);
                return (
                  <tr key={event.id} className="border-t hover:bg-gray-50">
                    <td className="p-3 font-medium">{event.name}</td>
                    <td className="p-3">{event.description}</td>
                    <td className="p-3 text-center">
                      {new Date(event.startDate).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-center">
                      {new Date(event.endDate).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-center">
                      {isBooked ? (
                        <span className="text-green-600 font-medium">Booked</span>
                      ) : (
                        <span className="text-gray-500">Available</span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => setSelectedEvent(event)}
                        disabled={isBooked || loading}
                        className={`px-4 py-1 rounded ${
                          isBooked
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                        }`}
                      >
                        {isBooked ? "Already Booked" : "Book Now"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {selectedEvent && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
              <h2 className="text-xl font-bold mb-4">
                Book Event: {selectedEvent.name}
              </h2>
              <p className="text-gray-600 mb-4">
                {selectedEvent.description}
              </p>
              <div className="mb-4">
                <p><strong>Start:</strong> {new Date(selectedEvent.startDate).toLocaleDateString()}</p>
                <p><strong>End:</strong> {new Date(selectedEvent.endDate).toLocaleDateString()}</p>
              </div>
              <form onSubmit={handleBooking} className="space-y-4">
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setSelectedEvent(null)}
                    className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
                    disabled={!userId || loading}
                  >
                    {loading ? "Booking..." : "Confirm Booking"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {bookings.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-bold mb-4">My Bookings</h2>
            <div className="space-y-3">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="p-4 border rounded-lg bg-white shadow-sm flex justify-between items-center"
                >
                  <div>
                    <span className="font-medium">{booking.eventName}</span>
                    <span className="text-sm text-gray-600 ml-4">
                      Booked on: {new Date(booking.bookingDate).toLocaleDateString()}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDelete(booking.id)}
                    disabled={loading}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-400"
                  >
                    {loading ? "Deleting..." : "Delete"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }