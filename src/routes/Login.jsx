
import { useState } from 'react';
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock, FaPhone, FaDumbbell, FaGoogle } from 'react-icons/fa';

import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase/supabaseClient';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    password: ''
  });
  const [isRecovering, setIsRecovering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  const navigate = useNavigate();

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(''), 5000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Autenticación con Google
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });

      if (error) throw error;
    } catch (error) {
      showMessage(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Registro con email y password
  const handleSignUp = async (email, password, nombre, telefono) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nombre,
            telefono,
            full_name: nombre
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        showMessage('¡Cuenta creada! Revisa tu email para confirmar.', 'success');
        setIsLogin(true);
      }
    } catch (error) {
      showMessage(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Login con email y password
  const handleSignIn = async (email, password) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      showMessage('¡Sesión iniciada correctamente!', 'success');
      navigate('/');
    } catch (error) {
      showMessage(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Recuperación de contraseña
  const handlePasswordRecovery = async (email) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      showMessage('¡Enlace de recuperación enviado a tu email!', 'success');
      setIsRecovering(false);
    } catch (error) {
      showMessage(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isRecovering) {
      await handlePasswordRecovery(formData.correo);
      return;
    }

    if (isLogin) {
      await handleSignIn(formData.correo, formData.password);
    } else {
      if (!formData.nombre) {
        showMessage('Por favor ingresa tu nombre', 'error');
        return;
      }
      if (!formData.telefono) {
        showMessage('Por favor ingresa tu teléfono', 'error');
        return;
      }
      await handleSignUp(formData.correo, formData.password, formData.nombre, formData.telefono);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-cyan-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header con logo */}
        <div className="bg-gradient-to-r from-green-500 to-teal-500 p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-white p-3 rounded-full">
              <FaDumbbell className="text-green-600 text-2xl" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">NutriGym</h1>
          <p className="text-green-100 mt-2">
            {isRecovering 
              ? 'Recupera tu cuenta' 
              : (isLogin ? 'Inicia sesión en tu cuenta' : 'Crea tu cuenta')
            }
          </p>
        </div>

        {/* Mensajes de estado */}
        {message && (
          <div className={`p-4 mx-4 mt-4 rounded-lg ${
            messageType === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}>
            {message}
          </div>
        )}

        {/* Formulario */}
        <div className="p-6">
          {/* Botón de Google */}
          {!isRecovering && (
            <div className="mb-6">
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full bg-white border border-gray-300 text-gray-700 p-3 rounded-lg font-medium hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-3"
              >
                <FaGoogle className="text-red-500" />
                Continuar con Google
              </button>
              
              <div className="relative flex items-center my-6">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="flex-shrink mx-4 text-gray-500 text-sm">o</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {!isLogin && !isRecovering && (
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="nombre">
                  Nombre completo
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-gray-400" />
                  </div>
                  <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    placeholder="Tu nombre completo"
                    className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                </div>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="correo">
                Correo electrónico *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  id="correo"
                  name="correo"
                  type="email"
                  required
                  placeholder="tu.correo@ejemplo.com"
                  className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={formData.correo}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>
            </div>

            {!isRecovering && (
              <>
                {!isLogin && (
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="telefono">
                      Teléfono *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaPhone className="text-gray-400" />
                      </div>
                      <input
                        id="telefono"
                        name="telefono"
                        type="tel"
                        required
                        placeholder="+1 234 567 8900"
                        className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        value={formData.telefono}
                        onChange={handleInputChange}
                        disabled={loading}
                      />
                    </div>
                  </div>
                )}

                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">
                    Contraseña {isLogin ? '*' : ''}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required={isLogin}
                      placeholder={isLogin ? "Tu contraseña" : "Crea una contraseña segura"}
                      className="pl-10 pr-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      value={formData.password}
                      onChange={handleInputChange}
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
              </>
            )}

            {isLogin && !isRecovering && (
              <div className="flex justify-end mb-6">
                <button
                  type="button"
                  className="text-sm text-green-600 hover:text-green-800"
                  onClick={() => setIsRecovering(true)}
                  disabled={loading}
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white p-3 rounded-lg font-semibold hover:from-green-600 hover:to-teal-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Procesando...' : 
                (isRecovering 
                  ? 'Enviar enlace de recuperación' 
                  : (isLogin ? 'Iniciar sesión' : 'Crear cuenta')
                )
              }
            </button>
          </form>

          <div className="mt-6 text-center">
            {isRecovering ? (
              <button
                type="button"
                className="text-green-600 hover:text-green-800 font-medium"
                onClick={() => setIsRecovering(false)}
                disabled={loading}
              >
                Volver al inicio de sesión
              </button>
            ) : (
              <p className="text-gray-600">
                {isLogin ? '¿No tienes una cuenta? ' : '¿Ya tienes una cuenta? '}
                <button
                  type="button"
                  className="text-green-600 hover:text-green-800 font-medium"
                  onClick={() => setIsLogin(!isLogin)}
                  disabled={loading}
                >
                  {isLogin ? 'Regístrate ahora' : 'Inicia sesión'}
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-100 p-4 text-center">
          <p className="text-xs text-gray-600">
            Al {isLogin ? 'iniciar sesión' : 'registrarte'}, aceptas nuestros{' '}
            <a href="#" className="text-green-600 hover:underline">Términos de servicio</a> y{' '}
            <a href="#" className="text-green-600 hover:underline">Política de privacidad</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
