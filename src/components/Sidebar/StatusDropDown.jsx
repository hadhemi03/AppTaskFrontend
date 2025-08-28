import { useDispatch } from "react-redux";
import { setTasks } from "../../redux/BodyComponentSlice/componentSlice"; // add tasks to your slice
import axios from "axios";

const StatusDropdown = () => {
  const dispatch = useDispatch();
  const statuses = ["new", "to do", "in progress", "pending", "done"];

  const handleFilter = async (status) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      `http://localhost:8000/api/tasks/filter/${status}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    dispatch(setTasks(res.data)); // updates Redux
  } catch (err) {
    console.error("Error fetching tasks by status:", err);
    alert("Failed to fetch tasks");
  }
};


  return (
    <el-dropdown className="inline-block">
      <button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs hover:bg-gray-50">
        Status
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          className="-mr-1 size-5 text-gray-400"
        >
          <path
            d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
            clipRule="evenodd"
            fillRule="evenodd"
          />
        </svg>
      </button>

      <el-menu anchor="bottom end" popover className="w-56 origin-top-right rounded-md bg-white shadow-lg outline-1 outline-black/5">
        <div className="py-1">
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => handleFilter(status)}
              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
            >
              {status}
            </button>
          ))}
        </div>
      </el-menu>
    </el-dropdown>
  );
};

export default StatusDropdown;
