import { useDispatch, useSelector } from "react-redux"
import {
	RiCheckboxBlankCircleLine,
	RiCheckboxCircleFill,
	RiStarFill,
	RiStarLine,
} from "react-icons/ri"
import TaskBodyHeading from "../../shared/TaskBodyHeading"
import { changeComponent, editTask } from "../../redux/BodyComponentSlice/componentSlice"
import { FaEdit } from "react-icons/fa"
import { MdDelete } from "react-icons/md"
import { useEffect, useState } from "react"
import axios from "axios"
import StatusColored from "../../shared/StatusColored"
import InfoModal from "../../shared/InfoModal"

const WeekTask = () => {
	const dispatch = useDispatch()
	const { enabled } = useSelector((state) => state.theme.themeList)

	const [tasks, setTasks] = useState([])
	const [loading, setLoading] = useState(true)
	const [err, setErr] = useState("")

	const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
	const [taskToView, setTaskToView] = useState(null);

		const userRole = useSelector((state) => state.auth.user.role);

	//  Edit
	const handleEdit = (task) => {
		dispatch(changeComponent("editTask"))
		dispatch(editTask(task))
	}

	//  Delete
	const handleDelete = async (taskId) => {
		if (!window.confirm("Are you sure you want to delete this task?")) return

		try {
			await axios.delete(`http://localhost:8000/api/deletetask/${taskId}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			})

			// remove deleted task from state
			setTasks((prev) => prev.filter((t) => t.id !== taskId))
			console.log("Task deleted successfully")
		} catch (err) {
			console.error("Error deleting task:", err.response?.data || err.message)
			alert("Failed to delete task")
		}
	}


	useEffect(() => {
		const fetchThisWeekTasks = async () => {
			setLoading(true)
			setErr("")
			try {
				const res = await axios.get("http://localhost:8000/api/tasks/due-this-week", {
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
				})
				setTasks(res.data || [])
			} catch (e) {
				setErr(e.response?.data?.message || "Failed to load this week's tasks")
				console.error("Error fetching this week's tasks:", e.response?.data || e.message)
			} finally {
				setLoading(false)
			}
		}
		fetchThisWeekTasks()
	}, [])

	const handleToggleStar = async (taskId) => {
		try {
			const res = await axios.patch(
				`http://localhost:8000/api/tasks/${taskId}/star`,
				{},
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
				}
			);

			// update local state
			setTasks(prev =>
				prev.map(t =>
					t.id === taskId ? { ...t, starred: res.data.starred } : t
				)
			);
		} catch (err) {
			console.error("Error toggling star:", err.response?.data || err.message);
			alert("Failed to toggle star");
		}
	};

	return (
		<div className="flex flex-col p-4">
			<TaskBodyHeading todoHeading="This Week's tasks" />

			{loading && <p className={`${enabled ? "text-white/60" : "text-black/60"} mt-2`}>Loading…</p>}
			{err && <p className="text-red-500 mt-2">{err}</p>}

			{!loading &&
				!err &&
				tasks.map((item) => {
					const { id, title, description, status, starred, due_date } = item
					const isCompleted = status === "done"
					const isStarred = !!starred

					return (
						<div
							key={id}
							onClick={() => {
								setTaskToView(item);
								setIsInfoModalOpen(true);
							}}
							className={`${enabled
								? "bg-[#2f2d36] hover:bg-black/10"
								: "bg-[#d3dee3] hover:bg-[#c4cdd1]"
								} flex justify-between items-center my-4 p-2 rounded-lg cursor-pointer transition-all duration-200 shadow-one hover:shadow-two group`}
						>

							<div className="flex items-center gap-4">
								{isCompleted ? (
									<RiCheckboxCircleFill color="#7a8db0" />
								) : (
									<RiCheckboxBlankCircleLine color="#7a8db0" />
								)}

								<div>
									<p
										className={`${enabled ? "text-white/60" : "text-black/60"} ${isCompleted ? "line-through" : ""
											} font-Lexend text-[17px] font-medium`}
									>
										{title}
									</p>
									<StatusColored status={status} />

									<p className={`${enabled ? "text-white/30" : "text-black/40"} text-sm`}>
										{description}
									</p>

									<div className="flex flex-wrap gap-2 mt-1">
										{userRole === "admin" && item.created_by && (
											<span className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 px-2 py-0.5 rounded-full text-xs">
												Created by {item.created_by}
											</span>
										)}
										{item.due_date && (
											<span className="bg-indigo-100 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-100 px-2 py-0.5 rounded-full text-xs">
												Due {item.due_date}
											</span>
										)}
									</div>
								</div>
							</div>

							<div className="flex justify-between items-center gap-4">
								<div className="flex gap-4">
									<FaEdit
										onClick={() => handleEdit(item)}
										className="group-hover:block hidden"
										color={enabled ? "#7f5bf7" : "#f8917e"}
									/>
									<MdDelete
										onClick={() => handleDelete(item.id)}
										className="group-hover:block hidden"
										color={enabled ? "#7f5bf7" : "#f8917e"}
									/>
								</div>

								<div>
									{isStarred ? (
										<RiStarFill
											onClick={(e) => {
												e.stopPropagation();
												handleToggleStar(id);
											}}
											color="gray" // starred = gray
											size={20}
										/>
									) : (
										<RiStarLine
											onClick={(e) => {
												e.stopPropagation();
												handleToggleStar(id);
											}}
											color="#7a8db0" // not starred
											size={20}
										/>
									)}
								</div>
							</div>
						</div>
					)
				})}
			<InfoModal
				isOpen={isInfoModalOpen}
				onClose={() => setIsInfoModalOpen(false)}
				task={taskToView}
			/>
		</div>
	)
}

export default WeekTask
