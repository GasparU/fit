// ResumenNutricional.jsx (corregido)

import { ResumenKcalPeso } from "./resumen/ResumenKcalPeso";
import {useMacroCalculations} from '../hooks/useMacroCalculations';
import { useMemo } from "react";
import { DistribucionComidas } from "./resumen/DistribucionComidas";

const totalNutrients = (selectedFoods) => {
  // Inicializar todos los nutrientes en 0
  const result = {
    energia: 0,
    agua: 0,
    proteinas: 0,
    grasa: 0,
    carbohidratos_tot: 0,
    carbohidratos_disp: 0,
    fibra: 0,
  };

  // Calcular el total para cada nutriente
  selectedFoods.forEach((food) => {
    const cantidad = food.cantidad || 100; // Usar 100g por defecto si no se especifica
    const factor = cantidad / 100; // Factor de conversión basado en 100g

    result.energia += (food.energia || 0) * factor;
    result.agua += (food.agua || 0) * factor;
    result.proteinas += (food.proteinas || 0) * factor;
    result.grasa += (food.grasa || 0) * factor;
    result.carbohidratos_tot += (food.carbohidratos_tot || 0) * factor;
    result.carbohidratos_disp += (food.carbohidratos_disp || 0) * factor;
    result.fibra += (food.fibra_diet || 0) * factor;
  });

  return result;
};

export const ResumenNutricional = ({
  selectedFoods,
  userData,
  grasaCorporalResult,
  fontSize = 14,
  energiaTotalResult,
  objetivoResult,
  numberStyle,
}) => {
  // Calcular los nutrientes totales
  const totalNutrientsResult = totalNutrients(selectedFoods);

  // Calcular macronutrientes objetivo
  const caloriasObjetivo = useMemo(() => {
    if (userData.objetivoPlan === "recomposicion") {
      return energiaTotalResult?.value || 0;
    } else {
      return objetivoResult?.final || 0;
    }
  }, [userData.objetivoPlan, energiaTotalResult, objetivoResult]);

  const macroNutrientes = useMacroCalculations(userData, caloriasObjetivo);

  // Calcular déficit real
  const deficitReal = useMemo(() => {
    if (macroNutrientes && totalNutrientsResult.energia > 0) {
      return totalNutrientsResult.energia - macroNutrientes.totalCalorias;
    }
    return 0;
  }, [totalNutrientsResult.energia, macroNutrientes]);

  // Verificar si hay datos de macronutrientes
  const tieneDatosMacros = useMemo(() => {
    return (
      macroNutrientes &&
      macroNutrientes.proteinas !== undefined &&
      macroNutrientes.carbohidratos !== undefined &&
      macroNutrientes.grasas !== undefined
    );
  }, [macroNutrientes]);

  // Estilos dinámicos
  const textStyle = {
    fontSize: `${fontSize}px`,
  };

  const titleStyle = {
    fontSize: `${fontSize + 2}px`,
  };

  return (
    <div className="bg-white rounded-lg shadow p-3 md:p-4 h-full flex flex-col">
      <h2 className="font-semibold mb-2 text-gray-700" style={titleStyle}>
        Resumen Nutricional
      </h2>

      {selectedFoods.length === 0 ? (
        <p className="text-gray-500 italic" style={textStyle}>
          Agrega alimentos para ver el resumen nutricional
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* Energía Total Consumida */}
            <div className="bg-blue-50 p-3 rounded-md transition-all duration-300 hover:bg-blue-100">
              <h3 className="font-medium text-blue-800" style={textStyle}>
                Energía Total de los Alimentos
              </h3>
              <p className="font-bold text-blue-600" style={numberStyle}>
                {totalNutrientsResult.energia.toFixed(1)}kcal
              </p>
            </div>

            {/* Total de Macronutrientes Objetivo */}
            <div className="bg-purple-50 p-3 rounded-md transition-all duration-300 hover:bg-purple-100">
              <h3 className="font-medium text-purple-800" style={textStyle}>
                Total Macronutrientes Objetivo
              </h3>
              <p className="font-bold text-purple-600" style={numberStyle}>
                {macroNutrientes ? macroNutrientes.totalCalorias.toFixed(0) : 0}
                kcal
              </p>
            </div>
          </div>

          {/* Diferencia (Déficit Real) */}
          <div className="mb-4">
            <div
              className={`p-3 rounded-md transition-all duration-300 ${
                deficitReal > 0
                  ? "bg-red-50 hover:bg-red-100"
                  : deficitReal < 0
                  ? "bg-green-50 hover:bg-green-100"
                  : "bg-gray-50 hover:bg-gray-100"
              }`}
            >
              <h3 className="font-medium" style={textStyle}>
                {deficitReal > 0
                  ? "Excedente Real"
                  : deficitReal < 0
                  ? "Déficit Real"
                  : "Balance Perfecto"}
              </h3>
              <p
                className={`font-bold ${
                  deficitReal > 0
                    ? "text-red-600"
                    : deficitReal < 0
                    ? "text-green-600"
                    : "text-gray-600"
                }`}
                style={numberStyle}
              >
                {Math.abs(deficitReal).toFixed(0)}kcal
                {deficitReal > 0
                  ? " por encima del objetivo"
                  : deficitReal < 0
                  ? " por debajo del objetivo"
                  : ""}
              </p>
              <p className="text-gray-600 text-sm mt-1" style={textStyle}>
                {deficitReal > 0
                  ? "⚠️ Estás consumiendo más calorías de las planeadas"
                  : deficitReal < 0
                  ? "✅ Estás en déficit calórico respecto a tu objetivo"
                  : "🎯 Perfectamente alineado con tu objetivo"}
              </p>
            </div>
          </div>

          {/* Resumen de alimentos - VERSIÓN SIMPLIFICADA */}
          <div className="mt-4">
            <h3 className="font-medium mb-2 text-gray-700" style={textStyle}>
              Alimentos en la selección ({selectedFoods.length})
            </h3>
            <div className="space-y-1">
              {selectedFoods.map((food, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-gray-50 p-2 rounded-md border border-gray-200"
                >
                  <span className="font-medium text-gray-800" style={textStyle}>
                    {food.nombre_alimento}
                  </span>
                  <span className="text-gray-600 font-medium" style={textStyle}>
                    {food.cantidad}g
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <ResumenKcalPeso
        selectedFoods={selectedFoods}
        grasaCorporalResult={grasaCorporalResult}
        fontSize={fontSize}
        userData={userData}
        energiaTotalResult={energiaTotalResult}
        objetivoResult={objetivoResult}
      />
      {/* Mostrar DistribucionComidas solo si hay datos de macronutrientes */}
      {tieneDatosMacros && (
        <DistribucionComidas
          caloriasObjetivo={caloriasObjetivo}
          fontSize={fontSize}
        />
      )}
    </div>
  );
};
