// package
import { useDispatch, useSelector } from "react-redux"
import {
	RiCheckboxBlankCircleLine,
	RiCheckboxCircleFill,
	RiStarFill,
	RiStarLine,
} from "react-icons/ri"

import Button from "../../shared/Button"
import TaskBodyHeading from "../../shared/TaskBodyHeading"
import { changeComponent, editTask } from "../../redux/BodyComponentSlice/componentSlice"

import { FaEdit } from "react-icons/fa"
import { MdDelete } from "react-icons/md"
import { useEffect, useState } from "react"
import axios from "axios"
import StatusColored from "../../shared/StatusColored"
import InfoModal from "../../shared/InfoModal"
import { deleteTask, fetchTasks, toggleStar } from "../../redux/TaskSlice"

const AllTask = () => {

	const [users, setUsers] = useState([]);
	const [selectedUser, setSelectedUser] = useState("");

	const dispatch = useDispatch();
	const { enabled } = useSelector((state) => state.theme.themeList);

	const tasks = useSelector((state) => state.tasks.tasks);
	const loading = useSelector((state) => state.tasks.status === "loading");
	const err = useSelector((state) => state.tasks.error);


	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [taskToDelete, setTaskToDelete] = useState(null);

	const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
	const [taskToView, setTaskToView] = useState(null);

	const userRole = useSelector((state) => state.auth.user.role);



	const handleEdit = (task) => {
		dispatch(changeComponent("editTask"))
		dispatch(editTask(task))
	}

	const handleDelete = async (taskId) => {
		if (!window.confirm("Are you sure you want to delete this task?")) return;

		try {
			await axios.delete(`http://localhost:8000/api/deletetask/${taskId}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			});

			dispatch(deleteTask(taskToDelete)); // update Redux
			setIsDeleteModalOpen(false);
			setTaskToDelete(null);
		} catch (err) {
			console.error("Error deleting task:", err.response?.data || err.message);
			alert("Failed to delete task");
		}
	};

	const handleConfirmDelete = async () => {
		try {
			await axios.delete(`http://localhost:8000/api/deletetask/${taskToDelete}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			});

			dispatch(deleteTask(taskToDelete));
			setIsDeleteModalOpen(false);
			setTaskToDelete(null);
		} catch (err) {
			console.error("Error deleting task:", err.response?.data || err.message);
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

			// Update Redux state immediately
			dispatch(toggleStar({ id: taskId, starred: res.data.starred }));

		} catch (err) {
			console.error("Error toggling star:", err.response?.data || err.message);
			alert("Failed to toggle star");
		}
	};

	const handleUserChange = async (e) => {
		const userId = e.target.value;
		setSelectedUser(userId);

		if (userId === "") {
			dispatch(fetchTasks());
			return;
		}

		try {
			const res = await axios.get(`http://localhost:8000/api/tasks/user/${userId}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			});
			dispatch({ type: "tasks/setTasks", payload: res.data });
		} catch (err) {
			console.error("Error fetching user tasks:", err.response?.data || err.message);
		}
	};



	useEffect(() => {
		// Always fetch tasks
		dispatch(fetchTasks());

		// If admin, also fetch users
		if (userRole === "admin") {
			axios
				.get("http://localhost:8000/api/users", {
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
				})
				.then((res) => setUsers(res.data))
				.catch((err) => console.error("Error fetching users:", err));
		}
	}, [dispatch, userRole]);





	return (
		<div className="flex flex-col p-4 h-full">
			<TaskBodyHeading todoHeading="All Tasks" />

			{userRole === "admin" && (
				<div className="flex justify-end mb-4">
					<select
						value={selectedUser}
						onChange={handleUserChange}
						className={`border border-gray-300 dark:border-gray-600 
        bg-transparent text-gray-700 dark:text-gray-100 
        font-medium px-4 py-2 rounded-lg 
        focus:outline-none focus:ring-2 focus:ring-indigo-500 
        cursor-pointer transition-all`}
					>
						<option value="" className="dark:bg-[#1c1c1c] bg-white text-gray-700">
							All Users
						</option>
						{users.map((user) => (
							<option
								key={user.id}
								value={user.id}
								className="dark:bg-[#1c1c1c] bg-white text-gray-700"
							>
								{user.name} ({user.role})
							</option>
						))}
					</select>
				</div>
			)}


			


			<div className="flex-1 max-h-[400px] overflow-y-auto pr-2">

				{loading && <p className={`${enabled ? "text-white/60" : "text-black/60"} mt-2`}>Loading…</p>}
				{err && <p className="text-red-500 mt-2">{err}</p>}

				{!loading &&
					!err &&
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
								className={`${enabled ? "bg-[#2f2d36] hover:bg-black/10" : "bg-[#d3dee3] hover:bg-[#c4cdd1]"
									} flex justify-between items-center my-4 b p-2 rounded-lg cursor-pointer transition-all duration-200 shadow-one hover:shadow-two group`}
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
										<p className={`${enabled ? "text-white/30" : "text-black/40"} text-sm`}>
											<StatusColored status={status} />

											{item.due_date && (
												<span className="bg-indigo-100 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-100 px-2 py-0.5 rounded-full text-xs ">
													Due {item.due_date}
												</span>
											)}
											{userRole === "admin" && item.created_by && (
												<span className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 px-2 py-0.5 rounded-full text-xs ml-2">
													Assigned by {item.created_by}
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
												setTaskToDelete(item.id);
												setIsDeleteModalOpen(true);
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
			</div>


			{/* Add task button */}
			<div className="sticky bottom-0  dark:bg-[#1c1c1c] py-2 mt-2 flex justify-end shadow-md">
				<Button to="addTask" btnText="Add Task" />
			</div>

			{isDeleteModalOpen && (
				<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
					<div className="bg-white rounded-lg shadow-lg p-6 w-96">
						<h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
						<p className="mb-6">Are you sure you want to delete this task?</p>
						<div className="flex justify-end gap-3">
							<button
								onClick={() => setIsDeleteModalOpen(false)}
								className="px-4 py-2 rounded bg-gray-300"
							>
								Cancel
							</button>
							<button
								onClick={handleConfirmDelete}
								className="px-4 py-2 rounded bg-red-500 text-white"
							>
								Delete
							</button>
						</div>
					</div>
				</div>
			)}

			<InfoModal
				isOpen={isInfoModalOpen}
				onClose={() => setIsInfoModalOpen(false)}
				task={taskToView}
			/>


		</div>


	)
}

export default AllTask