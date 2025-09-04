// FoodSuggestions.jsx
import { normalizarValor, safeParseFloat } from "../utils/foodFilters";

export const FoodSuggestions = ({
  searchTerm,
  filteredFoods,
  filtroSaciedad,
  filtroGlucemia,
  handleFoodSelect,
  textStyle,
  smallTextStyle,
}) => {
  if (!searchTerm) return null;

  if (filteredFoods.length === 0) {
    return (
      <div
        className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-2 text-gray-500"
        style={textStyle}
      >
        {filtroSaciedad || filtroGlucemia
          ? "No se encontraron alimentos con ese nombre que cumplan los filtros aplicados."
          : "No se encontraron alimentos con ese nombre."}
      </div>
    );
  }

  return (
    <div
      className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto"
      style={textStyle}
    >
      {filteredFoods.map((food, index) => (
        <div
          key={index}
          onClick={() => handleFoodSelect(food)}
          className="p-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-200"
        >
          <div className="font-medium">{food.nombre_alimento}</div>
          <div className="text-gray-500 mt-1" style={smallTextStyle}>
            {food.energia &&
              `Energía: ${safeParseFloat(food.energia).toFixed(1)}kcal | `}
            {food.proteinas &&
              `Proteínas: ${safeParseFloat(food.proteinas).toFixed(1)}g | `}
            {food.carbohidratos_disp &&
              `Carbohidratos: ${safeParseFloat(food.carbohidratos_disp).toFixed(
                1
              )}g`}
          </div>
          <div className="mt-1">
            {food.saciedad && (
              <span
                className={`inline-block px-2 py-1 rounded mr-2 ${
                  normalizarValor(food.saciedad) === "alto" ||
                  normalizarValor(food.saciedad) === "alta" ||
                  normalizarValor(food.saciedad) === "high"
                    ? "bg-green-100 text-green-800 border border-green-200"
                    : normalizarValor(food.saciedad) === "medio" ||
                      normalizarValor(food.saciedad) === "media" ||
                      normalizarValor(food.saciedad) === "medium"
                    ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                    : "bg-red-100 text-red-800 border border-red-200"
                }`}
                style={smallTextStyle}
              >
                Saciedad: {food.saciedad}
              </span>
            )}
            {food.glucemia && (
              <span
                className={`inline-block px-2 py-1 rounded ${
                  normalizarValor(food.glucemia) === "alto" ||
                  normalizarValor(food.glucemia) === "alta" ||
                  normalizarValor(food.glucemia) === "high"
                    ? "bg-red-100 text-red-800 border border-red-200"
                    : normalizarValor(food.glucemia) === "medio" ||
                      normalizarValor(food.glucemia) === "media" ||
                      normalizarValor(food.glucemia) === "medium"
                    ? "bg-orange-100 text-orange-800 border border-orange-200"
                    : "bg-green-100 text-green-800 border border-green-200"
                }`}
                style={smallTextStyle}
              >
                Glucemia: {food.glucemia}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
