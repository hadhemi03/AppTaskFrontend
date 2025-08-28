import TodoBody from "./TodoBody";
import TodoNavbar from "./Sidebar/TodoNavbar";
import { useSelector, useDispatch } from "react-redux";
import { changeIcon } from "../redux/DarkLightSlice/themeSlice";
import { LuAlignJustify } from "react-icons/lu";
import { LiaTimesSolid } from "react-icons/lia";

const TodoContainer = () => {
  const { closeNavbar, enabled } = useSelector((state) => state.theme.themeList);
  const dispatch = useDispatch();

  return (
    <div className="flex gap-4 p-8">
      {/* Menu button: ONLY visible on mobile */}
      <div className="2xl:hidden z-[60]">
        {closeNavbar ? (
          <LiaTimesSolid
            className="cursor-pointer"
            size={40}
            onClick={() => dispatch(changeIcon(false))}
            color={enabled ? "#7f5bf7" : "#f8917e"}
          />
        ) : (
          <LuAlignJustify
            className="cursor-pointer"
            size={40}
            onClick={() => dispatch(changeIcon(true))}
            color={enabled ? "#7f5bf7" : "#f8917e"}
          />
        )}
      </div>

      {/* Sidebar: ALWAYS visible on desktop, hidden on mobile */}
      <div className="sm:hidden">
        <TodoNavbar />
      </div>

      {/* when menu is clicked */}
      {closeNavbar && (
        <div className="fixed inset-0 bg-opacity-50 backdrop-filter backdrop-blur-sm z-50 md:hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-fit h-fit mx-auto text-center">
              <TodoNavbar />
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1">
        <TodoBody />
      </div>
    </div>
  );
};

export default TodoContainer;