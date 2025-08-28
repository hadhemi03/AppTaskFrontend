import {Outlet} from "react-router-dom"
import Heading from "../components/Heading"
import {useSelector} from "react-redux"

const MainLayout = () => {
	const {enabled} = useSelector((state) => state.theme.themeList)

	return (
		<div className={`${enabled ? "bg-darkBgPrimary" : "bg-lightBgPrimary"} min-h-screen`}>
			<Heading /> 
			<Outlet />
		</div>
	)
}

export default MainLayout
