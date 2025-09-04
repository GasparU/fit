import { useMemo } from "react";

// hooks/useMacroCalculations.js
export const useMacroCalculations = (userData, caloriasObjetivo) => {
  return useMemo(() => {
    if (
      userData?.peso &&
      userData.proteinas &&
      userData.carbohidratos &&
      userData.grasas &&
      userData?.talla &&
      userData?.edad
    ) {
      const peso = parseFloat(userData.peso);
      
      const proteinasGramos = userData.proteinas * peso;
      const carbohidratosGramos = userData.carbohidratos * peso;
      const grasasGramos = userData.grasas * peso;

      const proteinasCalorias = proteinasGramos * 4;
      const carbohidratosCalorias = carbohidratosGramos * 4;
      const grasasCalorias = grasasGramos * 9;

      const totalCaloriasMacros =
        proteinasCalorias + carbohidratosCalorias + grasasCalorias;

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
        caloriasObjetivo,
      };
    }
    return null;
  }, [userData, caloriasObjetivo]);
};
