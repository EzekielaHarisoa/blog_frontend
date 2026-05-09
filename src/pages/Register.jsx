import { useState } from "react";
import { register } from "../api/auth.api";
export default function Register(){
    const [name, setName]= useState("");
    const [email, setEmail]= useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading]= useState(false);
    const [error, setError] = useState(null);

    async function handleRegister(e){
        e.preventDefault();
        setError("");
        if(!name || !email | !password){
            setError("Tout les champs sont obligatoir")
            return;
        }

        try {
            setLoading(true);
            const data = await register({name,email,password});

            localStorage.setItem("token",data.token);

            alert("Inscription reussi");
            window.location.reload();
        } catch (error) {
            console.log(error)
            setError("Erreur  inscription")
            
        } finally{
            setLoading(false);
        }
    }

    return(
        <form onSubmit={handleRegister}>
            <h1>Register</h1>

            {error && (<p sttyle={{color:"red"}}> {error} </p>)}
            
            <div className="flex flex-col gap-3">
                <input 
                       className="input"
                       type="text" 
                       placeholder="name"
                       value={name}
                       onChange={(e)=> setName(e.target.value)}
                />
               <input 
                       className="input"
                       type="email" 
                       placeholder="name"
                       value={email}
                       onChange={(e)=> setEmail(e.target.value)}
                />
                <input 
                       className="input"
                       type="password" 
                       placeholder="name"
                       value={password}
                       onChange={(e)=> setPassword(e.target.value)}
                />       
                <button type="submit"
                        className="btn btn-succes"
                        disabled={loading}
                > {loading ? "loading... ": "Login"}  </button>
            </div>

        </form>
    )
}