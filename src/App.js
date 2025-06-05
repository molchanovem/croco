import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Registration from "./pages/registration";
import Login from "./pages/avtorization";
import Lich from "./pages/lich";
import Konv from "./pages/konv";
import Admin from "./pages/admin"; 
import PrivateRoute from "./components/PrivateRoute"; 
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Редирект с "/" на "/login" */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<Login />} />

        <Route 
          path="/lich" 
          element={
            <PrivateRoute>
              <Lich />
            </PrivateRoute>
          } 
        />

        <Route 
          path="/konv" 
          element={
            <PrivateRoute>
              <Konv />
            </PrivateRoute>
          } 
        />

        <Route 
          path="/admin" 
          element={
            <PrivateRoute requiredRole="admin"> 
              <Admin />
            </PrivateRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
