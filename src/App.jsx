import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Posts from "./pages/Posts";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>
        {/* Layout */}
        <Route path="/" element={<MainLayout />}>

          <Route
            path="posts"
            element={token ? <Posts /> : <Navigate to="/login" />}
          />

        </Route>

        {/* Auth pages */}
        <Route
          path="/login"
          element={!token ? <Login /> : <Navigate to="/posts" />}
        />

        <Route
          path="/register"
          element={!token ? <Register /> : <Navigate to="/posts" />}
        />

        {/* fallback */}
        <Route
          path="*"
          element={<Navigate to={token ? "/posts" : "/login"} />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;