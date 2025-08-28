import {useSelector} from "react-redux"
import AllTask from "../components/Tasks/AllTask"
import StarredTask from "./Tasks/StarredTask"
import TodayTask from "./Tasks/TodayTask"
import WeekTask from "./Tasks/WeekTask"
import AddTask from "./Tasks/AddTask"
import EditTask from "./Tasks/EditTask"
import SingleTask from "./Tasks/SingleTask"
import ProjectTasks from "./Tasks/ProjectTasks"

const TodoBody = () => {
	const {enabled} = useSelector((state) => state.theme.themeList)
	const {renderElement} = useSelector((state) => state.component)

	return (
		<div
			className="shadow-one w-[700px] h-[500px] overflow-scroll sm:w-[500px] xs:w-[400px] scrollbar-hide"
		>
			{renderElement == "allTask" && <AllTask />}
			{renderElement == "starredTask" && <StarredTask />}
			{renderElement == "todayTask" && <TodayTask />}
			{renderElement == "weekTask" && <WeekTask />}
			{renderElement == "addTask" && <AddTask />}
			{renderElement == "editTask" && <EditTask />}
			{renderElement == "single-task" && <SingleTask />}
			{renderElement == "project-task" && <ProjectTasks />}
		</div>
	)
}

export default TodoBody
