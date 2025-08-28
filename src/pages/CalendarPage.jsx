import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import axios from "axios";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CustomEvent from "../components/Tasks/CustomEvent";
import InfoModal from "../shared/InfoModal";
import { useSelector } from "react-redux";

const localizer = momentLocalizer(moment);

const CalendarPage = () => {
  const { enabled } = useSelector((state) => state.theme.themeList);

  const [tasks, setTasks] = useState([]);  // Raw tasks from API
  const [events, setEvents] = useState([]); // Transformed tasks for calendar
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");


  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [taskToView, setTaskToView] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      setErr("");
      try {
        const res = await axios.get("http://localhost:8000/api/tasks", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const tasksData = res.data || [];

        // Convert tasks to calendar events
        const formattedEvents = tasksData
          .filter(task => task.due_date) // Only tasks with a date
          .map(task => ({
            id: task._id,
            title: task.title,
            start: new Date(task.due_date), // Ensure this is a valid Date
            end: new Date(new Date(task.due_date).getTime() + 60 * 60 * 1000), // Add 1 hour duration
            allDay: false,
            status: task.status,
            originalTask: task
          }));

        setTasks(tasksData);
        setEvents(formattedEvents);
      } catch (e) {
        setErr(e.response?.data?.message || "Failed to load tasks");
        console.error("Error fetching tasks:", e.response?.data || e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleEventClick = (event) => {
    setTaskToView(event.originalTask);
    setIsInfoModalOpen(true);
  };

  return (
     
    <div className={`${enabled ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"} p-6 min-h-screen`}>
      {loading && <p className="text-center text-gray-400">{enabled ? "Loading tasks..." : "Loading tasks..."}</p>}
      {err && <p className="text-center text-red-500">{err}</p>}

      <div className={`${enabled ? "bg-gray-800" : "bg-white"} rounded-lg shadow-lg p-4`}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          defaultView="month"
          views={["month", "week", "day"]}
          style={{ height: 600 }}
          components={
            { event: CustomEvent }
          }
          onSelectEvent={handleEventClick}
          eventPropGetter={(event, start, end, isSelected) => {
            return {
              style: {
                backgroundColor: '#8ecae6', // Remove default blue
                border: 'none',
                color: 'inherit',
                padding: '0',
              }
            }
          }}
        />
      </div>
      <InfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        task={taskToView}
      />
    </div>
  );
};

export default CalendarPage;
