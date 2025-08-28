import { useDispatch, useSelector } from "react-redux"
import { RiStarFill, RiStarLine } from "react-icons/ri"
import { RiArrowLeftSLine } from "react-icons/ri"

import TaskBodyHeading from "../../shared/TaskBodyHeading"
import { changeStar } from "../../redux/DarkLightSlice/themeSlice"
import { changeComponent } from "../../redux/BodyComponentSlice/componentSlice"
import { useState } from "react"
import axios from "axios"
import { addTask } from "../../redux/TaskSlice"

const AddTask = () => {
	const { enabled } = useSelector((state) => state.theme.themeList);

	const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
	const [alertMessage, setAlertMessage] = useState("");




	const dispatch = useDispatch()

	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [status, setStatus] = useState('new');
	const [dueDate, setDueDate] = useState('');

	const handleSubmit = async (e) => {
		e.preventDefault();

		const formattedDueDate = dueDate.replace("T", " ");

		const taskObj = {
			title,
			description,
			status,
			due_date: formattedDueDate,
		}

		try {
			const response = await axios.post("http://localhost:8000/api/addtask", taskObj, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			})

			if (response.status === 201) {
				const newTask = response.data;
				dispatch(addTask(newTask));

				dispatch(changeComponent("allTask"));

				setTitle("");
				setDescription("");
				setStatus("new");
				setDueDate("");
			}
		} catch (err) {
			// Show Laravel validation error in frontend
			if (err.response?.status === 422) {
				setAlertMessage(err.response.data.errors.title?.[0] || "Validation failed");
				setIsAlertModalOpen(true);
			} else {
				console.error("Error creating task:", err.response?.data || err.message);
				setAlertMessage("Something went wrong!");
				setIsAlertModalOpen(true);
			}

		}

	}

	return (
		<div className="flex flex-col p-4">
			<form onSubmit={handleSubmit}>
				{/* task title */}
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
							className={`rounded-lg border-none outline-none w-full p-2 my-2 font-Lexend font-semibold tracking-widest ${enabled ? "bg-[#2f2d36] text-white/50" : "bg-[#d3dee3] text-black/50"
								}`}
						/>
					</div>
				</section>
				{/* Task description */}
				<section className="mt-4">
					<TaskBodyHeading todoHeading="Description" />
					<div>
						<textarea
							type="text"
							placeholder="Type here"
							name="description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							required
							className={`rounded-lg border-none outline-none font-Lexend font-semibold tracking-widest p-2 w-full h-[150px] py-2 my-2 ${enabled ? "bg-[#2f2d36] text-white/50" : "bg-[#d3dee3] text-black/50"
								}`}
						/>
					</div>
				</section>

				{/* task project and task date and star */}
				<main className="flex gap-4">
					<section className="my-4">
						<TaskBodyHeading todoHeading="Status" />
						<select
							name="status"
							value={status}
							onChange={(e) => setStatus(e.target.value)}
							required
							className={`rounded-lg border-none outline-none font-Lexend font-semibold tracking-widest focus:border-none focus:outline-none w-[200px] p-2 my-2 ${enabled ? "bg-[#2f2d36] text-white/50" : "bg-[#d3dee3] text-black/50"
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
							className={`rounded-lg border-none outline-none font-Lexend font-semibold tracking-widest p-2 my-2 ${enabled ? "bg-[#2f2d36] text-white/50" : "bg-[#d3dee3] text-black/50"
								}`}
						/>
					</section>
					
				</main>

				{/* Task submit and back button */}
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
						Submit Task
					</button>
				</section>
			</form>

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
	)
}

export default AddTask
