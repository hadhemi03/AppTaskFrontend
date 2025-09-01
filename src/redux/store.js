import {configureStore} from "@reduxjs/toolkit"
import logger from "redux-logger"
import themeReducer from "./DarkLightSlice/themeSlice"
import componentReducer from "./BodyComponentSlice/componentSlice"
import authReducer from './authSlice.js'
import taskReducer from './TaskSlice.js'
import notifReducer from './notificationSlice'

const store = configureStore({
	reducer: {theme: themeReducer, 
		component: componentReducer, 
		auth: authReducer,
		tasks: taskReducer,
		notif: notifReducer,
	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
})

export default store
