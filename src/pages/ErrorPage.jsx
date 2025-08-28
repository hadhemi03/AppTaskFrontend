import { Outlet } from "react-router-dom"
import Heading from "../components/Heading"
import { useSelector } from "react-redux"

const ErrorPage = () => {
	const { enabled } = useSelector
		((state) => state.theme.themeList)

	return (
		<div className={`${enabled ? "bg-darkBgPrimary" : "bg-lightBgPrimary"} min-h-screen`}>
			<Heading />
			<div>
				<div className="text-center">
					<h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">Page not found</h1>
					<p className="mt-6 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">Sorry, we couldn’t find the page you’re looking for.</p>
					<div className="mt-10 flex items-center justify-center gap-x-6">
						<a
							href="/home"
							style={{ backgroundColor: '#f8917e' }}
							className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Go back home</a>
					</div>
				</div>
			</div>
			<Outlet />
		</div>
	)
}

export default ErrorPage
