import PerButton from "./PerButton";
import { MdFiberNew } from "react-icons/md";
import { RiCalendarTodoFill } from "react-icons/ri";
import { GrInProgress } from "react-icons/gr";
import { VscError } from "react-icons/vsc";
import { IoMdDoneAll } from "react-icons/io";
import { useDispatch } from "react-redux";
import { setTasks } from "../../redux/BodyComponentSlice/componentSlice";
import axios from "axios";

const StatusButton = () => {
  const dispatch = useDispatch();

  const handleFilter = async (status) => {
    try {
      const token = localStorage.getItem("token"); 
      const res = await axios.get(
        `http://localhost:8000/api/tasks/filter/${status}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch(setTasks(res.data)); // save tasks in redux
      dispatch({ type: "component/changeComponent", payload: "filteredTasks" }); 
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  return (
    <div className="flex flex-col justify-start items-start my-1 ml-4 gap-[10px]">
      <PerButton text="New" icon={MdFiberNew} to="new"
        onClick={() => handleFilter("new")} />
      <PerButton text="to do" icon={RiCalendarTodoFill} to="todo"
        onClick={() => handleFilter("to do")} />
      <PerButton text="in progress" icon={GrInProgress} to="progress"
        onClick={() => handleFilter("in progress")} />
      <PerButton text="pending" icon={VscError} to="pending"
        onClick={() => handleFilter("pending")} />
      <PerButton text="done" icon={IoMdDoneAll} to="done"
        onClick={() => handleFilter("done")} />
    </div>
  );
};

export default StatusButton;
