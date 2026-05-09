export default function ProtectionRoute({ children }) {
 const token = localStorage.getItem("token");

 if(!token){
    return <p>Access denied</p>
 }

 return children;
}