import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";


function RequireAuth({ allowedRoles }){
    const { isLoggedIn, userRole } = useSelector((state) => state?.auth);
    
    if(!isLoggedIn){
        window.alert("You have to log in first");
        // toast.error("You Have to Log In first");
        return <Navigate to="/auth/login" />
    }
    
    if(allowedRoles.includes(userRole)){
        return <Outlet/>;
    }else{
        return <Navigate to="/denied" />
    }
}

export default RequireAuth;

