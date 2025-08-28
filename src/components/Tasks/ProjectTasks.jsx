import {useDispatch, useSelector} from "react-redux"
import TaskBodyHeading from "../../shared/TaskBodyHeading"
import {
	RiCheckboxBlankCircleLine,
	RiCheckboxCircleFill,
	RiStarFill,
	RiStarLine,
} from "react-icons/ri"
import {completeTask, deleteTask, editTask, starredTask} from "../../redux/FormData/formDataSlice"
import {changeComponent} from "../../redux/BodyComponentSlice/componentSlice"
import {FaEdit} from "react-icons/fa"
import {MdDelete} from "react-icons/md"

const ProjectTasks = () => {
	const {filteredTasks} = useSelector((state) => state.formData)
	const {enabled} = useSelector((state) => state.theme.themeList)

	const dispatch = useDispatch()

	const handleEdit = (id) => {
		dispatch(changeComponent("editTask"))
		dispatch(editTask({taskId: id}))
	}


	return (
		<div className="flex flex-col p-4">
			<TaskBodyHeading todoHeading="Project Task" />

			{filteredTasks?.map((item, index) => {
				const {title, id, isCompleted, isStarred, isStar} = item

				return (
					<div
						key={index}
						className={`${
							enabled ? "bg-[#2f2d36] hover:bg-black/10" : "bg-[#d3dee3] hover:bg-[#c4cdd1]"
						} flex justify-between items-center my-4 b p-2 rounded-lg cursor-pointer transition-all duration-200 shadow-one hover:shadow-two group`}
					>
						<div className="flex justify-center items-center gap-4">
							{isCompleted ? (
								<RiCheckboxCircleFill
									color="#7a8db0"
									onClick={() => dispatch(completeTask({completed: false, taskId: id}))}
								/>
							) : (
								<RiCheckboxBlankCircleLine
									onClick={() => dispatch(completeTask({completed: true, taskId: id}))}
									color="#7a8db0"
								/>
							)}

							<p
								className={`${enabled ? "text-white/60" : "text-black/60"} ${
									isCompleted ? "line-through" : ""
								} font-Lexend text-[17px] font-medium`}
							>
								{title}
							</p>
						</div>

						<div className="flex justify-between items-center gap-4">
							<div className="flex gap-4">
								<FaEdit
									onClick={() => handleEdit(id)}
									className="group-hover:block hidden"
									color={enabled ? "#7f5bf7" : "#f8917e"}
								/>
								<MdDelete
									onClick={() => dispatch(deleteTask({taskId: id}))}
									className="group-hover:block hidden"
									color={enabled ? "#7f5bf7" : "#f8917e"}
								/>
							</div>
							<div>
								{isStarred || isStar ? (
									<RiStarFill
										onClick={() => dispatch(starredTask({starred: false, taskId: id}))}
										color="#7a8db0"
										size={20}
									/>
								) : (
									<RiStarLine
										onClick={() => dispatch(starredTask({starred: true, taskId: id}))}
										color="#7a8db0"
										size={20}
									/>
								)}
							</div>
						</div>
					</div>
				)
			})}
		</div>
	)
}

export default ProjectTasks
