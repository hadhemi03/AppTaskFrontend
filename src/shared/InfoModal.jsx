import React from "react";
import { useSelector } from "react-redux";
import StatusColored from "./StatusColored";

const InfoModal = ({ isOpen, onClose, task }) => {
  const { enabled } = useSelector((state) => state.theme.themeList);

  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 animate-fadeIn">
      <div
        className={`rounded-2xl shadow-2xl p-6 w-96 border animate-scaleUp
          ${enabled
            ? "bg-gray-800 border-gray-700 text-white"
            : "bg-gradient-to-br from-white to-gray-100 border-gray-200 text-gray-900"
          }`}
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          Task Details
        </h2>

        <div className="space-y-3">
          <div>
            <span className="font-bold">Title: </span>
            <span>{task.title}</span>
          </div>

          <div>
            <span className="font-bold">Description: </span>
            <span>{task.description || "No description"}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold">Status: </span>
            <StatusColored status={task.status} darkMode={enabled} />
          </div>

          <div>
            <span className="font-bold">Due Date: </span>
            <span>{task.due_date || "Not set"}</span>
          </div>

          <div>
            <span className="font-bold">Starred: </span>
            <span className={`font-medium ${task.starred ? "text-yellow-500" : "text-gray-400"}`}>
              {task.starred ? "★ Yes" : "No"}
            </span>
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <button
            onClick={onClose}
            className={`px-6 py-2 rounded-xl font-semibold shadow-md transition-all duration-200
              ${enabled
                ? "bg-darkTextSecondary hover:bg-gray-600 text-white"
                : "bg-textSecondary hover:bg-hoverbuttonColor text-white"
              }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;
