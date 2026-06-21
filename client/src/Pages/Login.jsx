import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { isEmail, isPassword } from "../Helpers/regexMatcher.js";
import { authenticateUser } from '../Redux/Slices/authSlice.js';
import { CgSpinnerTwo } from "react-icons/cg";
import DemoAccount from '../Components/DemoAccount.jsx';

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [ isCheckingUser, setIsCheckingUser ] = useState(false);

    const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);

    const [loginData, setLoginData] = useState({
        loginInput: "",
        password: ""
    });

    async function handleFormSubmit(e) {
        e.preventDefault();
        const { loginInput, password } = loginData;

        if (!loginInput || !password) {
            toast.dismiss();
            toast.error("Both fields are required !!");
            return;
        }

        const isValidEmail = isEmail(loginInput);
        if (!isValidEmail && loginInput.length < 5) {
            toast.dismiss();
            toast.error("Invalid username or email");
            return;
        }
        setIsCheckingUser(true);


        const response = await dispatch(authenticateUser({ loginInput, password }));

        if (response?.payload?.statusCode === 200) {
            navigate("/");
            setLoginData({
                loginInput: "",
                password: ""
            });
            setIsCheckingUser(false);
        }

        setIsCheckingUser(false);
    }

    function handleStateChange(e) {
        const { name, value } = e.target;
        setLoginData({
            ...loginData,
            [name]: value
        });
    }

    useEffect(() => {
        if (isLoggedIn) {
            navigate("/"); 
        }
    }, [isLoggedIn, navigate]);

    return (
        <main className='flex flex-col justify-center items-center min-h-screen bg-gradient-to-r from-blue-100 to-gray-100 dark:from-gray-800 dark:to-gray-900'>
            <section className='border-2 border-solid border-gray-300 dark:border-gray-700 flex flex-col justify-center items-center rounded-xl gap-4 shadow-lg p-8 bg-white dark:bg-gray-800 w-full max-w-md sm:w-96'>
                <h1 className='text-center text-blue-600 dark:text-blue-400 font-bold text-4xl uppercase mb-4'>Login</h1>
                <form noValidate onSubmit={handleFormSubmit} className='w-full flex flex-col items-center'>
                    <div className='flex flex-wrap justify-between w-full gap-4 mb-4'>
                        <div className='flex flex-col flex-1'>
                            <label htmlFor="loginInput" className='text-left font-semibold text-gray-800 dark:text-gray-200'>Username or Email</label>
                            <input 
                                type="text"
                                name="loginInput"
                                placeholder='Enter your username or email'
                                value={loginData.loginInput}
                                onChange={handleStateChange}
                                className='border border-gray-300 dark:border-gray-600 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white'
                                required
                            />
                        </div>
                    </div>

                    <div className='flex flex-wrap justify-between w-full gap-4 mb-4'>
                        <div className='flex flex-col flex-1'>
                            <label htmlFor="password" className='text-left font-semibold text-gray-800 dark:text-gray-200'>Password</label>
                            <input 
                                type="password"
                                name="password"
                                placeholder='Enter your password'
                                value={loginData.password}
                                onChange={handleStateChange}
                                className='border border-gray-300 dark:border-gray-600 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white'
                                required
                            />
                        </div>
                    </div>

                    <button 
                        type="submit"
                        className='mt-4 bg-blue-600 dark:bg-blue-500 text-white font-bold px-8 py-4 text-xl rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition duration-300 w-full flex flex-row justify-center gap-4 items-center disabled:cursor-not-allowed disabled:bg-gray-600 '
                        disabled={isCheckingUser}
                    >
                        {
                            isCheckingUser && (<CgSpinnerTwo className='animate-spin text-white' />)
                        }
                        Login
                    </button>
                </form>
                <div className='mt-4 text-center'>
                    <p className='text-gray-600 dark:text-gray-300'>Don't have an account? <Link to="/auth/register" className='text-blue-900 dark:text-blue-400 font-bold'>Register</Link></p>
                    <p className='text-gray-600 dark:text-gray-300'>Forgot Password? <Link to="/auth/forgot-password" className='text-blue-900 dark:text-blue-400 font-bold'>Click Here</Link></p>
                </div>
                <DemoAccount/>
            </section>
        </main>
    );
}

export default Login;
