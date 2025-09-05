import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Home } from "./routes/Home";
import Login from "./routes/Login";
import UpdatePassword from "./routes/UpdatePassword";
import { useAuth } from "./hooks/useAuth";
import { useEffect, useState } from "react";

function App() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [isRecoveryFlow, setIsRecoveryFlow] = useState(false);

  // Detectar si estamos en un flujo de recuperación
  useEffect(() => {
    const hash = window.location.hash;
    if (
      hash.includes("type=recovery") &&
      location.pathname === "/update-password"
    ) {
      setIsRecoveryFlow(true);
    }
  }, [location]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <Routes>
        <Route
          path="/"
          element={
            user && !isRecoveryFlow ? (
              <Home />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/login"
          element={
            !user || isRecoveryFlow ? <Login /> : <Navigate to="/" replace />
          }
        />
        {/* Permite acceso a update-password incluso con usuario autenticado durante recuperación */}
        <Route
          path="/update-password"
          element={
            isRecoveryFlow ? (
              <UpdatePassword />
            ) : user ? (
              <Navigate to="/" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </DndProvider>
  );
}

export default App;
