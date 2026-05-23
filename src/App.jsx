import { BrowserRouter, Routes, Route} from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Posts from "./pages/Posts";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectionRoute from "./components/ProtectionRoute";
import PublicRoute from "./components/PublicRoute";
import Profile from "./pages/Profile";
import SettingsProfile from "./pages/SettingsProfile";

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

      {/* SELF PROFILE */}
      <Route
        path="profile"
        element={
          <ProtectionRoute>
            <Profile />
          </ProtectionRoute>
        }
      />

      {/* OTHER PROFILE */}
      <Route
        path="profile/:id"
        element={
          <ProtectionRoute>
            <Profile />
          </ProtectionRoute>
        }
      />
      {/*PROFILE SETTING */}
      <Route
        path="/settings/profile"
        element={
          <ProtectionRoute>
            <SettingsProfile />
          </ProtectionRoute>
      }
/>

    </Route>

    {/* AUTH */}
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

  </Routes>
</BrowserRouter>
  );
}

export default App;