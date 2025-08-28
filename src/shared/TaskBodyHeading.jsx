import PropTypes from "prop-types"
import {useSelector} from "react-redux"

const TaskBodyHeading = (props) => {
	const {enabled} = useSelector((state) => state.theme.themeList)
	const {todoHeading} = props
	return (
		<>
			<h1
				className={`${
					enabled ? "text-darkTextSecondary" : "text-textSecondary"
				} font-Lexend font-medium text-xl tracking-wider capitalize`}
			>
				{todoHeading}
			</h1>
		</>
	)
}

export default TaskBodyHeading

TaskBodyHeading.propTypes = {todoHeading: PropTypes.string.isRequired}
