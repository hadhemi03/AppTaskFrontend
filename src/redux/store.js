import {configureStore} from "@reduxjs/toolkit"
import logger from "redux-logger"
import themeReducer from "./DarkLightSlice/themeSlice"
import componentReducer from "./BodyComponentSlice/componentSlice"
import authReducer from './authSlice.js'
import taskReducer from './TaskSlice.js'

const store = configureStore({
	reducer: {theme: themeReducer, 
		component: componentReducer, 
		auth: authReducer,
		tasks: taskReducer,
	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
})

export default store
