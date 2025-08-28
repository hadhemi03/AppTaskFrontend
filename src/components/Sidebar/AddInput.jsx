import {useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {FaEdit} from "react-icons/fa"
import {MdDelete} from "react-icons/md"
import {FaFolderClosed} from "react-icons/fa6"

import {
	addedProject,
	deleteProject,
	editProject,
	projectTask,
} from "../../redux/FormData/formDataSlice"
import {changeComponent} from "../../redux/BodyComponentSlice/componentSlice.js"

const AddInput = () => {
	const {enabled, isProjectInput} = useSelector((state) => state.theme.themeList)
	const {project} = useSelector((state) => state.formData)

	const [inputField, setInputField] = useState("")
	const [editMode, setEditMode] = useState(null)
	const dispatch = useDispatch()

	const handleSubmit = (event) => {
		if (editMode !== null) {
			if (event.key === "Enter") {
				const {id} = editMode
				dispatch(editProject({projectId: id, newProjectTitle: inputField})),
					setEditMode(null),
					setInputField("")
			}
		} else {
			if (event.key === "Enter") {
				dispatch(addedProject(inputField))
				setInputField("")
			}
		}
	}

	const handleEditClick = (id, projectTitle) => {
		setInputField(projectTitle)
		setEditMode({id, projectTitle})
	}

	const handleProjectTask = (projectTitle) => {
		dispatch(changeComponent("project-task"))
		dispatch(projectTask({projectTitle}))
	}

	return (
		<div className="flex flex-col justify-center items-center mx-4">
			{isProjectInput && (
				<input
					placeholder="type here your project"
					type="text"
					onChange={(event) => setInputField(event.target.value)}
					onKeyDown={handleSubmit}
					value={inputField}
					className={`rounded-lg border-none outline-none w-full p-2 my-2 font-Lexend font-semibold tracking-widest ${
						enabled ? "bg-[#2f2d36] text-white/50" : "bg-[#d3dee3] text-black/50"
					}`}
				/>
			)}

			{project &&
				project.map((item, index) => {
					const {id, projectTitle} = item
					return (
						<div
							className={`rounded-lg border-none outline-none w-full p-2 my-2 font-Lexend font-semibold tracking-widest cursor-pointer ${
								enabled ? "bg-[#2f2d36] text-white/50" : "bg-[#d3dee3] text-black/50"
							}`}
							key={index}
						>
							<div className="flex flex-row justify-between items-center group">
								<div className="flex flex-row justify-normal items-center gap-4">
									<FaFolderClosed />
									{editMode && editMode.id === id ? (
										<input
											type="text"
											value={projectTitle}
											onChange={(event) => setInputField(event.target.value)}
											onKeyDown={handleSubmit}
											className={`border-none outline-none p-0 font-Lexend font-semibold tracking-widest ${
												enabled ? "bg-transparent text-white" : "bg-transparent text-black"
											}`}
										/>
									) : (
										<button
											onClick={() => handleProjectTask(projectTitle)}
											className="first-letter:capitalize tracking-wider"
										>
											{projectTitle}
										</button>
									)}
								</div>

								<div className="flex gap-4">
									<FaEdit
										onClick={() => handleEditClick(id, projectTitle)}
										className={`group-hover:block hidden ${
											editMode && editMode.id === id ? "text-[#7f5bf7]" : ""
										}`}
										color={enabled ? "#7f5bf7" : "#f8917e"}
									/>

									<MdDelete
										onClick={() => dispatch(deleteProject({projectId: id}))}
										className="group-hover:block hidden"
										color={enabled ? "#7f5bf7" : "#f8917e"}
									/>
								</div>
							</div>
						</div>
					)
				})}
		</div>
	)
}

export default AddInput
