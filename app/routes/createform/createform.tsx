import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Tooltip,
} from "@mui/material";

const EventSchema = Yup.object().shape({
  eventName: Yup.string()
    .min(3, "Event name must be at least 3 characters")
    .required("Event name is required"),
  description: Yup.string()
    .min(10, "Description must be at least 10 characters")
    .required("Description is required"),
  startDate: Yup.date().required("Start date is required"),
  endDate: Yup.date()
    .min(Yup.ref("startDate"), "End date cannot be before start date")
    .required("End date is required"),
});

export default function EventForm() {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 10, px: 2 }}>
      <Toaster position="top-right" reverseOrder={false} />
      <Paper
        elevation={8}
        sx={{
          width: "100%",
          maxWidth: 600,
          p: 5,
          borderRadius: 4,
          backgroundColor: "#fefefe",
          transition: "0.3s",
          "&:hover": { boxShadow: "0 8px 20px rgba(0,0,0,0.15)" },
        }}
      >
        {/* Header */}
        <Box display="flex" alignItems="center" mb={4}>
          <Tooltip title="Back to Manage Events">
            <Button
              onClick={() => navigate("/manage")}
              variant="outlined"
              startIcon={<FaArrowLeft />}
              sx={{
                textTransform: "none",
                borderColor: "#757575",
                color: "#424242",
                fontWeight: 500,
                "&:hover": { backgroundColor: "#f5f5f5" },
              }}
            >
              Back
            </Button>
          </Tooltip>

          <Typography variant="h4" fontWeight="bold" ml={3} color="#1976d2">
            Create New Event
          </Typography>
        </Box>

        <Typography variant="body1" color="text.secondary" mb={4}>
          Fill in the details below to create a new event for the company.
        </Typography>

        {/* Formik Form */}
        <Formik
          initialValues={{
            eventName: "",
            description: "",
            startDate: "",
            endDate: "",
          }}
          validationSchema={EventSchema}
          onSubmit={async (values, { resetForm }) => {
            try {
              const response = await fetch("http://localhost:5297/api/events", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  name: values.eventName,
                  description: values.description,
                  startDate: values.startDate,
                  endDate: values.endDate,
                }),
              });

              if (!response.ok) {
                const errorText = await response.text();
                toast.error("Failed to create event: " + errorText);
                return;
              }

              const data = await response.json();
              toast.success(`Event "${data.name}" created successfully!`);
              resetForm();
              setTimeout(() => navigate("/manage"), 1200);
            } catch (err) {
              console.error("Error creating event:", err);
              toast.error("Error connecting to server");
            }
          }}
        >
          {({
            values,
            handleChange,
            handleBlur,
            errors,
            touched,
            resetForm,
          }) => (
            <Form>
              <Box display="flex" flexDirection="column" gap={3}>
                {/* Event Name */}
                <TextField
                  fullWidth
                  id="eventName"
                  name="eventName"
                  label="Event Name"
                  placeholder="Annual Tech Summit 2024"
                  value={values.eventName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.eventName && Boolean(errors.eventName)}
                  helperText={touched.eventName && errors.eventName}
                  variant="outlined"
                  sx={{ borderRadius: 2 }}
                />

                {/* Description */}
                <TextField
                  fullWidth
                  id="description"
                  name="description"
                  label="Description"
                  placeholder="Brief summary of the event's purpose."
                  multiline
                  rows={5}
                  value={values.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.description && Boolean(errors.description)}
                  helperText={touched.description && errors.description}
                  variant="outlined"
                  sx={{ borderRadius: 2 }}
                />

                {/* Dates */}
                <Box
                  display="flex"
                  flexDirection={{ xs: "column", sm: "row" }}
                  gap={2}
                >
                  <TextField
                    fullWidth
                    id="startDate"
                    name="startDate"
                    label="Start Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={values.startDate}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.startDate && Boolean(errors.startDate)}
                    helperText={touched.startDate && errors.startDate}
                    variant="outlined"
                    sx={{ borderRadius: 2 }}
                  />

                  <TextField
                    fullWidth
                    id="endDate"
                    name="endDate"
                    label="End Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={values.endDate}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.endDate && Boolean(errors.endDate)}
                    helperText={touched.endDate && errors.endDate}
                    variant="outlined"
                    sx={{ borderRadius: 2 }}
                  />
                </Box>

                {/* Buttons */}
                <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
                  <Button
                    type="button"
                    variant="outlined"
                    color="secondary"
                    onClick={() => resetForm()}
                    sx={{ borderRadius: 2, px: 3 }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{
                      borderRadius: 2,
                      px: 4,
                      background:
                        "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
                    }}
                  >
                    <div className="font-semibold">Create Event</div>
                  </Button>
                </Box>
              </Box>
            </Form>
          )}
        </Formik>
      </Paper>
    </Box>
  );
}
