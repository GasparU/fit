// routes/Elements/Buttons.jsx
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export const Buttons = ({
  fontSize,
  handleUserDataChange,
  userData,
  setFontSize,
}) => {
  const { signOut, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const success = await signOut();
      if (success) {
        // Redirigir al login después de cerrar sesión exitosamente
        navigate("/login");
      } else {
        // Si no había sesión pero queremos redirigir de todos modos
        navigate("/login");
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error.message);

      // Aún así redirigir al login en caso de error
      navigate("/login");
    }
  };

  return (
    <div className="flex justify-between items-center mb-4 p-4 bg-white rounded-lg shadow">
      <div className="flex space-x-2">
        <button
          onClick={() => setFontSize((prev) => Math.max(12, prev - 1))}
          className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm"
        >
          A-
        </button>
        <button
          onClick={() => setFontSize((prev) => Math.min(18, prev + 1))}
          className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm"
        >
          A+
        </button>
        {/* <button
          onClick={() => handleUserDataChange("reset", true)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
        >
          Reiniciar
        </button> */}
      </div>

      {/* Botón de cerrar sesión */}
      {/* <button
        onClick={handleLogout}
        disabled={loading}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Cerrando..." : "Cerrar sesión"}
      </button> */}
    </div>
  );
};
