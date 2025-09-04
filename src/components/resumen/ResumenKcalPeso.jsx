import { useMemo } from "react";
import { useDynamicStyles } from "../../hooks/useDynamicStyles";
import { useMacroCalculations } from "../../hooks/useMacroCalculations";

// ResumenKcalPeso.jsx - Modificar el cálculo de porcentajes
export const ResumenKcalPeso = ({
  fontSize,
  userData,
  energiaTotalResult, // Este es el valor TDEE + ETA
  objetivoResult,
}) => {
  const { textStyle, titleStyle, numberStyle, smallTextStyle } =
    useDynamicStyles(fontSize);

  const caloriasObjetivo = useMemo(() => {
    if (userData.objetivoPlan === "recomposicion") {
      return energiaTotalResult?.value || 0;
    } else {
      return objetivoResult?.final || 0;
    }
  }, [userData.objetivoPlan, energiaTotalResult, objetivoResult]);

  const macroNutrientes = useMacroCalculations(userData, caloriasObjetivo);

  // Calcular porcentajes basados en TDEE + ETA en lugar del total de macros
  const calcularPorcentajeBasadoEnTDEE = (caloriasMacro) => {
    if (!energiaTotalResult?.value) return 0;
    return (caloriasMacro / energiaTotalResult.value) * 100;
  };

  return (
    <div className="mt-4 pt-4 border-t border-gray-200">
      <h3
        className="font-medium mb-2 text-gray-700 cursor-grab"
        style={titleStyle}
      >
        Distribución de Macronutrientes Objetivo
      </h3>

      <div className="mb-3 bg-gray-50 p-3 rounded-md">
        <h4 className="font-medium text-gray-800 cursor-grab" style={textStyle}>
          Calorías Objetivo: {caloriasObjetivo.toFixed(0)} kcal
        </h4>
        <p className="text-gray-600 text-sm" style={smallTextStyle}>
          {userData.objetivoPlan === "recomposicion"
            ? "Basado en Gasto Calórico Total (TDEE + ETA)"
            : "Basado en Objetivo Diario del Plan"}
        </p>
        <p className="text-gray-600 text-sm mt-1" style={smallTextStyle}>
          TDEE + ETA: {energiaTotalResult?.value || 0} kcal
        </p>
      </div>

      {macroNutrientes && energiaTotalResult?.value && (
        <div className="grid grid-cols-1 gap-3">
          <div className="bg-blue-50 p-3 rounded-md">
            <h4
              className="font-medium text-blue-800 cursor-grab"
              style={textStyle}
            >
              Proteínas
            </h4>
            <p className="font-bold text-blue-600" style={numberStyle}>
              {macroNutrientes.proteinas.gramos.toFixed(1)}g
            </p>
            <p className="text-blue-700" style={smallTextStyle}>
              {macroNutrientes.proteinas.calorias.toFixed(0)} kcal (
              {calcularPorcentajeBasadoEnTDEE(
                macroNutrientes.proteinas.calorias
              ).toFixed(1)}
              % del TDEE + ETA)
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
              {calcularPorcentajeBasadoEnTDEE(
                macroNutrientes.carbohidratos.calorias
              ).toFixed(1)}
              % del TDEE + ETA)
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
              {calcularPorcentajeBasadoEnTDEE(
                macroNutrientes.grasas.calorias
              ).toFixed(1)}
              % del TDEE + ETA)
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
