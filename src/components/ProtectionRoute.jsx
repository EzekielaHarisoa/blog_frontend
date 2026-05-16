import  useAuthStore  from "../store/authstore";
import { Navigate } from "react-router-dom";

export default function ProtectionRoute({ children }) {

   const token = useAuthStore((state)=>state.token);

   if(!token){
       return <Navigate to="/login" replace />;
   }

   return children;
}

