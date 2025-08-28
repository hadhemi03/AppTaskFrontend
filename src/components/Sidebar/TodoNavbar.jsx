import { useSelector } from "react-redux"
import TodoButton from "./TodoButton"
import TodoOptions from "./TodoOptions"

const TodoNavbar = () => {
	const { enabled, closeNavbar } = useSelector((state) => state.theme.themeList)

	return (
		<div
			className={`${enabled ? "bg-darkBgSecondary" : "bg-lightBgSecondary"
				} rounded-2xl shadow-one lg:block xl:block 2xl:block ${closeNavbar ? "md:block sm:block xs:block" : "md:hidden sm:hidden xs:hidden"
				} overflow-scroll scrollbar-hide h-[500px]`}
		>
			{/* div one */}
			<div className="w-[300px] h-fit px-4 py-2">
				<div className="flex flex-row justify-between">
					<TodoOptions text="filter" />
				</div>
				<TodoButton />
			</div>
			
		</div>
	)
}

export default TodoNavbar
