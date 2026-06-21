import { useDispatch } from "react-redux";
import { authenticateUser } from "../Redux/Slices/authSlice";


function DemoAccount(){
    
    const dispatch = useDispatch();

    const handleGuestSignIn = async() => {
        await dispatch(authenticateUser({
            loginInput : "anshuk",
            password : "AnshulSharma@123"
        }));

    };
    return(
        <>
            <button
                onClick={handleGuestSignIn}
                className="px-6 py-2 rounded-lg font-semibold shadow-md transition-colors duration-300 bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:bg-blue-700 dark:hover:bg-blue-800 dark:focus:ring-blue-500"
            >
                Sign in as a guest
            </button>
        </>
    )
}

export default DemoAccount;

