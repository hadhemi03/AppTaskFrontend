import {createSlice} from "@reduxjs/toolkit"
import {projectList, taskList} from "../../../public/taskList"

const formDataSlice = createSlice({
	name: "formData",
	initialState: {tasks: taskList, project: projectList, selectedTask: [], filteredTasks: []},
	reducers: {
		createTask: (state, {payload}) => {
			if (state.tasks.length == 0) {
				state.tasks.push({id: 1, ...payload})
			} else {
				const lastElement = state.tasks.length
				state.tasks.push({id: lastElement + 1, ...payload})
			}
		},

		completeTask: (state, {payload}) => {
			const {completed, taskId} = payload
			const taskIndex = state.tasks.findIndex((item) => item.id === taskId)
			state.tasks[taskIndex].isCompleted = completed
		},

		starredTask: (state, {payload}) => {
			const {starred, taskId} = payload
			const taskIndex = state.tasks.findIndex((item) => item.id === taskId)
			state.tasks[taskIndex].isStarred = starred
		},

		addedProject: (state, {payload}) => {
			if (state.project.length == 0) {
				state.project.push({id: 1, projectTitle: payload})
			} else {
				const lastEl = state.project.length
				state.project.push({id: lastEl + 1, projectTitle: payload})
			}
		},

		editProject: (state, {payload}) => {
			const {projectId, newProjectTitle} = payload
			const projectIndex = state.project.findIndex((item) => item.id === projectId)

			if (projectIndex >= 0) {
				state.project[projectIndex].projectTitle = newProjectTitle
			}
		},

		editTask: (state, {payload}) => {
			const {taskId} = payload
			const findTask = state.tasks.find((item) => item.id === taskId)
			state.selectedTask = findTask
		},

		editedTask: (state, {payload}) => {
			const {editTaskId, editTaskObj} = payload

			const findTaskObj = state.tasks.find((item) => item.id === editTaskId)

			findTaskObj.title = editTaskObj.title
			findTaskObj.note = editTaskObj.note
			findTaskObj.project = editTaskObj.project
			findTaskObj.date = editTaskObj.date
			findTaskObj.isStarred = editTaskObj.isStarred
		},

		deleteProject: (state, {payload}) => {
			const {projectId} = payload
			if (state.project.length >= 0) {
				const filterProject = state.project.filter((item) => item.id !== projectId)
				state.project = filterProject
			}
		},

		deleteTask: (state, {payload}) => {
			const {taskId} = payload
			if (state.tasks.length >= 0) {
				const filterTask = state.tasks.filter((item) => item.id !== taskId)
				state.tasks = filterTask
			}
		},

		projectTask: (state, {payload}) => {
			const {projectTitle} = payload
			state.filteredTasks = state.tasks.filter((item) => item.project === projectTitle)
		},
	},
})

export const {
	createTask,
	completeTask,
	starredTask,
	addedProject,
	editProject,
	editTask,
	deleteProject,
	deleteTask,
	editedTask,
	projectTask,
} = formDataSlice.actions
export default formDataSlice.reducer