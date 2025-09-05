// UpdatePassword.jsx - Versión mejorada
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase/supabaseClient";
import { FaLock, FaCheckCircle, FaEye, FaEyeSlash } from "react-icons/fa";

const UpdatePassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [isValidSession, setIsValidSession] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const processRecoveryToken = async () => {
      try {
        // Forzar el procesamiento del token de recuperación
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          showMessage("❌ Enlace inválido o expirado", "error");
          setTimeout(() => navigate("/login"), 3000);
          return;
        }

        if (session) {
          setIsValidSession(true);
          showMessage(
            "✅ Enlace válido. Puedes cambiar tu contraseña",
            "success"
          );
        } else {
          showMessage("❌ Enlace inválido o expirado", "error");
          setTimeout(() => navigate("/login"), 3000);
        }
      } catch (error) {
        showMessage("❌ Error procesando el enlace", "error");
        setTimeout(() => navigate("/login"), 3000);
      }
    };

    processRecoveryToken();
  }, [navigate]);

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(""), 5000);
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      showMessage("❌ Las contraseñas no coinciden", "error");
      return;
    }

    if (password.length < 6) {
      showMessage("❌ La contraseña debe tener al menos 6 caracteres", "error");
      return;
    }

    try {
      setLoading(true);

      // Actualizar la contraseña
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      showMessage(
        "✅ ¡Contraseña actualizada correctamente! Redirigiendo...",
        "success"
      );

      // Cerrar sesión y redirigir al login después de actualizar
      setTimeout(async () => {
        await supabase.auth.signOut();
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Error actualizando contraseña:", error);
      showMessage("❌ Error: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  if (!isValidSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-cyan-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando enlace de recuperación...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-cyan-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="text-center mb-6">
          <div className="bg-green-100 p-3 rounded-full inline-flex mb-4">
            <FaLock className="text-green-600 text-2xl" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Nueva Contraseña</h1>
          <p className="text-gray-600 mt-2">Crea una nueva contraseña segura</p>
        </div>

        {message && (
          <div
            className={`p-4 mb-4 rounded-lg ${
              messageType === "error"
                ? "bg-red-100 text-red-700 border border-red-200"
                : "bg-green-100 text-green-700 border border-green-200"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleUpdatePassword}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Nueva Contraseña *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="pl-10 pr-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
                minLength={6}
                disabled={loading}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? (
                  <FaEyeSlash className="text-gray-400" />
                ) : (
                  <FaEye className="text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Confirmar Contraseña *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaCheckCircle className="text-gray-400" />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repite tu contraseña"
                className="pl-10 pr-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
                minLength={6}
                disabled={loading}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={loading}
              >
                {showConfirmPassword ? (
                  <FaEyeSlash className="text-gray-400" />
                ) : (
                  <FaEye className="text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white p-3 rounded-lg font-semibold hover:from-green-600 hover:to-teal-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "🔄 Actualizando..." : "✅ Actualizar Contraseña"}
          </button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-700">
            💡 <strong>Importante:</strong> Este enlace expira en 24 horas. Si
            no funciona, solicita uno nuevo desde la página de login.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UpdatePassword;
