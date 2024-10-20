import { Navigate, Route, Routes } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import { SignIn } from "./Pages/auth";
import ProtectedRoute from "./layouts/ProtectedRoute";
function App() {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      {/* <Route path="*" element={<Navigate to="/dashboard/home" replace />} /> */}
    </Routes>
  );
}

export default App;
