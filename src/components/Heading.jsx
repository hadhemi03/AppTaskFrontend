import { useDispatch, useSelector } from "react-redux"
import { LuAlignJustify } from "react-icons/lu"
import { LiaTimesSolid } from "react-icons/lia"

import { changeIcon } from "../redux/DarkLightSlice/themeSlice"

import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { logoutUser } from "../redux/authSlice"
import { useNavigate } from "react-router-dom"
import DarkLightBtn from "./Sidebar/DarkLightBtn"
import { useEffect, useState } from "react"
import NotificationsLogger from "./NotificationsLogger"

const navigation = [
	{ name: 'Home', href: '/home', current: false },
	{ name: 'Calendar', href: '/home/calendar', current: false },
]

function classNames(...classes) {
	return classes.filter(Boolean).join(' ');
}

const Heading = () => {
	const navigate = useNavigate();
	const { enabled, closeNavbar } = useSelector((state) => state.theme.themeList)
	const dispatch = useDispatch();

	const user = useSelector((state) => state.auth.user);


	const handleLogout = async () => {
		await dispatch(logoutUser());
		navigate('/');
	};



	return (
		<Disclosure as="nav" className="relative bg-gray-800">
			<div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
				<div className="relative flex h-16 items-center justify-between">

					{/* Hamburger button visible on md+ screens only */}
					<div className="inset-y-0 left-0 flex items-center hidden sm:flex">
						{/* Mobile menu button*/}
						<DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white focus:outline-2 focus:-outline-offset-1 focus:outline-indigo-500">
							<span className="absolute -inset-0.5" />
							<span className="sr-only">Open main menu</span>
							<Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
							<XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
						</DisclosureButton>
					</div>

					<div className="flex flex-1 items-center justify-between ">
						{/* LOGO: to do. */}
						<div className="flex items-center pl-4 pe-20">
							<span className={`text-5xl font-Lexend ${enabled ? "text-darkTextPrimary" : "text-textPrimary"}`}>
								to
							</span>
							<span className={`text-5xl font-Lexend ${enabled ? "text-darkTextSecondary" : "text-textSecondary"}`}>
								do.
							</span>
						</div>

						<div className="sm:hidden sm:flex flex-1 justify-center space-x-6 ps-20">
							{navigation.map((item) => (
								<a
									key={item.name}
									href={item.href}
									aria-current={item.current ? 'page' : undefined}
									className={classNames(
										item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-white/5 hover:text-white',
										'rounded-md px-3 py-2 text-sm font-medium'
									)}
								>
									{item.name}
								</a>
							))}
						</div>

						{/* RIGHT: Profile / Notification */}
						<div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
							<button
								type="button"
								className="relative rounded-full p-1 text-gray-400 focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500"
							>
								<span className="absolute -inset-1.5" />
								<span className="sr-only">View notifications</span>
								<BellIcon aria-hidden="true" className="size-6" />
							</button>

							<Menu as="div" className="relative ml-3">
								<MenuButton className="relative flex rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
									<span className="absolute -inset-1.5" />
									<span className="sr-only">Open user menu</span>
									<img
										alt=""
										src={
											user && user.profile_picture
												? `http://localhost:8000/${user.profile_picture}?t=${Date.now()}`
												: "https://www.citypng.com/public/uploads/preview/profile-user-round-white-icon-symbol-png-701751695033499brrbuebohc.png"
										}
										className="size-8 rounded-full bg-gray-800 outline -outline-offset-1 outline-white/10"
									/>
								</MenuButton>
								<MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg">
									<MenuItem>
										<a href="home/profile" className="block px-4 py-2 text-sm text-gray-700">Your profile</a>
									</MenuItem>
									<MenuItem>
										<button
											onClick={handleLogout}
											className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
										>
											Logout
										</button>
									</MenuItem>
								</MenuItems>
							</Menu>

							<div className="ml-6">
								<DarkLightBtn />
								<NotificationsLogger />
							</div>
						</div>



					</div>

				</div>

				{/* DisclosurePanel visible only on md+ screens */}
				<DisclosurePanel className="hidden sm:block">
					<div className="space-y-1 px-2 pt-2 pb-3">
						{navigation.map((item) => (
							<DisclosureButton
								key={item.name}
								as="a"
								href={item.href}
								aria-current={item.current ? 'page' : undefined}
								className={classNames(
									item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-white/5 hover:text-white',
									'block rounded-md px-3 py-2 text-base font-medium',
								)}
							>
								{item.name}
							</DisclosureButton>
						))}
					</div>
				</DisclosurePanel>
			</div>
		</Disclosure>
	)
}

export default Heading
