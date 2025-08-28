import {useSelector} from "react-redux"
import TodoContainer from "../components/TodoContainer"
import SignInPage from "./SignInPage"

const HomePage = () => {
	const {enabled} = useSelector((state) => state.theme.themeList)

	return (
		<div
			className={`${
				enabled ? "bg-darkBgPrimary" : "bg-lightBgPrimary"
			} flex flex-col justify-center items-center`}
		>
			<TodoContainer />
		</div>
	)
}

export default HomePage
