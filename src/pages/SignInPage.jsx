import axios from 'axios';
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { setCredentials } from '../redux/authSlice';

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Icon } from 'react-icons-kit';
import { eyeOff } from 'react-icons-kit/feather/eyeOff';
import { eye } from 'react-icons-kit/feather/eye';


const SignInPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post('http://localhost:8000/api/login', {
                email,
                password,
            });

            const token = response.data.token;
            const user = response.data.user;

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            dispatch(setCredentials({ token, user }));

            toast.success('Sign In successful!');

            navigate("/home");

        } catch (err) {
            setError('Invalid Credentials');
            console.error(err);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-lightBgPrimary">
            <div className="bg-white p-8 rounded-xl shadow-sm">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">Sign In To Your Account</h2>
                    {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    {/* Email Field */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email address
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-80 px-5 py-3 text-base rounded-md border border-gray-300  focus:ring-indigo-500"
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    {/* Password Field */}
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                        </div>
                        <div className="relative">

                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2.5 text-base rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                                placeholder="Enter your password"
                                required
                            />
                            <span
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
                            >
                                <Icon icon={showPassword ? eyeOff : eye} size={20} />
                            </span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2.5 px-4 text-base font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        style={{ backgroundColor: '#f8917e' }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f8917e')}  // darker on hover
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#e37361')}  // back to original
                    >
                        Sign in
                    </button>
                </form>

                {/* Register Link */}
                <p className="mt-6 text-center text-sm text-gray-600">
                    Not a member?{' '}
                    <a href="/register" className="font-medium"
                        style={{ color: '#f8917e' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#e37361'} // darker on hover
                        onMouseLeave={e => e.currentTarget.style.color = '#f8917e'} >
                        Register now
                    </a>
                </p>
            </div>
            {/* Toast Container to Display Notifications */}
            <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
        </div>


    )
}

export default SignInPage