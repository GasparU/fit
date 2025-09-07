
// useCalculosNutricionales.js (actualizado)
import { useMemo } from "react";

export const useCalculosNutricionales = (userData) => {
  // Calcular IMC (sin cambios)
  const imcResult = useMemo(() => {
    if (userData.peso && userData.talla) {
      const peso = parseFloat(userData.peso);
      const talla = parseFloat(userData.talla) / 100;
      const imc = peso / (talla * talla);

      let classification = "";
      let colorClass = "";

      if (imc < 18.5) {
        classification = "Bajo peso";
        colorClass = "bg-blue-100 border-blue-300 text-blue-800";
      } else if (imc < 25) {
        classification = "Peso normal";
        colorClass = "bg-green-100 border-green-300 text-green-800";
      } else if (imc < 30) {
        classification = "Sobrepeso";
        colorClass = "bg-yellow-100 border-yellow-300 text-yellow-800";
      } else if (imc < 35) {
        classification = "Obesidad Grado I";
        colorClass = "bg-orange-100 border-orange-300 text-orange-800";
      } else if (imc < 40) {
        classification = "Obesidad Grado II";
        colorClass = "bg-red-100 border-red-300 text-red-800";
      } else {
        classification = "Obesidad Mórbida";
        colorClass = "bg-red-200 border-red-400 text-red-900";
      }

      return {
        value: imc.toFixed(1),
        classification,
        colorClass,
      };
    }
    return null;
  }, [userData.peso, userData.talla]);

  // Calcular TMB + ETA (MODIFICADO)
  const tmbResult = useMemo(() => {
    if (userData.edad && userData.peso && userData.talla && imcResult) {
      const edad = parseFloat(userData.edad);
      const peso = parseFloat(userData.peso);
      const talla = parseFloat(userData.talla);
      const imcValor = parseFloat(imcResult.value);

      let tmb = 0;
      let formulaUsada = "";
      let pesoIdeal = 0;

      if (imcValor < 30) {
        if (userData.sexo === "hombre") {
          tmb = 10 * peso + 6.25 * talla - 5 * edad + 5;
          formulaUsada = "Mifflin-St Jeor (Hombres)";
        } else {
          tmb = 10 * peso + 6.25 * talla - 5 * edad - 161;
          formulaUsada = "Mifflin-St Jeor (Mujeres)";
        }
      } else {
        const imcObjetivo = parseFloat(userData.imcObjetivo);
        const tallaMetros = talla / 100;
        pesoIdeal = imcObjetivo * (tallaMetros * tallaMetros);
        const pesoAjustado = pesoIdeal + 0.25 * (peso - pesoIdeal);

        if (userData.sexo === "hombre") {
          tmb = 370 + 21.6 * (pesoIdeal);
          formulaUsada =
            "Ajustada para obesidad (Hombres) Fórmula de Katch–McArdle ";
        } else {
          tmb = 10 * pesoAjustado + 6.25 * talla - 5 * edad - 161;
          formulaUsada = "Ajustada para obesidad (Mujeres)";
        }
      }

      return {
        value: Math.round(tmb),
        formula: formulaUsada,
        pesoIdeal: pesoIdeal,
      };
    }
    return null;
  }, [
    userData.edad,
    userData.peso,
    userData.talla,
    userData.sexo,
    userData.imcObjetivo,
    imcResult,
  ]);

  // Calcular TDEE (MODIFICADO - ahora usa tmbResult.total)
  const tdeeResult = useMemo(() => {
    if (tmbResult) {
      let factorActividad = 1.2;
      let nivelActividad = "Sedentario";

      if (userData.diasActividad >= 6) {
        factorActividad = 1.725;
        nivelActividad = "Ejercicio Intenso Diario";
      } else if (userData.diasActividad >= 4) {
        factorActividad = 1.55;
        nivelActividad = "Ejercicio Moderado (4-5 días)";
      } else if (userData.diasActividad >= 2) {
        factorActividad = 1.375;
        nivelActividad = "Ejercicio Ligero (2-3 días)";
      }

      const tdee = tmbResult.value * factorActividad;

      return {
        value: Math.round(tdee),
        factor: factorActividad,
        nivel: nivelActividad,
      };
    }
    return null;
  }, [tmbResult, userData.diasActividad]);

  // Calcular Energía Total (NUEVO - TDEE + ETA)
  const energiaTotalResult = useMemo(() => {
    if (tdeeResult) {
      // ETA = 10% del TDEE (Efecto Térmico de los Alimentos)
      const eta = tdeeResult.value * 0.1;
      const energiaTotal = tdeeResult.value + eta;

      return {
        value: Math.round(energiaTotal),
        eta: Math.round(eta),
        tdee: tdeeResult.value,
      };
    }
    return null;
  }, [tdeeResult]);

  // Calcular agua (sin cambios)
  const aguaResult = useMemo(() => {
    if (userData.peso && imcResult) {
      const peso = parseFloat(userData.peso);
      const imcValor = parseFloat(imcResult.value);
      let aguaBase = 0;

      if (imcValor < 30) {
        aguaBase = peso * 35;
      } else {
        const pesoIdeal =
          tmbResult?.pesoIdeal ||
          24 * Math.pow(parseFloat(userData.talla) / 100, 2);
        aguaBase = pesoIdeal * 30 + (peso - pesoIdeal) * 10;
      }

      const aguaExtra = userData.diasActividad > 0 ? 500 : 0;
      const aguaTotal = aguaBase + aguaExtra;

      return {
        base: Math.round(aguaBase),
        extra: aguaExtra,
        total: Math.round(aguaTotal),
        litros: (aguaTotal / 1000).toFixed(1),
      };
    }
    return null;
  }, [
    userData.peso,
    userData.diasActividad,
    imcResult,
    tmbResult,
    userData.talla,
  ]);

  // Calcular grasa corporal (sin cambios)
  const grasaCorporalResult = useMemo(() => {
    if (imcResult && userData.edad) {
      const imc = parseFloat(imcResult.value);
      const edad = parseFloat(userData.edad);
      const genero = userData.sexo === "hombre" ? 1 : 0;

      const grasaCorporal = 1.2 * imc + 0.23 * edad - 10.8 * genero - 5.4;

      return {
        value: grasaCorporal.toFixed(1),
        formula: "(1.20 × IMC) + (0.23 × Edad) - (10.8 × Género) - 5.4",
      };
    }
    return null;
  }, [imcResult, userData.edad, userData.sexo]);

  return { imcResult, tmbResult,energiaTotalResult, tdeeResult, aguaResult, grasaCorporalResult };
};