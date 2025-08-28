import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { changeComponent } from "../../redux/BodyComponentSlice/componentSlice";
import { changeIcon } from "../../redux/DarkLightSlice/themeSlice"; 

const PerButton = ({ text, icon: Icon, to, onClick }) => {
  const { enabled } = useSelector((state) => state.theme.themeList);
  const dispatch = useDispatch();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      dispatch(changeComponent(to));
    }

    //Auto-close navbar on mobile
    if (window.innerWidth < 1024) {
      dispatch(changeIcon(false));
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`text-[#7a8aa4] font-Lexend w-full text-left rounded-lg px-2 flex justify-start items-center gap-2 py-1 ${
        enabled ? "focus:bg-[#2f2d36]" : "focus:bg-[#d3dee3]"
      }`}
    >
      {Icon && <Icon />}
      <span className="capitalize">{text}</span>
    </button>
  );
};

export default PerButton;

PerButton.propTypes = {
  text: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  to: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};
