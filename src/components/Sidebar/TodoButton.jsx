import PerButton from "./PerButton"
import {AiFillCalendar, AiFillStar, AiOutlineCalendar, AiOutlinePicture} from "react-icons/ai"

const TodoButton = () => {
	return (
		<div>
			<div className="flex flex-col justify-start items-start my-4 gap-[10px]">
				<PerButton to="allTask" text="all" icon={AiOutlinePicture} />
				<PerButton to="starredTask" text="starred" icon={AiFillStar} />
				<PerButton to="todayTask" text="Today" icon={AiFillCalendar} />
				<PerButton to="weekTask" text="Week" icon={AiOutlineCalendar} />
			</div>
		</div>
	)
}

export default TodoButton
