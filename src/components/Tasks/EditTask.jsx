import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { RiArrowLeftSLine, RiStarFill, RiStarLine } from "react-icons/ri"
import axios from "axios"

import TaskBodyHeading from "../../shared/TaskBodyHeading"
import { changeComponent } from "../../redux/BodyComponentSlice/componentSlice"
import { fetchTasks } from "../../redux/TaskSlice"

const EditTask = ({ task }) => {
  const dispatch = useDispatch()
  const { enabled } = useSelector((state) => state.theme.themeList)
  const { selectedTask } = useSelector((state) => state.component) // adjust slice name

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState("new")
  const [dueDate, setDueDate] = useState("")
  const [starred, setStarred] = useState(false)

  // Prefill states directly from task prop
  useEffect(() => {
    if (selectedTask) {
      setTitle(selectedTask.title || "")
      setDescription(selectedTask.description || "")
      setStatus(selectedTask.status || "new")
      if (selectedTask.due_date) {
        // Convert "2025-08-26 14:30:00" -> "2025-08-26T14:30"
        const dateObj = new Date(selectedTask.due_date)
        const tzOffset = dateObj.getTimezoneOffset() * 60000
        const localISOTime = new Date(dateObj - tzOffset).toISOString().slice(0, 16)
        setDueDate(localISOTime)
      } else {
        setDueDate("")
      }

      setStarred(selectedTask.starred || false)
    }
  }, [selectedTask])

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedDueDate = dueDate ? dueDate.replace("T", " ") : null

    const taskObj = {
      title,
      description,
      status,
      due_date: formattedDueDate,
      starred: starred ? 1 : 0,
    }

    try {
      const response = await axios.put(
        `http://localhost:8000/api/updatetask/${selectedTask.id}`,
        taskObj,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )

      dispatch(fetchTasks());
      dispatch(changeComponent("allTask"))
    } catch (err) {
      console.error("Error updating task:", err.response?.data || err.message)
    }
  }

  const handleToggleStar = async () => {
    try {
      const res = await axios.patch(
        `http://localhost:8000/api/tasks/${selectedTask.id}/star`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      setStarred(res.data.starred); // update local state
    } catch (err) {
      console.error("Error toggling star:", err.response?.data || err.message);
      alert("Failed to toggle star");
    }
  };



  return (
    <div className="flex flex-col p-4">
      <form onSubmit={handleSubmit}>
        {/* Task Title */}
        <section>
          <TaskBodyHeading todoHeading="Task Title" />
          <div>
            <input
              placeholder="type here"
              type="text"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className={`rounded-lg border-none outline-none w-full p-2 my-2 font-Lexend font-semibold tracking-widest ${enabled
                ? "bg-[#2f2d36] text-white/50"
                : "bg-[#d3dee3] text-black/50"
                }`}
            />
          </div>
        </section>

        {/* Task Description */}
        <section className="mt-4">
          <TaskBodyHeading todoHeading="Description" />
          <div>
            <textarea
              placeholder="Type here"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className={`rounded-lg border-none outline-none font-Lexend font-semibold tracking-widest p-2 w-full h-[150px] my-2 ${enabled
                ? "bg-[#2f2d36] text-white/50"
                : "bg-[#d3dee3] text-black/50"
                }`}
            />
          </div>
        </section>

        {/* Task Status, Date, Star */}
        <main className="flex gap-4">
          <section className="my-4">
            <TaskBodyHeading todoHeading="Status" />
            <select
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
              className={`rounded-lg border-none outline-none font-Lexend font-semibold tracking-widest w-[200px] p-2 my-2 ${enabled
                ? "bg-[#2f2d36] text-white/50"
                : "bg-[#d3dee3] text-black/50"
                }`}
            >
              <option value="new">New</option>
              <option value="to do">To Do</option>
              <option value="in progress">In Progress</option>
              <option value="pending">Pending</option>
              <option value="done">Done</option>
            </select>
          </section>

          <section className="my-4">
            <TaskBodyHeading todoHeading="Due Date" />
            <input
              type="datetime-local"
              name="due_date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
              className={`rounded-lg border-none outline-none font-Lexend font-semibold tracking-widest p-2 my-2 ${enabled
                ? "bg-[#2f2d36] text-white/50"
                : "bg-[#d3dee3] text-black/50"
                }`}
            />
          </section>

          <section className="mt-14">
            {starred ? (
              <RiStarFill
                className="cursor-pointer"
                onClick={handleToggleStar}
                color="#facc15"
                size={30}
              />
            ) : (
              <RiStarLine
                className="cursor-pointer"
                onClick={handleToggleStar}
                color="gray"
                size={30}
              />
            )}
          </section>
        </main>

        <section className="flex justify-between items-center">
          <RiArrowLeftSLine
            onClick={() => dispatch(changeComponent("allTask"))}
            className="cursor-pointer"
            size={40}
            color={`${enabled ? "#d3dee3" : "#2f2d36"}`}
          />
          <button
            type="submit"
            className={`${enabled
              ? "bg-gradient-to-t from-darkTextSecondary/70 to-darkTextSecondary text-darkTextPrimary"
              : "bg-gradient-to-t from-textSecondary/50 to-textSecondary text-textPrimary"
              } px-4 py-2 rounded-2xl font-Lexend font-medium tracking-widest`}
          >
            Update Task
          </button>
        </section>
      </form>
    </div>
  )
}

export default EditTask
