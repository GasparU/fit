// components/Navbar.jsx
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
  FaDumbbell,
  FaBars,
  FaTimes,
  FaHome,
  FaCalculator,
} from "react-icons/fa";
import { useState, useRef, useEffect } from "react";

export const Navbar = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);

  // Función para determinar si un enlace está activo
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Función para manejar el cierre de sesión
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/login");
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error("Error al cerrar sesión:", error.message);
    }
  };

  // Función para toggle del menú móvil
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 bg-gradient-to-r from-green-500 to-teal-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo y enlaces de navegación */}
          <div className="flex items-center">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <FaDumbbell className="text-white text-2xl" />
              <h1 className="text-white text-xl font-bold">NutriGym</h1>
            </div>

            {/* Enlaces de navegación - Desktop */}
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <Link
                to="/"
                className={`inline-flex items-center px-3 py-2 text-xl font-medium ${
                  isActive("/")
                    ? "text-white border-b-2 border-white"
                    : "text-gray-100 hover:text-white"
                }`}
              >
                Inicio
              </Link>
              <Link
                to="/calculos"
                className={`inline-flex items-center px-3 py-2 text-xl font-medium ${
                  isActive("/calculos")
                    ? "text-white border-b-2 border-white"
                    : "text-gray-100 hover:text-white"
                }`}
              >
                Cálculos
              </Link>
            </div>
          </div>

          {/* Información del usuario y botón de cerrar sesión - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {user && (
              <>
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center">
                    <span className="text-sm font-medium text-green-600">
                      {user.email ? user.email.charAt(0).toUpperCase() : "U"}
                    </span>
                  </div>
                  <span className="hidden lg:block text-sm text-white">
                    {user.email}
                  </span>
                </div>

                <button
                  onClick={handleSignOut}
                  disabled={loading}
                  className="bg-white hover:bg-gray-100 text-green-600 px-4 py-2 rounded-md text-sm font-medium transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Cerrando..." : "Cerrar sesión"}
                </button>
              </>
            )}
          </div>

          {/* Botón de menú hamburguesa - Mobile */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="text-white p-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-white"
            >
              {isMobileMenuOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil compacto */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          {/* Overlay semitransparente */}
          <div
            className="fixed inset-0 bg-black bg-opacity-30 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>

          {/* Contenido del menú móvil - Compacto */}
          <div
            ref={mobileMenuRef}
            className="fixed top-16 right-4 bg-white rounded-lg shadow-xl z-50 w-64 transform transition-all duration-200 ease-out"
          >
            <div className="p-3">
              {/* Enlaces del menú */}
              <div className="space-y-2">
                <Link
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive("/")
                      ? "bg-green-100 text-green-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <FaHome className="mr-2 text-lg" />
                  Inicio
                </Link>

                <Link
                  to="/calculos"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive("/calculos")
                      ? "bg-green-100 text-green-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <FaCalculator className="mr-2 text-lg" />
                  Cálculos
                </Link>
              </div>

              {/* Información del usuario */}
              {user && (
                <div className="mt-4 pt-3 border-t border-gray-200">
                  <div className="flex items-center px-3 py-2">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-green-600">
                        {user.email ? user.email.charAt(0).toUpperCase() : "U"}
                      </span>
                    </div>
                    <div className="ml-3 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleSignOut}
                    disabled={loading}
                    className={`w-full mt-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      loading
                        ? "bg-gray-100 text-gray-400"
                        : "bg-red-50 text-red-700 hover:bg-red-100"
                    }`}
                  >
                    {loading ? "Cerrando..." : "Cerrar sesión"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
