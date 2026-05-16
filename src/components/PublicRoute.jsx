import { Navigate } from "react-router-dom";
import useAuthStore from "../store/authstore";

export default function PublicRoute({ children }) {
    const token = useAuthStore((state)=>state.token);
    
    if(token){
        return <Navigate to="/posts" replace />;
    }
    return children;
}