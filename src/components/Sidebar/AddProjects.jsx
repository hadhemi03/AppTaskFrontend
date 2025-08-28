import {FaPlus} from "react-icons/fa6"
import {useDispatch, useSelector} from "react-redux"
import {showProjectInput} from "../../redux/DarkLightSlice/themeSlice"

const AddProjects = () => {
	const {enabled, isProjectInput} = useSelector((state) => state.theme.themeList)
	const dispatch = useDispatch()

	return (
		<div>
			<button
				className={`hover:scale-125 transition-all duration-200 ${
					isProjectInput
						? "rotate-45 transition-all duration-200"
						: "rotate-0 transition-all duration-200"
				}`}
			>
				<FaPlus
					onClick={() => dispatch(showProjectInput(!isProjectInput))}
					color={`${enabled ? "#8d8fd2" : "#ff7c7c"}`}
				/>
			</button>
		</div>
	)
}

export default AddProjects
