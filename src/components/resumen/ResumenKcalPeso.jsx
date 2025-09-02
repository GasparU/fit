import React from 'react'
import {useMemo} from 'react';

export const ResumenKcalPeso = ({
  selectedFoods,
  grasaCorporalResult,
  fontSize,
  userData,
}) => {
  const textStyle = {
    fontSize: `${fontSize}px`,
  };

  const numberStyle = {
    fontSize: `${fontSize + 4}px`,
  };

  const smallTextStyle = {
    fontSize: `${fontSize - 2}px`,
  };
  // Calcular los macronutrientes objetivo
  const macroNutrientes = useMemo(() => {
    if (
      userData &&
      userData.peso &&
      userData.proteinas &&
      userData.carbohidratos &&
      userData.grasas &&
      grasaCorporalResult &&
      grasaCorporalResult.value
    ) {
      const peso = parseFloat(userData.peso);
      const porcentajeGrasa = parseFloat(grasaCorporalResult.value) / 100;
      const masaMagra = peso - peso * porcentajeGrasa;

      const proteinasGramos = userData.proteinas * masaMagra;
      const carbohidratosGramos = userData.carbohidratos * masaMagra;
      const grasasGramos = userData.grasas * masaMagra;

      const proteinasCalorias = proteinasGramos * 4;
      const carbohidratosCalorias = carbohidratosGramos * 4;
      const grasasCalorias = grasasGramos * 9;

      const totalCalorias =
        proteinasCalorias + carbohidratosCalorias + grasasCalorias;

      const proteinasPorcentaje = (proteinasCalorias / totalCalorias) * 100;
      const carbohidratosPorcentaje =
        (carbohidratosCalorias / totalCalorias) * 100;
      const grasasPorcentaje = (grasasCalorias / totalCalorias) * 100;

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
        totalCalorias: totalCalorias,
        masaMagra: masaMagra,
      };
    }
    return null;
  }, [userData, grasaCorporalResult]);

  // Calcular totales nutricionales con proporción según cantidad
  const totalNutrients = useMemo(() => {
    return selectedFoods.reduce(
      (totals, food) => {
        const factor = food.cantidad / 100;
        return {
          energia: totals.energia + safeParseFloat(food.energia) * factor,
          proteinas: totals.proteinas + safeParseFloat(food.proteinas) * factor,
          carbohidratos_disp:
            totals.carbohidratos_disp +
            safeParseFloat(food.carbohidratos_disp) * factor,
          carbohidratos:
            totals.carbohidratos + safeParseFloat(food.carbohidratos) * factor,
          grasas: totals.grasas + safeParseFloat(food.grasas) * factor,
          agua: totals.agua + safeParseFloat(food.agua) * factor,
          fibra: totals.fibra + safeParseFloat(food.fibra_diet) * factor,
        };
      },
      {
        energia: 0,
        proteinas: 0,
        carbohidratos_disp: 0,
        carbohidratos: 0,
        grasas: 0,
        agua: 0,
        fibra: 0,
      }
    );
  }, [selectedFoods]);
  return (
    <div>
      {/* Sección de distribución de macronutrientes */}
      {macroNutrientes && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h3 className="font-medium mb-2 text-gray-700" style={textStyle}>
            Distribución de Macronutrientes Objetivo
          </h3>

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
                {macroNutrientes.proteinas.porcentaje.toFixed(1)}%)
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
                {macroNutrientes.carbohidratos.porcentaje.toFixed(1)}%)
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
                {macroNutrientes.grasas.porcentaje.toFixed(1)}%)
              </p>
            </div>

            <div className="bg-purple-50 p-3 rounded-md">
              <h4 className="font-medium text-purple-800" style={textStyle}>
                Total Calórico
              </h4>
              <p className="font-bold text-purple-600" style={numberStyle}>
                {macroNutrientes.totalCalorias.toFixed(0)} kcal
              </p>
            </div>
          </div>

          <div className="mt-3 bg-gray-100 p-2 rounded-md">
            <p className="text-gray-700 text-xs" style={smallTextStyle}>
              Cálculos basados en masa magra:{" "}
              {macroNutrientes.masaMagra.toFixed(1)} kg
            </p>
          </div>
        </div>
      )}
      {totalNutrients.carbohidratos > 0 && (
        <div className="bg-orange-50 p-3 rounded-md transition-all duration-300 hover:bg-orange-100">
          <h3 className="font-medium text-orange-800" style={textStyle}>
            Carbohidratos Totales
          </h3>
          <p className="font-bold text-orange-600" style={numberStyle}>
            {totalNutrients.carbohidratos.toFixed(1)}g
          </p>
        </div>
      )}
    </div>
  );
};
