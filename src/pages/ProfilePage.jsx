import { useEffect, useState } from "react";
import axios from "axios";
import Button from "../shared/Button";
import { useDispatch } from "react-redux";
import { updateUser } from "../redux/authSlice";

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "", password: "", password_confirmation: "" });
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("http://localhost:8000/api/user", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(response.data);
                setFormData({
                    name: response.data.name,
                    email: response.data.email,
                    password: "",
                    password_confirmation: "",
                    profilepicture: response.data.profile_picture,
                });
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };
        fetchUser();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async () => {
        try {
            const token = localStorage.getItem("token");
            const formDataToSend = new FormData();

            formDataToSend.append("name", formData.name);
            formDataToSend.append("email", formData.email);

            if (formData.password) {
                formDataToSend.append("password", formData.password);
                formDataToSend.append("password_confirmation", formData.password_confirmation);
            }

            if (formData.profile_picture) {
                formDataToSend.append("profile_picture", formData.profile_picture);
            }

            const response = await axios.post(
                "http://localhost:8000/api/update?_method=PUT", 
                formDataToSend,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            setUser(response.data.user);
            setIsEditing(false);

            dispatch(updateUser(response.data.user));
        } catch (error) {
            console.error("Error updating user:", error.response?.data || error);
        }
    };


    if (!user) return <div className="text-center mt-20">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto my-10 p-6 bg-white shadow-md rounded-lg">
            {/* Header */}
            <div className="flex items-center space-x-6 border-b pb-6">
                <img
                    src={
                        user && user.profile_picture
                            ? `http://localhost:8000/${user.profile_picture}`
                            : "https://www.citypng.com/public/uploads/preview/profile-user-round-white-icon-symbol-png-701751695033499brrbuebohc.png"
                    } alt="Profile"
                    className="w-24 h-24 rounded-full border-2 border-gray-300"
                />
            </div>

            {/* Profile Section */}
            {!isEditing ? (
                <>
                    {/* View Mode */}
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Full Name</h3>
                            <p className="text-gray-700">{user.name}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Email</h3>
                            <p className="text-gray-700">{user.email}</p>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                        <Button btnText="Edit Profile" onClick={() => setIsEditing(true)} />
                    </div>
                </>
            ) : (
                <>
                    {/* Edit Mode */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
                        <input
                            type="file"
                            name="profile_picture"
                            accept="image/*"
                            onChange={(e) => setFormData({ ...formData, profile_picture: e.target.files[0] })}
                            className="mt-1 w-full p-2 border rounded-md"
                        />
                    </div>

                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="mt-1 w-full p-2 border rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="mt-1 w-full p-2 border rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">New Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="mt-1 w-full p-2 border rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                            <input
                                type="password"
                                name="password_confirmation"
                                value={formData.password_confirmation}
                                onChange={handleChange}
                                className="mt-1 w-full p-2 border rounded-md"
                            />
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end space-x-3">
                        <Button btnText="Cancel" onClick={() => setIsEditing(false)} />
                        <Button btnText="Save Changes" onClick={handleUpdate} />
                    </div>
                </>
            )}
        </div>
    );
};

export default ProfilePage;
