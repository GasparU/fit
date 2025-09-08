// Home.jsx
import { useEffect, useState } from "react";
import { Resultados } from "../components/Resultados";
import { BusquedaComida } from "../components/BusquedaComida";
import { ResumenNutricional } from "../components/ResumenNutricional";
import { useCalculosNutricionales } from "../hooks/useCalculosNutricionales";
import { useCalculosCardio } from "../hooks/useCalculosCardio";
import { Buttons } from "./Elements/Buttons";
import { DatosUser } from "./Elements/DatosUser";
import { ActividadUser } from "./Elements/ActividadUser";
import { ImcUser } from "./Elements/ImcUser";
import { FrecuenciaCardiacaUser } from "./Elements/FrecuenciaCardiacaUser";
import { ObjetivosPlanUser } from "./Elements/ObjetivosPlanUser";
import { DistribucionMacronutrientes } from "./Elements/DistribucionMacronutrientes";
import { useDynamicStyles } from './../hooks/useDynamicStyles';
import { useAuth } from "../hooks/useAuth";
import { useUserProfile } from "../hooks/useUserProfile";


export const Home = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroSaciedad, setFiltroSaciedad] = useState("");
  const [filtroGlucemia, setFiltroGlucemia] = useState("");
  const [fontSize, setFontSize] = useState(14);

  // Usar el hook de perfil de usuario
  const {
    userData,
    selectedFoods,
    setSelectedFoods,
    loading,
    saveUserProfile,
    saveAllUserData,
    saveSelectedFood,
    removeSelectedFood,
    updateFoodQuantity,
    loadSelectedFoods,
  } = useUserProfile(user);

  // Reemplazar las funciones locales
 const handleFoodSelect = async (food) => {
   const foodWithDefaults = {
     ...food,
     id: food.CODIGO || food.id || food.nombre_alimento || `food_${Date.now()}`,
     name: food.nombre_alimento || food.name || "Alimento sin nombre",
     cantidad: 100,
     proteinas: food.proteinas || 0,
     carbohidratos: food.carbohidratos_tot || food.carbohidratos || 0,
     grasas: food.grasa || food.grasas || 0,
     calorias: food.energia || food.calorias || 0,
   };

   await saveSelectedFood(foodWithDefaults);
   await loadSelectedFoods();
   setSearchTerm("");
 };

  const {
    imcResult,
    tmbResult,
    energiaTotalResult,
    tdeeResult,
    aguaResult,
    grasaCorporalResult,
  } = useCalculosNutricionales(userData);

  const { cardioResult, objetivoResult } = useCalculosCardio(
    userData,
    energiaTotalResult
  );

  // Agregar este useEffect para cargar las comidas al iniciar
  useEffect(() => {
    if (user && !loading) {
      loadSelectedFoods();
    }
  }, [user, loading, loadSelectedFoods]);

  const handleCantidadChange = async (index, cantidad) => {
    const newFoods = selectedFoods.map((food, i) =>
      i === index ? { ...food, cantidad: Math.max(1, cantidad) } : food
    );
    setSelectedFoods(newFoods);

    // Guardar en Supabase
    const food = selectedFoods[index];
    const foodUUID =
      food.food_id || food.CODIGO || food.id || food.nombre_alimento;
    await updateFoodQuantity(food.id, cantidad);
  };

  const handleRemoveFood = async (index) => {
    const foodToRemove = selectedFoods[index];

    // Usar el ID único de la base de datos (debería ser 'id' en user_selected_foods)
    const foodUUID = foodToRemove.id; 
    if (!foodUUID) {
      console.error("No se pudo encontrar el ID del alimento para eliminar");
      return;
    }

    // Eliminar de Supabase primero
    await removeSelectedFood(foodUUID);

    // Luego actualizar el estado local
    const newFoods = selectedFoods.filter((_, i) => i !== index);
    setSelectedFoods(newFoods);
  };

  const handleUserDataChange = async (field, value) => {
    const newUserData = { ...userData, [field]: value };
    await saveUserProfile(field, value);
  };

  // Guardar todos los datos periódicamente o cuando sea necesario
  useEffect(() => {
    const saveData = async () => {
      if (user) {
        await saveAllUserData(userData);
      }
    };

    // Guardar cada 30 segundos cuando hay cambios
    const timer = setTimeout(saveData, 30000);
    return () => clearTimeout(timer);
  }, [userData, user, saveAllUserData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando tu perfil...</p>
        </div>
      </div>
    );
  }

  // Función para calcular los rangos de macronutrientes según el objetivo
  const getMacroRanges = () => {
    switch (userData.objetivoPlan) {
      case "deficit":
        return {
          proteinas: { min: 1.6, max: 2.5, porcentaje: "20-30%" },
          carbohidratos: { min: 3, max: 5, porcentaje: "40-50%" },
          grasas: { min: 0.2, max: 0.5, porcentaje: "20-30%" },
        };
      case "recomposicion":
        return {
          proteinas: { min: 1.8, max: 2.5, porcentaje: "25-30%" },
          carbohidratos: { min: 2.5, max: 4.3, porcentaje: "40-50%" },
          grasas: { min: 0.5, max: 0.8, porcentaje: "15-25%" },
        };
      case "aumento":
        return {
          proteinas: { min: 1.5, max: 2.4, porcentaje: "20-30%" },
          carbohidratos: { min: 4, max: 7, porcentaje: "45-55%" },
          grasas: { min: 0.5, max: 0.5, porcentaje: "20-30%" },
        };
      default:
        return {
          proteinas: { min: 1.6, max: 2.5, porcentaje: "20-30%" },
          carbohidratos: { min: 3, max: 5, porcentaje: "40-50%" },
          grasas: { min: 0.2, max: 0.5, porcentaje: "20-30%" },
        };
    }
  };

  // Estilos dinámicos para todas las columnas
  const { textStyle, titleStyle, numberStyle, smallTextStyle } =
    useDynamicStyles(fontSize);

  // Títulos de las columnas
  const columnTitles = {
    resultados: "Resultados",
    busqueda: "Búsqueda de Alimentos",
    resumen: "Resumen Nutricional",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-cyan-50 p-2 md:p-4">
      
      <Buttons
        fontSize={fontSize}
        setFontSize={setFontSize}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {/* Columna 1: Datos del usuario */}
        <div className="bg-white rounded-lg shadow p-3 md:p-4 flex flex-col">
          <h2 className="font-semibold mb-2 text-gray-700" style={titleStyle}>
            Datos del Usuario
          </h2>

          <div className="space-y-2 flex-grow overflow-y-auto">
            <DatosUser
              userData={userData}
              fontSize={fontSize}
              handleUserDataChange={handleUserDataChange}
            />

            <ActividadUser
              userData={userData}
              handleUserDataChange={handleUserDataChange}
              fontSize={fontSize}
              textStyle={textStyle}
              smallTextStyle={smallTextStyle}
            />

            <ImcUser
              userData={userData}
              smallTextStyle={smallTextStyle}
              imcResult={imcResult}
              textStyle={textStyle}
              handleUserDataChange={handleUserDataChange}
            />

            <FrecuenciaCardiacaUser
              handleUserDataChange={handleUserDataChange}
              userData={userData}
              textStyle={textStyle}
            />

            <ObjetivosPlanUser
              textStyle={textStyle}
              handleUserDataChange={handleUserDataChange}
              userData={userData}
              smallTextStyle={smallTextStyle}
            />

            <DistribucionMacronutrientes
              getMacroRanges={getMacroRanges}
              textStyle={textStyle}
              userData={userData}
              handleUserDataChange={handleUserDataChange}
              smallTextStyle={smallTextStyle}
            />
          </div>
        </div>

        {/* Columna 2: Resultados */}
        <div className="bg-white rounded-lg shadow p-3 md:p-4">
          <Resultados
            imcResult={imcResult}
            tmbResult={tmbResult}
            tdeeResult={tdeeResult}
            objetivoResult={objetivoResult}
            energiaTotalResult={energiaTotalResult}
            aguaResult={aguaResult}
            grasaCorporalResult={grasaCorporalResult}
            cardioResult={cardioResult}
            userData={userData}
            fontSize={fontSize}
          />
        </div>

        {/* Columna 3: Búsqueda de alimentos */}
        <div className="bg-white rounded-lg shadow p-3 md:p-4">
          <BusquedaComida
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedFoods={selectedFoods}
            setSelectedFoods={setSelectedFoods}
            filtroSaciedad={filtroSaciedad}
            setFiltroSaciedad={setFiltroSaciedad}
            filtroGlucemia={filtroGlucemia}
            setFiltroGlucemia={setFiltroGlucemia}
            fontSize={fontSize}
            onRemoveFood={handleRemoveFood}
            onUpdateQuantity={handleCantidadChange}
            onFoodSelect={handleFoodSelect}
          />
        </div>

        {/* Columna 4: Resumen nutricional */}
        <div className="bg-white rounded-lg shadow p-3 md:p-4">
          <ResumenNutricional
            selectedFoods={selectedFoods}
            userData={userData}
            grasaCorporalResult={grasaCorporalResult}
            fontSize={fontSize}
            energiaTotalResult={energiaTotalResult}
            objetivoResult={objetivoResult}
            numberStyle={numberStyle}
          />
        </div>
      </div>
    </div>
  );
};
