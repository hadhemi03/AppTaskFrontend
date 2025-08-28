import {useDispatch, useSelector} from "react-redux"
import {changeTheme} from "../../redux/DarkLightSlice/themeSlice"

const DarkLightBtn = () => {
	const {enabled} = useSelector((state) => state.theme.themeList)
	const dispatch = useDispatch()

	return (
		<div>
			<div
				onClick={() => dispatch(changeTheme(!enabled))}
				className={`${
					enabled
						? "bg-slate-500 hover:bg-darkTextSecondary"
						: "bg-slate-300 hover:bg-textSecondary"
				}  transition-all duration-200 inline-flex h-[18px] w-[38px] cursor-pointer shrink-0 rounded-full border-4 border-transparent`}
			>
				<span
					className={`${
						enabled ? "translate-x-4" : "translate-x-0"
					} h-[10px] pointer-events-none w-[10px] inline-block rounded-full bg-white ring-0 transition duration-200 ease-in-out`}
				></span>
			</div>
		</div>
	)
}

export default DarkLightBtn
