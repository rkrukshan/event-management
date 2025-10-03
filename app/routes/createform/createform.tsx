import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router";
import { FaArrowLeft } from "react-icons/fa";
import Manageevent from "../Manageevent/manageevent";
import toast, { Toaster } from "react-hot-toast";

// Validation schema
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
    <div className="container w-xl flex mx-auto">
      <Toaster position="top-right"  reverseOrder={false}/>
      <div className="max-w-xl mx-auto mt-10 bg-white p-6 shadow rounded-lg">
      {/* Main Heading */}
      <div className="flex items-center justify-between mx-11 mb-2">  
        <div>
          <button
            onClick={() => navigate("/manage")} // Go back to previous page
            className="bg-gray-300 text-gray-700 px-4 py-1 rounded hover:bg-gray-400 transition ml-3 flex items-center "
          >
            <FaArrowLeft size={20} className="text-gray-700  " />
          </button>
        </div>

        <div className="ml-5 p-8 mx-10">
          <h1 className="text-2xl font-bold">Create New Event</h1>
        </div>
      </div>
      <p className="text-gray-600 mb-6">
        Fill in the details below to create a new event for the company.
      </p>

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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.eventName,   // map correctly to backend DTO
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
    } catch (err) {
      console.error("Error creating event:", err);
      toast.error("Error connecting to server");
    }
  }}
>

        {({ resetForm }) => (
          <Form className="space-y-9">
            {/* Event Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Event Name
              </label>
              <Field
                name="eventName"
                type="text"
                className="input"
                placeholder="e.g., Annual Tech Summit 2024"
              />
              <ErrorMessage
                name="eventName"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <Field
                as="textarea"
                name="description"
                rows={4}
                className="input"
                placeholder="A brief summary of the event's purpose and highlights."
              />
              <ErrorMessage
                name="description"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <Field
                name="startDate"
                type="date"
                className="input"
                min={new Date().toISOString().split("T")[0]}
              />
              <ErrorMessage
                name="startDate"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <Field name="endDate" type="date" className="input" />
              <ErrorMessage
                name="endDate"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => resetForm()}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition duration-150"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={() => navigate("/manage")}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-150"
              >
                Create Event
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
    </div>
  );
}
