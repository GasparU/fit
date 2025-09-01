// hooks/useCalculosCardio.js
import { useMemo } from "react";

export const useCalculosCardio = (userData, energiaTotalResult) => {
  // Calcular frecuencia cardíaca
  const cardioResult = useMemo(() => {
    if (userData.edad) {
      const edad = parseFloat(userData.edad);
      const porcentaje = parseFloat(userData.porcentajeCardio) / 100;

      let fcmBase = 0;
      let formula = "";

      if (userData.sexo === "hombre") {
        fcmBase = 208.75 - 0.73 * edad;
        formula = "208.75 - (0.73 × Edad)";
      } else {
        fcmBase = 206 - 0.88 * edad;
        formula = "206 - (0.88 × Edad)";
      }

      const resultadoCardio = fcmBase * porcentaje;

      return {
        value: Math.round(resultadoCardio),
        fcm: fcmBase,
        porcentaje: userData.porcentajeCardio,
        formula: formula,
      };
    }
    return null;
  }, [userData.edad, userData.sexo, userData.porcentajeCardio]);

  // Calcular déficit calórico
  const objetivoResult = useMemo(() => {
    if (
      energiaTotalResult &&
      userData.objetivoPlan &&
      userData.porcentajeObjetivo
    ) {
      const porcentaje = parseFloat(userData.porcentajeObjetivo) / 100;

      if (userData.objetivoPlan === "deficit") {
        const caloriasDeficit = energiaTotalResult.value * porcentaje;
        const caloriasFinal = energiaTotalResult.value - caloriasDeficit;

        return {
          tipo: "deficit",
          deficit: Math.round(caloriasDeficit),
          final: Math.round(caloriasFinal),
          porcentaje: userData.porcentajeObjetivo,
        };
      } else if (userData.objetivoPlan === "aumento") {
        const caloriasAumento = energiaTotalResult.value * porcentaje;
        const caloriasFinal = energiaTotalResult.value + caloriasAumento;

        return {
          tipo: "aumento",
          aumento: Math.round(caloriasAumento),
          final: Math.round(caloriasFinal),
          porcentaje: userData.porcentajeObjetivo,
        };
      }
    }
    return null;
  }, [energiaTotalResult, userData.objetivoPlan, userData.porcentajeObjetivo]);

  return { cardioResult, objetivoResult };
};
