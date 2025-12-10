import { createBrowserRouter } from "react-router-dom"
import MainLayout from "../layout/MainLayout"
import ErrorPage from "../pages/ErrorPage"
import HomePage from "../pages/HomePage"
import SignInPage from "../pages/SignInPage"
import RegisterPage from "../pages/RegisterPage"
import ProfilePage from "../pages/ProfilePage"
import Calendar from "../pages/CalendarPage"
import UsersPage from "../pages/UsersPage"

const router = createBrowserRouter([
	{
		path: "/",
		element: <SignInPage />, // First page shown
		errorElement: <ErrorPage />,
	},
	{
		path: "/home",
		element: <MainLayout />,
		children: [
			{ index: true, element: <HomePage /> },
			{
				path: "profile",
				element: <ProfilePage />,
			},
			{
				path: "calendar",
				element: <Calendar />,
			},
			{
				path: "users",
				element: <UsersPage />,
			},

		],
	},
	{
		path: "/register",
		element: <RegisterPage />,
	},


]);


export default router
