import { useDispatch, useSelector } from "react-redux";
import {
	RiCheckboxBlankCircleLine,
	RiCheckboxCircleFill,
	RiStarFill,
	RiStarLine,
} from "react-icons/ri";
import Button from "../../shared/Button";
import TaskBodyHeading from "../../shared/TaskBodyHeading";
import { changeComponent, editTask } from "../../redux/BodyComponentSlice/componentSlice";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useEffect, useState } from "react";
import axios from "axios";
import StatusColored from "../../shared/StatusColored";
import InfoModal from "../../shared/InfoModal";

const MyTasksAdmin = () => {
	const dispatch = useDispatch();
	const { enabled } = useSelector((state) => state.theme.themeList);
	const userRole = useSelector((state) => state.auth.user.role);

	const [tasks, setTasks] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [taskToDelete, setTaskToDelete] = useState(null);
	const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
	const [taskToView, setTaskToView] = useState(null);

	// Fetch admin’s own tasks only
	useEffect(() => {
		const fetchMyTasks = async () => {
			try {
				const res = await axios.get("http://localhost:8000/api/my-tasks", {
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
				});
				setTasks(res.data);
			} catch (err) {
				setError(err.response?.data?.message || "Failed to load tasks");
			} finally {
				setLoading(false);
			}
		};
		fetchMyTasks();
	}, []);

	const handleEdit = (task) => {
		dispatch(changeComponent("editTask"));
		dispatch(editTask(task));
	};

	const handleDelete = async (taskId) => {
		if (!window.confirm("Are you sure you want to delete this task?")) return;
		try {
			await axios.delete(`http://localhost:8000/api/deletetask/${taskId}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			});
			setTasks((prev) => prev.filter((t) => t.id !== taskId));
		} catch (err) {
			alert("Failed to delete task");
		}
	};

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
			setTasks((prev) =>
				prev.map((task) =>
					task.id === taskId ? { ...task, starred: res.data.starred } : task
				)
			);
		} catch {
			alert("Failed to toggle star");
		}
	};

	return (
		<div className="flex flex-col p-4 h-full">
			<TaskBodyHeading todoHeading="My Tasks" />

			<div className="flex-1 max-h-[400px] overflow-y-auto pr-2">
				{loading && (
					<p className={`${enabled ? "text-white/60" : "text-black/60"} mt-2`}>
						Loading…
					</p>
				)}
				{error && <p className="text-red-500 mt-2">{error}</p>}

				{!loading &&
					!error &&
					tasks.map((item) => {
						const { id, title, status, starred } = item;
						const isCompleted = status === "done";
						const isStarred = !!starred;

						return (
							<div
								key={id}
								onClick={() => {
									setTaskToView(item);
									setIsInfoModalOpen(true);
								}}
								className={`${
									enabled
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
											className={`${
												enabled ? "text-white/60" : "text-black/60"
											} ${isCompleted ? "line-through" : ""} font-Lexend text-[17px] font-medium`}
										>
											{title}
										</p>
										<p
											className={`${
												enabled ? "text-white/30" : "text-black/40"
											} text-sm`}
										>
											<StatusColored status={status} />
											{item.due_date && (
												<span className="bg-indigo-100 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-100 px-2 py-0.5 rounded-full text-xs ml-2">
													Due {item.due_date}
												</span>
											)}
										</p>
									</div>
								</div>

								<div className="flex justify-between items-center gap-4">
									<div className="flex gap-4">
										<FaEdit
											onClick={(e) => {
												e.stopPropagation();
												handleEdit(item);
											}}
											className="group-hover:block hidden"
											color={enabled ? "#7f5bf7" : "#f8917e"}
										/>
										<MdDelete
											onClick={(e) => {
												e.stopPropagation();
												handleDelete(item.id);
											}}
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
												color="gray"
												size={20}
											/>
										) : (
											<RiStarLine
												onClick={(e) => {
													e.stopPropagation();
													handleToggleStar(id);
												}}
												color="#7a8db0"
												size={20}
											/>
										)}
									</div>
								</div>
							</div>
						);
					})}
			</div>

			<div className="sticky bottom-0 dark:bg-[#1c1c1c] py-2 mt-2 flex justify-end shadow-md">
				<Button to="addTask" btnText="Add Task" />
			</div>

			<InfoModal
				isOpen={isInfoModalOpen}
				onClose={() => setIsInfoModalOpen(false)}
				task={taskToView}
			/>
		</div>
	);
};

export default MyTasksAdmin;
