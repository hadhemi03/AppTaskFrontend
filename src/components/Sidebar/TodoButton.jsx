import { useSelector } from "react-redux";
import PerButton from "./PerButton"
import { AiFillCalendar, AiFillStar, AiOutlineCalendar, AiOutlinePicture, AiOutlineUnorderedList } from "react-icons/ai"

const TodoButton = () => {

	const userRole = useSelector((state) => state.auth.user.role);

	return (
		<div>
			<div className="flex flex-col justify-start items-start my-4 gap-[10px]">
				<PerButton to="allTask" text="all" icon={AiOutlinePicture} />
				{/* Only show for admin */}
				{userRole === "admin" && (
					<PerButton to="myTask" text="My Tasks" icon={AiOutlineUnorderedList} />
				)}
				<PerButton to="starredTask" text="starred" icon={AiFillStar} />
				<PerButton to="todayTask" text="Today" icon={AiFillCalendar} />
				<PerButton to="weekTask" text="Week" icon={AiOutlineCalendar} />

				
			</div>
		</div>
	)
}

export default TodoButton
