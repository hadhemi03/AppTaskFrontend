import { createSlice } from "@reduxjs/toolkit"

const initialState = {
	renderElement: "allTask",
	selectedTask: null,
	tasks: [],
}

const componentSlice = createSlice({
	name: "component",
	initialState,
	reducers: {
		changeComponent: (state, { payload }) => {
			state.renderElement = payload
		},
		editTask: (state, action) => {
			state.selectedTask = action.payload
		},
		setTasks: (state, action) => {
			state.tasks = action.payload;  
		},
	},
})

export const { changeComponent, editTask, setTasks } = componentSlice.actions
export default componentSlice.reducer
