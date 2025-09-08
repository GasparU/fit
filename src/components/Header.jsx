

import { FaUser, FaSignOutAlt, FaDumbbell } from 'react-icons/fa';
import { useNavigate, Link, useLocation } from "react-router-dom";
import { supabase } from '../supabase/supabaseClient';
import { Buttons } from '../routes/Elements/Buttons';

// Cambia a export default
const Header = ({ user }) => {
  // Función para determinar si un enlace está activo
  const isActive = (path) => {
    return location.pathname === path;
  };
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error.message);
    }
  };

  return (
    <header className="bg-gradient-to-r from-green-500 to-teal-500 shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">

          <Buttons/>
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <FaDumbbell className="text-white text-2xl" />
            <h1 className="text-white text-xl font-bold">NutriGym</h1>
          </div>

          {/* User Menu */}
          {user && (
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2">
                <FaUser className="text-white" />
                <span className="text-white text-sm">
                  {user.email || user.user_metadata?.full_name}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all duration-300 group"
                title="Cerrar sesión"
              >
                <FaSignOutAlt className="group-hover:animate-pulse" />
                <span className="hidden sm:block">Cerrar sesión</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

// AÑADE ESTA LÍNEA AL FINAL
export default Header;
