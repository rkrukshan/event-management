import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { FaEdit } from "react-icons/fa";
import { AiOutlineDelete } from "react-icons/ai";
import { FaEye } from "react-icons/fa";

export default function ManageEvent() {
  const [showDashboard, setShowDashboard] = useState(true);
  const [events, setEvents] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [selectedEventBookings, setSelectedEventBookings] = useState<any[]>([]);
  const [showBookings, setShowBookings] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);

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
        description: editingEvent.description,
      });
      setEvents(
        events.map((e) => (e.id === editingEvent.id ? editingEvent : e))
      );
      setEditingEvent(null);
    } catch (err) {
      console.error(err);
      alert("Failed to update event");
    }
  };

  return (
    <Box sx={{ p: 10, backgroundColor: "#f9fafb", minHeight: "100vh" }}>
      {/* Dashboard View */}
      {showDashboard && (
        <Paper sx={{ p: 7, borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="h5" gutterBottom fontWeight="bold">
            <div className="text-center font-semibold text-3xl mb-8 text-[#1976d2] ">
              Manage Events
            </div>
          </Typography>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#454849", color: "#2596be"  }}>
                  <TableCell sx={{ color: "#fff" }}>Event Name</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Description</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Start Date</TableCell>
                  <TableCell sx={{ color: "#fff" }}>End Date</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Actions</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Bookings</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id} hover>
                    <TableCell>{event.name}</TableCell>
                    <TableCell>{event.description}</TableCell>
                    <TableCell>
                      {new Date(event.startDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(event.endDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Edit" arrow>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          sx={{ mr: 1 }}
                          onClick={() => handleEdit(event)}
                        >
                          <FaEdit size={20} />
                          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            Edit
                          </span>
                        </Button>
                      </Tooltip>
                      <Tooltip title="Delete" arrow>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => handleDelete(event.id)}
                        >
                          <AiOutlineDelete size={20} />
                        </Button>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Tooltip title="View" arrow >
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          onClick={() => handleViewBookings(event.id)}
                        >
                          <FaEye size={20} />
                        </Button>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingEvent} onClose={() => setEditingEvent(null)}>
        <DialogTitle>Edit Event</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            fullWidth
            value={editingEvent?.name || ""}
            onChange={(e) =>
              setEditingEvent({ ...editingEvent, name: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            value={editingEvent?.description || ""}
            onChange={(e) =>
              setEditingEvent({ ...editingEvent, description: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Start Date"
            type="date"
            fullWidth
            value={editingEvent?.startDate?.split("T")[0] || ""}
            onChange={(e) =>
              setEditingEvent({ ...editingEvent, startDate: e.target.value })
            }
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="dense"
            label="End Date"
            type="date"
            fullWidth
            value={editingEvent?.endDate?.split("T")[0] || ""}
            onChange={(e) =>
              setEditingEvent({ ...editingEvent, endDate: e.target.value })
            }
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingEvent(null)}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained" color="success">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bookings View */}
      {showBookings && (
        <Paper sx={{ p: 3, mt: 4, borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="h5" gutterBottom fontWeight="bold">
            User's Event Bookings
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mb: 2 }}
            onClick={() => {
              setShowDashboard(true);
              setShowBookings(false);
            }}
          >
            Back to Events
          </Button>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#e0e0e0" }}>
                  <TableCell>User Name</TableCell>
                  <TableCell>Booking Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedEventBookings.length > 0 ? (
                  selectedEventBookings.map((b) => (
                    <TableRow key={b.id} hover>
                      <TableCell>{b.userName}</TableCell>
                      <TableCell>
                        {new Date(b.bookingDate).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={2}
                      align="center"
                      sx={{ color: "gray" }}
                    >
                      No bookings yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Box>
  );
}
