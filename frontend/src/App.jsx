import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Homepage from "./pages/Homepage";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "./authSlice";
import { useEffect, useState } from "react"; // ✅ Add useState
import AdminPanel from "./components/AdminPanel";
import ProblemPage from "./pages/ProblemPage";
import Admin from "./pages/Admin";
import AdminVideo from "./components/AdminVideo";
import AdminDelete from "./components/AdminDelete";
import AdminUpload from "./components/AdminUpload";
import Home from "./pages/Home";
import Contest from "./pages/Contest";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";
import Help from "./pages/Help";





function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);
  const [googleClientId, setGoogleClientId] = useState(null);
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {
   
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    // console.log("🔍 Google Client ID:", clientId); 
    
    if (clientId && clientId.includes('.apps.googleusercontent.com')) {
      setGoogleClientId(clientId);
    } else {
      console.error("❌ Invalid or missing Google Client ID");
    }
  }, []);

  // Check if current route is a problem page
  const isProblemPage = location.pathname.startsWith("/problem/");
  
  
  if (loading || !googleClientId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId}> 
      
      {!isProblemPage && <Navbar />}
      
      <div className={!isProblemPage ? "pt-8 min-h-screen" : ""}> 
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/help" element={<Help />} />

         
          <Route
            path="/problems"
            element={
              isAuthenticated ? <Homepage /> : <Navigate to="/login" replace />
            }
          />
           <Route
            path="/contest"
            element={
              isAuthenticated ? <Contest /> : <Navigate to="/login" replace />
            }
          />

          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
          />
          <Route
            path="/signup"
            element={isAuthenticated ? <Navigate to="/" replace /> : <Signup />}
          />

           <Route
            path="/profile"
            element={
              isAuthenticated ? <Profile /> : <Navigate to="/login" replace />
            }
          />

          {/* Admin routes */}
          <Route
            path="/admin"
            element={isAuthenticated && user?.role === "admin" ? <Admin /> : <Navigate to="/" replace />}
          />
          <Route
            path="/admin/create"
            element={isAuthenticated && user?.role === "admin" ? <AdminPanel /> : <Navigate to="/" replace />}
          />
          <Route
            path="/admin/delete"
            element={isAuthenticated && user?.role === "admin" ? <AdminDelete /> : <Navigate to="/" replace />}
          />
          <Route
            path="/admin/video"
            element={isAuthenticated && user?.role === "admin" ? <AdminVideo /> : <Navigate to="/" replace />}
          />
          <Route
            path="/admin/upload/:problemId"
            element={isAuthenticated && user?.role === "admin" ? <AdminUpload /> : <Navigate to="/" replace />}
          />

          <Route path="/problem/:problemId" element={<ProblemPage />} />
        </Routes>
      </div>
    </GoogleOAuthProvider>
  );
}
 
export default App;