// hooks/useUserProfile.js
import { useState, useEffect } from "react";
import { supabase } from "../supabase/supabaseClient";

export const useUserProfile = (user) => {
  const [loading, setLoading] = useState(true);
  const [selectedFoods, setSelectedFoods] = useState([]);
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

  // Cargar comidas seleccionadas
  const loadSelectedFoods = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("user_selected_foods")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error loading selected foods:", error);
        return;
      }

      if (data) {
        // Mapear correctamente los campos de la base de datos
        const mappedFoods = data.map((item) => ({
          ...item,
          id: item.id, // Asegurar que el ID único de la base de datos se incluya
          nombre_alimento: item.food_name,
          energia: item.calorias,
          proteinas: item.proteinas,
          grasa: item.grasas,
          carbohidratos_tot: item.carbohidratos,
          saciedad: item.saciedad,
          glucemia: item.glucemia,
          cantidad: item.cantidad || 100,
        }));
        setSelectedFoods(mappedFoods);
      }
    } catch (error) {
      console.error("Error loading selected foods:", error);
    }
  };

  // Guardar comida seleccionada
  const saveSelectedFood = async (food) => {
    if (!user) return;

    try {
      const foodUUID =
        food.CODIGO || food.id || food.nombre_alimento || Date.now().toString();
      const foodName =
        food.nombre_alimento || food.name || "Alimento sin nombre";

      // Asegurar que todos los campos tengan valores
      const { error } = await supabase.from("user_selected_foods").upsert({
        user_id: user.id,
        food_id: foodUUID,
        food_name: foodName,
        cantidad: food.cantidad || 100,
        proteinas: food.proteinas || 0,
        carbohidratos: food.carbohidratos_tot || food.carbohidratos || 0,
        grasas: food.grasa || food.grasas || 0,
        calorias: food.energia || food.calorias || 0, // ← Aquí está el problema
        saciedad: food.saciedad || "",
        glucemia: food.glucemia || "",
        updated_at: new Date().toISOString(),
      });

      if (error) {
        console.error("Error saving selected food:", error);
        return;
      }

      // Recargar los alimentos después de guardar
      await loadSelectedFoods();
    } catch (error) {
      console.error("Error saving selected food:", error);
    }
  };

  // Eliminar comida seleccionada
const removeSelectedFood = async (foodUUID) => {
  if (!user) return;

  try {
    const { error } = await supabase
      .from("user_selected_foods")
      .delete()
      .eq("id", foodUUID)
      .eq("user_id", user.id);
    // .eq("id", foodId);

    if (error) {
      console.error("Error removing selected food:", error);
    } else {
      // Recargar los alimentos después de eliminar
      await loadSelectedFoods();
    }
  } catch (error) {
    console.error("Error removing selected food:", error);
  }
};

  // Actualizar cantidad de comida
  const updateFoodQuantity = async (foodUUID, cantidad) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("user_selected_foods")
        .update({
          cantidad: cantidad,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id)
        .eq("food_id", foodUUID); // Asegúrate de que sea food_id

      if (error) {
        console.error("Error updating food quantity:", error);
      }
    } catch (error) {
      console.error("Error updating food quantity:", error);
    }
  };

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
    selectedFoods,
    setSelectedFoods,
    loading,
    saveUserProfile,
    saveAllUserData,
    loadUserProfile,
    saveSelectedFood,
    removeSelectedFood,
    updateFoodQuantity,
    loadSelectedFoods,
  };
};
