import PropTypes from "prop-types"

const TodoOptions = (props) => {
	const {text} = props
	return (
		<div>
			<h1 className="font-Lexend text-[#f49b7c] capitalize">{text}</h1>
		</div>
	)
}

export default TodoOptions

TodoOptions.propTypes = {text: PropTypes.string.isRequired}
