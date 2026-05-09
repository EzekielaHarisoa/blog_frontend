import './App.css'
import Posts from './pages/Posts'
import Login from './pages/Login'
import Register from './pages/Register'
import { BrowserRouter, Navigate , Routes , Route} from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
function App() {
  const token = localStorage.getItem("token");
  console.log("voicie mon token",token);
  
  
  return (
    
      <BrowserRouter>
         <Routes>
            {/**Dans le main */}
            <Route path='/' element={<MainLayout/>}>

               <Route path = "/posts" element ={token ? <Posts /> : <Navigate to="/login" />}/>

            </Route>

            {/**hors le main */}
            <Route path = "/register" element ={!token ? <Register /> : <Navigate to="/posts" />}/>
            <Route path = "/login" element ={!token ? <Login /> : <Navigate to="/posts" />}/>
            <Route path="*" element={<Navigate to={token ? "/posts" : "/login"} />} />   
        
         </Routes>
      </BrowserRouter>
  
  )
}

export default App
