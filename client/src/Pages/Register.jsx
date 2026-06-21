import React, { useEffect, useState } from 'react';
import { LuUser2 } from "react-icons/lu";
import { Link, useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { isEmail, isPassword } from "../Helpers/regexMatcher.js";
import { createUserAccount } from '../Redux/Slices/authSlice.js';
import { CgSpinnerTwo } from 'react-icons/cg';
import DemoAccount from '../Components/DemoAccount.jsx';

function Register() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);
    const [avatarUrl, setAvatarUrl] = useState();
    const [ isRegisteringUser, setIsRegisteringUser ] = useState(false);
    
    const [userData, setUserData] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
        avatar: null,
    });

    function handleAvatarUpload(e) {
        const uploadedImage = e.target.files[0];
        if (uploadedImage) {
            setUserData({ ...userData, avatar: uploadedImage });
            const fileReader = new FileReader();
            fileReader.readAsDataURL(uploadedImage);
            fileReader.addEventListener("load", function () {
                setAvatarUrl(this.result);
            });
        }
    }

    async function handleFormSubmit(e) {
        toast.dismiss();
        e.preventDefault();
        const { username, name, email, password, avatar } = userData;
        
        if (!username || !name || !email || !password || !avatar) {
            toast.error("All fields including avatar are required!");
            return;
        }
        if (username.length < 5) {
            toast.error("Username should be at least 5 characters long.");
            return;
        }
        if (!isEmail(email)) {
            toast.error("Invalid Email format.");
            return;
        }
        if (!isPassword(password)) {
            toast.error("Password should be at least 8 characters long with a number and special character.");
            return;
        }

        const formData = new FormData();
        Object.keys(userData).forEach(key => {
            formData.append(key, userData[key]);
        });

        setIsRegisteringUser(true);
        
        const response = await dispatch(createUserAccount(formData));
        if (response?.payload?.statusCode === 201) {
            toast.success("Account created successfully!");
            navigate("/");
        }
        setIsRegisteringUser(false);
    }

    function handleStateChange(e) {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    }

    useEffect(() => {
        if (isLoggedIn) {
            navigate("/");
        }
    }, [isLoggedIn, navigate]);

    return (
        <main className='flex flex-col justify-center items-center h-screen bg-gray-100 dark:bg-gray-900'>
            <section className='border-2 border-solid border-gray-300 dark:border-gray-700 flex flex-col justify-center items-center rounded-xl gap-4 shadow-lg p-6 bg-white dark:bg-gray-800 w-full max-w-md sm:max-w-lg'>
                <h1 className='text-center text-blue-600 dark:text-blue-400 font-bold text-4xl uppercase mb-4'>Register</h1>
                <form noValidate onSubmit={handleFormSubmit} className='w-full flex flex-col items-center'>
                    <label htmlFor="imgUpload" className='flex flex-col items-center mb-4'>
                        {avatarUrl ? 
                            <img src={avatarUrl} className='w-36 h-36 rounded-full object-cover' alt="avatar" /> 
                            : 
                            <LuUser2 className='text-[100px] rounded-full border-4 p-2 border-blue-600 bg-gray-200 dark:bg-gray-600' />
                        }
                        <input 
                            type="file"
                            name="avatar"
                            id="imgUpload"
                            hidden
                            onChange={handleAvatarUpload}
                        />
                    </label>

                    <div className='flex flex-wrap justify-between w-full gap-4 mb-4'>
                        <div className='flex flex-col flex-1'>
                            <label htmlFor="name" className='text-left dark:text-gray-300'>Name</label>
                            <input 
                                type="text"
                                name="name"
                                placeholder='Enter your name'
                                value={userData.name}
                                onChange={handleStateChange}
                                className='border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200'
                                required
                            />
                        </div>
                        <div className='flex flex-col flex-1'>
                            <label htmlFor="username" className='text-left dark:text-gray-300'>Username</label>
                            <input 
                                type="text"
                                name="username"
                                placeholder='Enter your username'
                                value={userData.username}
                                onChange={handleStateChange}
                                className='border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200'
                                required
                            />
                        </div>
                    </div>

                    <div className='flex flex-wrap justify-between w-full gap-4 mb-4'>
                        <div className='flex flex-col flex-1'>
                            <label htmlFor="email" className='text-left dark:text-gray-300'>Email</label>
                            <input 
                                type="email"
                                name="email"
                                value={userData.email}
                                placeholder='Enter your email'
                                onChange={handleStateChange}
                                className='border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200'
                                required
                            />
                        </div>
                        <div className='flex flex-col flex-1'>
                            <label htmlFor="password" className='text-left dark:text-gray-300'>Password</label>
                            <input 
                                type="password"
                                name="password"
                                value={userData.password}
                                placeholder='Enter a password'
                                onChange={handleStateChange}
                                className='border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200'
                                required
                            />
                        </div>
                    </div>

                    <button 
                        type="submit"
                        className='mt-4 bg-blue-600 text-white font-bold px-8 py-4 text-xl rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition duration-300 flex flex-row justify-center gap-4 items-center disabled:cursor-not-allowed disabled:bg-gray-600'
                        disabled={isRegisteringUser}
                    >
                        {
                            isRegisteringUser && <CgSpinnerTwo className='animate-spin'/>
                        }
                        Register
                    </button>
                </form>
                <div className='mt-4'>
                    <p className='text-gray-600 dark:text-gray-400'>Already have an account? <Link to="/auth/login" className='text-blue-900 dark:text-blue-400 font-bold'>Login</Link></p>
                </div>
                <DemoAccount/>
            </section>
        </main>
    );
}

export default Register;
