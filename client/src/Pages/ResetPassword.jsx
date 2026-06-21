import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { isPassword } from '../Helpers/regexMatcher.js'; 
import { useDispatch, useSelector } from 'react-redux';
import { resetPasswordThunk } from '../Redux/Slices/authSlice.js';

function ResetPassword() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { resetToken } = useParams();

    const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);

    // console.log("Reset-Token : ", resetToken);

    const [passwordData, setPasswordData] = useState({
        newPassword: '',
        confirmPassword: ''
    });

    function handleInputChange(e) {
        const { name, value } = e.target;
        setPasswordData({
            ...passwordData,
            [name]: value
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        
        const { newPassword, confirmPassword } = passwordData;

        if (!newPassword || !confirmPassword) {
            toast.dismiss();
            toast.error("Both fields are required.");
            return;
        }

        if (!isPassword(newPassword)) {
            toast.dismiss();
            toast.error("Password should be at least 8 characters long, include a number and a special character.");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.dismiss();
            toast.error("Passwords do not match.");
            return;
        }

        
        const res = await dispatch(resetPasswordThunk({resetToken, password : newPassword}));
        // console.log("Reset-Password-JSX : ", res);
        if(res?.payload?.statusCode === 200){
            setPasswordData({
                newPassword : "",
                confirmPassword : ""
            })
            navigate("/auth/login");
        }
        
    }

    useEffect(() => {
        if (isLoggedIn) {
            navigate("/");
        }
    }, [isLoggedIn, navigate]);

    return (
        <main className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <section className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 md:p-8 max-w-lg w-full">
                <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-4">Reset Password</h1>
                <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
                    Please enter your new password below.
                </p>
                <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
                    <input
                        type="password"
                        name="newPassword"
                        placeholder="Enter your new password"
                        value={passwordData.newPassword}
                        onChange={handleInputChange}
                        className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 text-gray-900 dark:text-white"
                        required
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm your new password"
                        value={passwordData.confirmPassword}
                        onChange={handleInputChange}
                        className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 text-gray-900 dark:text-white"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition duration-300 dark:bg-blue-500 dark:hover:bg-blue-600"
                    >
                        Reset Password
                    </button>
                </form>
                <button
                    type="submit"
                    className="w-full px-4 mt-2 py-3 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-700 transition duration-300 dark:bg-gray-500 dark:hover:bg-gray-600"
                    onClick={() => navigate(-1)}
                >
                    Go Back
                </button>
            </section>
        </main>
    );
}

export default ResetPassword;
