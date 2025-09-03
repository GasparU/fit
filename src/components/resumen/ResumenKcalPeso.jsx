
import {useMemo} from 'react';

export const ResumenKcalPeso = ({
  selectedFoods,
  grasaCorporalResult,
  fontSize,
  userData,
  energiaTotalResult, // Necesitamos pasar esto como prop
  objetivoResult, // Necesitamos pasar esto como prop
}) => {
  const textStyle = {
    fontSize: `${fontSize}px`,
  };

  const titleStyle = {
    fontSize: `${fontSize + 2}px`,
  };

  const numberStyle = {
    fontSize: `${fontSize + 4}px`,
  };

  const smallTextStyle = {
    fontSize: `${fontSize - 2}px`,
  };
  const caloriasObjetivo = useMemo(() => {
    if (userData.objetivoPlan === "recomposicion") {
      // Para recomposición: usar Gasto Calórico Total (TDEE + ETA)
      return energiaTotalResult?.value || 0;
    } else {
      // Para déficit o aumento: usar el objetivo diario
      return objetivoResult?.final || 0;
    }
  }, [userData.objetivoPlan, energiaTotalResult, objetivoResult]);


  // Calcular los macronutrientes objetivo
  const macroNutrientes = useMemo(() => {
    if (
      userData &&
      userData.peso &&
      userData.proteinas &&
      userData.carbohidratos &&
      userData.grasas
    ) {
      const peso = parseFloat(userData.peso);

      // Usar el peso real para todos los casos (sin ajuste por grasa corporal)
      const proteinasGramos = userData.proteinas * peso;
      const carbohidratosGramos = userData.carbohidratos * peso;
      const grasasGramos = userData.grasas * peso;

      const proteinasCalorias = proteinasGramos * 4;
      const carbohidratosCalorias = carbohidratosGramos * 4;
      const grasasCalorias = grasasGramos * 9;

      const totalCaloriasMacros =
        proteinasCalorias + carbohidratosCalorias + grasasCalorias;

      // Calcular porcentajes basados en las calorías objetivo
      const proteinasPorcentaje =
        caloriasObjetivo > 0 ? (proteinasCalorias / caloriasObjetivo) * 100 : 0;
      const carbohidratosPorcentaje =
        caloriasObjetivo > 0
          ? (carbohidratosCalorias / caloriasObjetivo) * 100
          : 0;
      const grasasPorcentaje =
        caloriasObjetivo > 0 ? (grasasCalorias / caloriasObjetivo) * 100 : 0;

      return {
        proteinas: {
          gramos: proteinasGramos,
          calorias: proteinasCalorias,
          porcentaje: proteinasPorcentaje,
        },
        carbohidratos: {
          gramos: carbohidratosGramos,
          calorias: carbohidratosCalorias,
          porcentaje: carbohidratosPorcentaje,
        },
        grasas: {
          gramos: grasasGramos,
          calorias: grasasCalorias,
          porcentaje: grasasPorcentaje,
        },
        totalCalorias: totalCaloriasMacros,
        caloriasObjetivo: caloriasObjetivo,
      };
    }
    return null;
  }, [userData, caloriasObjetivo]);


   return (
     <div className="mt-4 pt-4 border-t border-gray-200">
       <h3 className="font-medium mb-2 text-gray-700" style={titleStyle}>
         Distribución de Macronutrientes Objetivo
       </h3>

       <div className="mb-3 bg-gray-50 p-3 rounded-md">
         <h4 className="font-medium text-gray-800" style={textStyle}>
           Calorías Objetivo: {caloriasObjetivo.toFixed(0)} kcal
         </h4>
         <p className="text-gray-600 text-sm" style={smallTextStyle}>
           {userData.objetivoPlan === "recomposicion"
             ? "Basado en Gasto Calórico Total (TDEE + ETA)"
             : "Basado en Objetivo Diario del Plan"}
         </p>
       </div>

       {macroNutrientes && (
         <div className="grid grid-cols-1 gap-3">
           <div className="bg-blue-50 p-3 rounded-md">
             <h4 className="font-medium text-blue-800" style={textStyle}>
               Proteínas
             </h4>
             <p className="font-bold text-blue-600" style={numberStyle}>
               {macroNutrientes.proteinas.gramos.toFixed(1)}g
             </p>
             <p className="text-blue-700" style={smallTextStyle}>
               {macroNutrientes.proteinas.calorias.toFixed(0)} kcal (
               {macroNutrientes.proteinas.porcentaje.toFixed(1)}% del objetivo)
             </p>
           </div>

           <div className="bg-green-50 p-3 rounded-md">
             <h4 className="font-medium text-green-800" style={textStyle}>
               Carbohidratos
             </h4>
             <p className="font-bold text-green-600" style={numberStyle}>
               {macroNutrientes.carbohidratos.gramos.toFixed(1)}g
             </p>
             <p className="text-green-700" style={smallTextStyle}>
               {macroNutrientes.carbohidratos.calorias.toFixed(0)} kcal (
               {macroNutrientes.carbohidratos.porcentaje.toFixed(1)}% del
               objetivo)
             </p>
           </div>

           <div className="bg-yellow-50 p-3 rounded-md">
             <h4 className="font-medium text-yellow-800" style={textStyle}>
               Grasas
             </h4>
             <p className="font-bold text-yellow-600" style={numberStyle}>
               {macroNutrientes.grasas.gramos.toFixed(1)}g
             </p>
             <p className="text-yellow-700" style={smallTextStyle}>
               {macroNutrientes.grasas.calorias.toFixed(0)} kcal (
               {macroNutrientes.grasas.porcentaje.toFixed(1)}% del objetivo)
             </p>
           </div>

           <div className="bg-purple-50 p-3 rounded-md">
             <h4 className="font-medium text-purple-800" style={textStyle}>
               Total de Macronutrientes
             </h4>
             <p className="font-bold text-purple-600" style={numberStyle}>
               {macroNutrientes.totalCalorias.toFixed(0)} kcal
             </p>
             <p className="text-purple-700" style={smallTextStyle}>
               {macroNutrientes.totalCalorias > macroNutrientes.caloriasObjetivo
                 ? `Excede en ${(
                     macroNutrientes.totalCalorias -
                     macroNutrientes.caloriasObjetivo
                   ).toFixed(0)} kcal`
                 : `Faltan ${(
                     macroNutrientes.caloriasObjetivo -
                     macroNutrientes.totalCalorias
                   ).toFixed(0)} kcal`}
             </p>
           </div>
         </div>
       )}
     </div>
   );
};
