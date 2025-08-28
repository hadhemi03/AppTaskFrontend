import axios from 'axios';
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { strengthIndicator, strengthColor } from '../utils/password-strength';
import { Icon } from 'react-icons-kit';
import { eyeOff } from 'react-icons-kit/feather/eyeOff';
import { eye } from 'react-icons-kit/feather/eye';
import { setCredentials } from '../redux/authSlice';


const RegisterPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [passwordStrength, setPasswordStrength] = useState(null);
    const [passwordsMatch, setPasswordsMatch] = useState(true);

    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
    const [hasTypedConfirmation, setHasTypedConfirmation] = useState(false);


    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const [profilePicture, setProfilePicture] = useState(null);

    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.com$/.test(email);
    };


    const handlePasswordChange = (value) => {
        setPassword(value);
        const score = strengthIndicator(value);
        setPasswordStrength(strengthColor(score));
        setPasswordsMatch(value === passwordConfirmation);
    };

    const handlePasswordConfirmationChange = (value) => {
        setPasswordConfirmation(value);
        setPasswordsMatch(password === value);
        setHasTypedConfirmation(true)
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if (!isValidEmail(email)) {
            setError('Please enter a valid email address.');
            return;
        }


        if (!passwordsMatch) {
            setError('Passwords do not match');
            return;
        }


        const allowedStrengths = ['Normal', 'Good', 'Strong'];
        if (!passwordStrength || !allowedStrengths.includes(passwordStrength.label)) {
            setError('Please choose a stronger password.');
            return;
        }

        try {
            setLoading(true);   // start loading
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('password_confirmation', passwordConfirmation);
            formData.append('profile_picture', profilePicture);

            const response = await axios.post('http://localhost:8000/api/register', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });


            const { token, user } = response.data;
            dispatch(setCredentials({ token, user }))

            navigate('/home');

        } catch (err) {
            if (err.response?.data?.errors) {
                // Laravel validation error ( exp : email already taken )
                const firstError = Object.values(err.response.data.errors)[0][0];
                setError(firstError);
            } else {
                setError('Registration failed');
            }
            console.error(err);
        } finally {
            setLoading(false);
        }

    }


    return (
        <div className="flex min-h-screen items-center justify-center bg-lightBgPrimary">
            <div className="bg-white p-8 rounded-xl shadow-sm">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">Register Now</h2>
                </div>

                {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}


                <form onSubmit={handleRegister} className="space-y-8 ">

                    {/* Email Field  */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-80 px-5 py-3 text-base rounded-md border border-gray-300  focus:ring-indigo-500"
                            placeholder="Enter your name"
                            required
                        />
                    </div>

                    {/* Email Field  */}
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

                    {/* Password Field  */}
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
                                onChange={(e) => handlePasswordChange(e.target.value)}
                                className="w-full px-4 py-2.5 pr-10 text-base rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500"
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

                        {passwordStrength && (
                            <div className="mt-2">
                                <p className="text-sm mb-1" style={{ color: passwordStrength.color }}>
                                    {passwordStrength.label}
                                </p>
                                <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
                                    <div
                                        className="h-full transition-all duration-300"
                                        style={{
                                            width:
                                                passwordStrength.label === "Poor" ? "20%" :
                                                    passwordStrength.label === "Weak" ? "40%" :
                                                        passwordStrength.label === "Normal" ? "60%" :
                                                            passwordStrength.label === "Good" ? "80%" : "100%",
                                            backgroundColor:
                                                passwordStrength.label === "Poor" ? "#ef4444" :
                                                    passwordStrength.label === "Weak" ? "#f59e0b" :
                                                        passwordStrength.label === "Normal" ? "#d97706" :
                                                            passwordStrength.label === "Good" ? "#10b981" : "#047857"
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Password Confirmation Field  */}
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
                                Confirm Password
                            </label>
                        </div>
                        <div className="relative">
                            <input
                                id="password_confirmation"
                                type={showPasswordConfirmation ? "text" : "password"}
                                value={passwordConfirmation}
                                onChange={(e) => handlePasswordConfirmationChange(e.target.value)}
                                onFocus={() => setHasTypedConfirmation(true)}
                                className="w-full px-4 py-2.5 pr-10 text-base rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                                placeholder="Enter your password"
                                required
                            />
                            <span
                                onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                                className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
                            >
                                <Icon icon={showPasswordConfirmation ? eyeOff : eye} size={20} />
                            </span>
                        </div>

                        {hasTypedConfirmation && !passwordsMatch && (
                            <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="profile_picture" className="block text-sm font-medium text-gray-700 mb-1">
                            Profile Picture
                        </label>
                        <input
                            id="profile_picture"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setProfilePicture(e.target.files[0])}
                            className="w-80 px-3 py-2 text-base rounded-md border border-gray-300 focus:ring-indigo-500"
                            required
                        />
                        {profilePicture && (
                            <div className="mt-4">
                                <img
                                    src={URL.createObjectURL(profilePicture)}
                                    alt="Profile Preview"
                                    className="w-24 h-24 object-cover rounded-full"
                                />
                            </div>
                        )}
                    </div>


                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 px-4 text-base font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        style={{ backgroundColor: '#f8917e' }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f8917e')}  // darker on hover
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#e37361')}  // back to original
                    >
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>

                {/* Sign In Link */}
                <p className="mt-6 text-center text-sm text-gray-600">
                    Do you have an account?{' '}
                    <a href="/" className="font-medium"
                        style={{ color: '#f8917e' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#e37361'} // darker on hover
                        onMouseLeave={e => e.currentTarget.style.color = '#f8917e'} >
                        Sign In
                    </a>
                </p>
            </div>
        </div>
    )
}

export default RegisterPage