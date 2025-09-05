// hooks/useUserProfile.js
import { useState, useEffect } from "react";
import { supabase } from "../supabase/supabaseClient";

export const useUserProfile = (user) => {
  const [userData, setUserData] = useState({
    edad: "",
    sexo: "hombre",
    talla: "",
    peso: "",
    imcObjetivo: 22,
    diasActividad: 0,
    porcentajeCardio: 75,
    nivelCardio: "Moderado",
    objetivoPlan: "recomposicion",
    porcentajeObjetivo: 10,
    proteinas: "",
    carbohidratos: "",
    grasas: "",
  });

  const [loading, setLoading] = useState(true);

  // Cargar perfil del usuario
  useEffect(() => {
    if (user) {
      loadUserProfile();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        // PGRST116 es "no rows returned"
        console.error("Error loading profile:", error);
        return;
      }

      if (data) {
        // Mapear los nombres de campos de la base de datos al estado local
        setUserData({
          edad: data.edad || "",
          sexo: data.sexo || "hombre",
          talla: data.talla || "",
          peso: data.peso || "",
          imcObjetivo: data.imc_objetivo || 22,
          diasActividad: data.dias_actividad || 0,
          porcentajeCardio: data.porcentaje_cardio || 75,
          nivelCardio: data.nivel_cardio || "Moderado",
          objetivoPlan: data.objetivo_plan || "recomposicion",
          porcentajeObjetivo: data.porcentaje_objetivo || 10,
          proteinas: data.proteinas || "",
          carbohidratos: data.carbohidratos || "",
          grasas: data.grasas || "",
        });
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveUserProfile = async (field, value) => {
    if (!user) return;

    // Actualizar estado local primero
    setUserData((prev) => ({ ...prev, [field]: value }));

    // Mapear nombres de campos al formato de la base de datos
    const dbFieldMap = {
      imcObjetivo: "imc_objetivo",
      diasActividad: "dias_actividad",
      porcentajeCardio: "porcentaje_cardio",
      nivelCardio: "nivel_cardio",
      objetivoPlan: "objetivo_plan",
      porcentajeObjetivo: "porcentaje_objetivo",
    };

    const dbField = dbFieldMap[field] || field;
    const dbValue =
      typeof value === "string" && value !== ""
        ? isNaN(Number(value))
          ? value
          : Number(value)
        : value;

    try {
      // Verificar si el perfil ya existe
      const { data: existingProfile } = await supabase
        .from("user_profiles")
        .select("id")
        .eq("id", user.id)
        .single();

      if (existingProfile) {
        // Actualizar perfil existente
        const { error } = await supabase
          .from("user_profiles")
          .update({ [dbField]: dbValue })
          .eq("id", user.id);

        if (error) {
          console.error("Error updating profile:", error);
        }
      } else {
        // Crear nuevo perfil
        const profileData = {
          id: user.id,
          [dbField]: dbValue,
        };

        // Añadir campos básicos si no existen
        if (!profileData.sexo) profileData.sexo = "hombre";
        if (!profileData.imc_objetivo) profileData.imc_objetivo = 22;
        if (!profileData.dias_actividad) profileData.dias_actividad = 0;
        if (!profileData.porcentaje_cardio) profileData.porcentaje_cardio = 75;
        if (!profileData.nivel_cardio) profileData.nivel_cardio = "Moderado";
        if (!profileData.objetivo_plan)
          profileData.objetivo_plan = "recomposicion";
        if (!profileData.porcentaje_objetivo)
          profileData.porcentaje_objetivo = 10;

        const { error } = await supabase
          .from("user_profiles")
          .insert([profileData]);

        if (error) {
          console.error("Error creating profile:", error);
        }
      }
    } catch (error) {
      console.error("Error saving user profile:", error);
    }
  };

  const saveAllUserData = async (completeUserData) => {
    if (!user) return;

    try {
      // Mapear datos al formato de la base de datos
      const dbData = {
        id: user.id,
        edad: completeUserData.edad || null,
        sexo: completeUserData.sexo || "hombre",
        talla: completeUserData.talla || null,
        peso: completeUserData.peso || null,
        imc_objetivo: completeUserData.imcObjetivo || 22,
        dias_actividad: completeUserData.diasActividad || 0,
        porcentaje_cardio: completeUserData.porcentajeCardio || 75,
        nivel_cardio: completeUserData.nivelCardio || "Moderado",
        objetivo_plan: completeUserData.objetivoPlan || "recomposicion",
        porcentaje_objetivo: completeUserData.porcentajeObjetivo || 10,
        proteinas: completeUserData.proteinas || null,
        carbohidratos: completeUserData.carbohidratos || null,
        grasas: completeUserData.grasas || null,
      };

      // Verificar si el perfil ya existe
      const { data: existingProfile } = await supabase
        .from("user_profiles")
        .select("id")
        .eq("id", user.id)
        .single();

      if (existingProfile) {
        // Actualizar
        const { error } = await supabase
          .from("user_profiles")
          .update(dbData)
          .eq("id", user.id);

        if (error) {
          console.error("Error updating profile:", error);
        }
      } else {
        // Insertar
        const { error } = await supabase.from("user_profiles").insert([dbData]);

        if (error) {
          console.error("Error creating profile:", error);
        }
      }
    } catch (error) {
      console.error("Error saving all user data:", error);
    }
  };

  return {
    userData,
    loading,
    saveUserProfile,
    saveAllUserData,
    loadUserProfile,
  };
};
