import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { forgotPasswordThunk } from '../Redux/Slices/authSlice';

function ForgotPassword() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);

    const [email, setEmail] = useState('');

    function handleEmailChange(e) {
        setEmail(e.target.value);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if(!email){
            toast.dismiss();
            toast.error("Please enter your email address");
        }

        const res = await dispatch(forgotPasswordThunk({email}));
        console.log(res);
        if(res?.payload?.statusCode == 200){
            setEmail("");
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
                <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-4">Forgot Password</h1>
                <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
                    Please provide your registered email, and we will send you a reset token.
                </p>
                <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter your registered email"
                        value={email}
                        onChange={handleEmailChange}
                        className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 text-gray-900 dark:text-white"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition duration-300 dark:bg-blue-500 dark:hover:bg-blue-600"
                    >
                        Send Reset Email
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

export default ForgotPassword;
