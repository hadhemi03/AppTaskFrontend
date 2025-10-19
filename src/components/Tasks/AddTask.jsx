import { useDispatch, useSelector } from "react-redux";
import { RiArrowLeftSLine } from "react-icons/ri";
import TaskBodyHeading from "../../shared/TaskBodyHeading";
import { changeComponent } from "../../redux/BodyComponentSlice/componentSlice";
import { useEffect, useState } from "react";
import axios from "axios";
import { addTask } from "../../redux/TaskSlice";

const AddTask = () => {
	const { enabled } = useSelector((state) => state.theme.themeList);
	const dispatch = useDispatch();

	// Form state
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [status, setStatus] = useState("new");
	const [dueDate, setDueDate] = useState("");
	const [userId, setUserId] = useState(""); // for admin only

	// Extra state
	const [users, setUsers] = useState([]); // list of users for admin
	const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
	const [alertMessage, setAlertMessage] = useState("");

	// Fetch all users if admin
	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const token = localStorage.getItem("token");
				const response = await axios.get("http://localhost:8000/api/users", {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				setUsers(response.data);
			} catch (error) {
				console.error("Error fetching users:", error);
			}
		};

		fetchUsers();
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();

		const formattedDueDate = dueDate.replace("T", " ");

		const taskObj = {
			title,
			description,
			status,
			due_date: formattedDueDate,
		};

		// Add user_id only if admin selected one
		if (userId) {
			taskObj.user_id = userId;
		}

		try {
			const response = await axios.post("http://localhost:8000/api/addtask", taskObj, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			});

			if (response.status === 201) {
				const newTask = response.data;
				dispatch(addTask(newTask));
				dispatch(changeComponent("allTask"));

				// Reset form
				setTitle("");
				setDescription("");
				setStatus("new");
				setDueDate("");
				setUserId("");
			}
		} catch (err) {
			if (err.response?.status === 422) {
				setAlertMessage(err.response.data.errors.title?.[0] || "Validation failed");
			} else {
				console.error("Error creating task:", err.response?.data || err.message);
				setAlertMessage("Something went wrong!");
			}
			setIsAlertModalOpen(true);
		}
	};

	return (
		<div className="flex flex-col p-4">
			<form onSubmit={handleSubmit}>
				{/* Task title */}
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
							className={`rounded-lg border-none outline-none w-full p-2 my-2 font-Lexend font-semibold tracking-widest ${
								enabled ? "bg-[#2f2d36] text-white/50" : "bg-[#d3dee3] text-black/50"
							}`}
						/>
					</div>
				</section>

				{/* Task description */}
				<section className="mt-4">
					<TaskBodyHeading todoHeading="Description" />
					<div>
						<textarea
							placeholder="Type here"
							name="description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							required
							className={`rounded-lg border-none outline-none font-Lexend font-semibold tracking-widest p-2 w-full h-[150px] py-2 my-2 ${
								enabled ? "bg-[#2f2d36] text-white/50" : "bg-[#d3dee3] text-black/50"
							}`}
						/>
					</div>
				</section>

				{/* Status + Due Date + User */}
				<main className="flex flex-wrap gap-4">
					{/* Status */}
					<section className="my-4">
						<TaskBodyHeading todoHeading="Status" />
						<select
							name="status"
							value={status}
							onChange={(e) => setStatus(e.target.value)}
							required
							className={`rounded-lg border-none outline-none font-Lexend font-semibold tracking-widest w-[200px] p-2 my-2 ${
								enabled ? "bg-[#2f2d36] text-white/50" : "bg-[#d3dee3] text-black/50"
							}`}
						>
							<option value="new">New</option>
							<option value="to do">To Do</option>
							<option value="in progress">In Progress</option>
							<option value="pending">Pending</option>
							<option value="done">Done</option>
						</select>
					</section>

					{/* Due Date */}
					<section className="my-4">
						<TaskBodyHeading todoHeading="Due Date" />
						<input
							type="datetime-local"
							name="due_date"
							value={dueDate}
							onChange={(e) => setDueDate(e.target.value)}
							required
							className={`rounded-lg border-none outline-none font-Lexend font-semibold tracking-widest p-2 my-2 ${
								enabled ? "bg-[#2f2d36] text-white/50" : "bg-[#d3dee3] text-black/50"
							}`}
						/>
					</section>

					{/* Assign to User (admin only) */}
					{users.length > 0 && (
						<section className="my-4">
							<TaskBodyHeading todoHeading="Assign to User" />
							<select
								name="user_id"
								value={userId}
								onChange={(e) => setUserId(e.target.value)}
								className={`rounded-lg border-none outline-none font-Lexend font-semibold tracking-widest w-[200px] p-2 my-2 ${
									enabled ? "bg-[#2f2d36] text-white/50" : "bg-[#d3dee3] text-black/50"
								}`}
							>
								<option value="">Select user</option>
								{users.map((user) => (
									<option key={user.id} value={user.id}>
										{user.name}
									</option>
								))}
							</select>
						</section>
					)}
				</main>

				{/* Buttons */}
				<section className="flex justify-between items-center">
					<RiArrowLeftSLine
						onClick={() => dispatch(changeComponent("allTask"))}
						className="cursor-pointer"
						size={40}
						color={`${enabled ? "#d3dee3" : "#2f2d36"}`}
					/>
					<button
						type="submit"
						className={`${
							enabled
								? "bg-gradient-to-t from-darkTextSecondary/70 to-darkTextSecondary text-darkTextPrimary"
								: "bg-gradient-to-t from-textSecondary/50 to-textSecondary text-textPrimary"
						} px-4 py-2 rounded-2xl font-Lexend font-medium tracking-widest`}
					>
						Submit Task
					</button>
				</section>
			</form>

			{/* Alert Modal */}
			{isAlertModalOpen && (
				<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
					<div className="bg-white rounded-lg shadow-lg p-6 w-96">
						<h2 className="text-lg font-bold mb-4">Alert</h2>
						<p className="mb-6">{alertMessage}</p>
						<div className="flex justify-end">
							<button
								onClick={() => setIsAlertModalOpen(false)}
								className="px-4 py-2 rounded bg-gray-300"
							>
								OK
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default AddTask;
