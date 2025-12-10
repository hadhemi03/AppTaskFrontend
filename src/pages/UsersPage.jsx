// pages/UsersPage.jsx

import { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import TaskBodyHeading from "../shared/TaskBodyHeading";
import Button from "../shared/Button";
import { useSelector } from "react-redux";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [userToDelete, setUserToDelete] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const { enabled } = useSelector((state) => state.theme.themeList);

  // ------------------------- FETCH USERS -------------------------
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUsers(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching users:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ------------------------- DELETE USER -------------------------
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/users/${userToDelete}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setUsers(users.filter((u) => u.id !== userToDelete));
      setIsDeleteModalOpen(false);
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user");
    }
  };

  // ------------------------- UPDATE USER -------------------------
  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:8000/api/users/${selectedUser.id}`,
        selectedUser,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      fetchUsers();
      setIsEditModalOpen(false);
    } catch (err) {
      console.error("Error updating user:", err);
      alert("Failed to update user");
    }
  };

  return (
    <div className="flex flex-col p-8 min-h-screen">

      {/* PAGE TITLE */}
      <div className="mb-6">
        <TaskBodyHeading todoHeading="Users Management" />
        <p className={`${enabled ? "text-white/50" : "text-black/60"} text-sm mt-1`}>
          Manage all registered users, update their roles, or remove accounts.
        </p>
      </div>

      {/* USERS LIST */}
      <div className="flex-1 overflow-y-auto mt-4 space-y-4">
        {loading && (
          <p className="text-center text-gray-500 text-lg">Loading users...</p>
        )}

        {!loading &&
          users.map((item) => (
            <div
              key={item.id}
              className={`
                ${enabled ? "bg-[#2f2d36]" : "bg-white"} 
                p-5 rounded-xl shadow-md hover:shadow-xl 
                transition-all duration-200 border 
                ${enabled ? "border-white/10" : "border-black/10"}
                flex items-center justify-between group
              `}
            >
              {/* LEFT SIDE */}
              <div className="flex items-center gap-4">

                {/* USER PROFILE PICTURE */}
                <img
                  src={
                    item.profile_picture ||
                    "https://www.citypng.com/public/uploads/preview/profile-user-round-white-icon-symbol-png-701751695033499brrbuebohc.png"
                  }
                  alt="User"
                  className="w-12 h-12 rounded-full object-cover border border-gray-300"
                />

                <div>
                  <p className={`${enabled ? "text-white" : "text-gray-900"} text-lg font-semibold`}>
                    {item.name}
                  </p>
                  <p className={`${enabled ? "text-white/50" : "text-gray-600"} text-sm`}>
                    {item.email}
                  </p>
                  <span
                    className={`
                      mt-1 inline-block text-xs font-medium px-3 py-1 rounded-full
                      ${
                        item.role === "admin"
                          ? "bg-indigo-500/20 text-indigo-500"
                          : "bg-green-500/20 text-green-600"
                      }
                    `}
                  >
                    {item.role}
                  </span>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex gap-6 opacity-80 group-hover:opacity-100 transition">
                <FaEdit
                  size={22}
                  className="cursor-pointer hover:scale-110 transition"
                  color={enabled ? "#7f5bf7" : "#4f46e5"}
                  onClick={() => {
                    setSelectedUser(item);
                    setIsEditModalOpen(true);
                  }}
                />
                <MdDelete
                  size={24}
                  className="cursor-pointer hover:scale-110 transition"
                  color={enabled ? "#f77a7a" : "#dc2626"}
                  onClick={() => {
                    setUserToDelete(item.id);
                    setIsDeleteModalOpen(true);
                  }}
                />
              </div>
            </div>
          ))}
      </div>

      {/* DELETE MODAL */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96">
            <h2 className="text-xl font-bold mb-3 text-red-600">Delete User</h2>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this user? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {isEditModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4 text-indigo-600">Edit User</h2>

            <input
              type="text"
              className="border p-2 w-full mb-3 rounded-lg"
              value={selectedUser.name}
              onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
            />

            <input
              type="email"
              className="border p-2 w-full mb-3 rounded-lg"
              value={selectedUser.email}
              onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
            />

            <select
              className="border p-2 w-full mb-3 rounded-lg"
              value={selectedUser.role}
              onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

            <div className="flex justify-end gap-3 mt-4">
              <button
                className="px-4 py-2 rounded bg-gray-300"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
                onClick={handleUpdate}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
