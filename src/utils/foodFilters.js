// utils/foodFilters.js
export const normalizarValor = (valor) => {
  if (!valor) return "";
  return valor
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

export const safeParseFloat = (value) => {
  if (value === null || value === undefined || value === "") return 0;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? 0 : parsed;
};

export const applyFoodFilters = (
  foods,
  searchTerm,
  filtroSaciedad,
  filtroGlucemia
) => {
  return foods.filter((food) => {
    const matchesSearch = normalizarValor(food.nombre_alimento).includes(
      normalizarValor(searchTerm)
    );

    const matchesSaciedad =
      !filtroSaciedad ||
      (filtroSaciedad === "alto" &&
        (normalizarValor(food.saciedad) === "alto" ||
          normalizarValor(food.saciedad) === "alta" ||
          normalizarValor(food.saciedad) === "high")) ||
      (filtroSaciedad === "medio" &&
        (normalizarValor(food.saciedad) === "medio" ||
          normalizarValor(food.saciedad) === "media" ||
          normalizarValor(food.saciedad) === "medium")) ||
      (filtroSaciedad === "bajo" &&
        (normalizarValor(food.saciedad) === "bajo" ||
          normalizarValor(food.saciedad) === "baja" ||
          normalizarValor(food.saciedad) === "low"));

    const matchesGlucemia =
      !filtroGlucemia ||
      (filtroGlucemia === "alto" &&
        (normalizarValor(food.glucemia) === "alto" ||
          normalizarValor(food.glucemia) === "alta" ||
          normalizarValor(food.glucemia) === "high")) ||
      (filtroGlucemia === "medio" &&
        (normalizarValor(food.glucemia) === "medio" ||
          normalizarValor(food.glucemia) === "media" ||
          normalizarValor(food.glucemia) === "medium")) ||
      (filtroGlucemia === "bajo" &&
        (normalizarValor(food.glucemia) === "bajo" ||
          normalizarValor(food.glucemia) === "baja" ||
          normalizarValor(food.glucemia) === "low"));

    return matchesSearch && matchesSaciedad && matchesGlucemia;
  });
};
