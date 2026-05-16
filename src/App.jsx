import { BrowserRouter, Routes, Route} from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Posts from "./pages/Posts";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectionRoute from "./components/ProtectionRoute";
import PublicRoute from "./components/PublicRoute";
import Profile from "./pages/Profile";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        {/* Layout */}
        <Route path="/" element={<MainLayout />}>

          <Route
            path="posts"
            element={
              <ProtectionRoute>
                <Posts />
              </ProtectionRoute>
            }
          />

        </Route>

        {/* Auth pages */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        {/**profil page */}
        <Route
          path="/profile"
          element={
            <ProtectionRoute>
              <Profile />
            </ProtectionRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;