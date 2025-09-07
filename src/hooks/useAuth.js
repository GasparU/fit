// src/hooks/useAuth.js
import { useState, useEffect } from "react";
import { supabase } from "../supabase/supabaseClient";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtener sesión activa
    const getSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error) {
          console.error("Error obteniendo sesión:", error.message);
          return;
        }
        setUser(session?.user ?? null);
      } catch (error) {
        console.error("Error inesperado al obtener sesión:", error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Escuchar cambios en la autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Función para cerrar sesión
  const signOut = async () => {
    try {
      setLoading(true);

      // Verificar si hay una sesión activa primero
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        console.log("No hay sesión activa para cerrar");
        return true; // Indicar que no había sesión pero no es un error
      }

      const { error } = await supabase.auth.signOut();
      if (error) {
        // Si el error es específico de sesión missing, lo manejamos
        if (
          error.message.includes("session") ||
          error.message.includes("Auth session missing")
        ) {
          console.log("La sesión ya no existe, limpiando estado local");
          setUser(null);
          return true;
        }
        throw error;
      }

      console.log("Sesión cerrada exitosamente");
      return true;
    } catch (error) {
      console.error("Error al cerrar sesión:", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, signOut };
};
