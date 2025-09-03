// ResumenNutricional.jsx (actualizado)

import { ResumenKcalPeso } from "./resumen/ResumenKcalPeso";

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

// Función para obtener el color según el nivel de saciedad
const getSaciedadColor = (saciedad) => {
  if (!saciedad) return "gray";

  const saciedadLower = saciedad.toLowerCase();
  if (
    saciedadLower.includes("alta") ||
    saciedadLower.includes("alto") ||
    saciedadLower.includes("high")
  ) {
    return "green";
  } else if (
    saciedadLower.includes("media") ||
    saciedadLower.includes("medio") ||
    saciedadLower.includes("medium")
  ) {
    return "yellow";
  } else if (
    saciedadLower.includes("baja") ||
    saciedadLower.includes("bajo") ||
    saciedadLower.includes("low")
  ) {
    return "red";
  }
  return "gray";
};

// Función para obtener el color según el nivel de glucemia
const getGlucemiaColor = (glucemia) => {
  if (!glucemia) return "gray";

  const glucemiaLower = glucemia.toLowerCase();
  if (
    glucemiaLower.includes("alta") ||
    glucemiaLower.includes("alto") ||
    glucemiaLower.includes("high")
  ) {
    return "red";
  } else if (
    glucemiaLower.includes("media") ||
    glucemiaLower.includes("medio") ||
    glucemiaLower.includes("medium")
  ) {
    return "orange";
  } else if (
    glucemiaLower.includes("baja") ||
    glucemiaLower.includes("bajo") ||
    glucemiaLower.includes("low")
  ) {
    return "green";
  }
  return "gray";
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
            <div className="bg-blue-50 p-3 rounded-md transition-all duration-300 hover:bg-blue-100">
              <h3 className="font-medium text-blue-800" style={textStyle}>
                Energía Total
              </h3>
              <p className="font-bold text-blue-600" style={numberStyle}>
                {totalNutrientsResult.energia.toFixed(1)}kcal
              </p>
            </div>

            <div className="bg-green-50 p-3 rounded-md transition-all duration-300 hover:bg-green-100">
              <h3 className="font-medium text-green-800" style={textStyle}>
                Proteínas Total
              </h3>
              <p className="font-bold text-green-600" style={numberStyle}>
                {totalNutrientsResult.proteinas.toFixed(1)}g
              </p>
            </div>

            <div className="bg-purple-50 p-3 rounded-md transition-all duration-300 hover:bg-purple-100">
              <h3 className="font-medium text-purple-800" style={textStyle}>
                Grasas Total
              </h3>
              <p className="font-bold text-purple-600" style={numberStyle}>
                {totalNutrientsResult.grasa.toFixed(1)}g
              </p>
            </div>

            <div className="bg-yellow-50 p-3 rounded-md transition-all duration-300 hover:bg-yellow-100">
              <h3 className="font-medium text-yellow-800" style={textStyle}>
                Carbohidratos Disp.
              </h3>
              <p className="font-bold text-yellow-600" style={numberStyle}>
                {totalNutrientsResult.carbohidratos_disp.toFixed(1)}g
              </p>
            </div>
          </div>

          {/* Información adicional */}
          <div className="space-y-3">
            {totalNutrientsResult.fibra > 0 && (
              <div className="bg-indigo-50 p-3 rounded-md transition-all duration-300 hover:bg-indigo-100">
                <h3 className="font-medium text-indigo-800" style={textStyle}>
                  Fibra Dietética
                </h3>
                <p className="font-bold text-indigo-600" style={numberStyle}>
                  {totalNutrientsResult.fibra.toFixed(1)}g
                </p>
              </div>
            )}

            {totalNutrientsResult.agua > 0 && (
              <div className="bg-cyan-50 p-3 rounded-md transition-all duration-300 hover:bg-cyan-100">
                <h3 className="font-medium text-cyan-800" style={textStyle}>
                  Agua Total
                </h3>
                <p className="font-bold text-cyan-600" style={numberStyle}>
                  {totalNutrientsResult.agua.toFixed(1)}ml
                </p>
              </div>
            )}
          </div>

          {/* Resumen de alimentos - VERSIÓN MEJORADA Y COLORIDA */}
          <div className="mt-4">
            <h3 className="font-medium mb-2 text-gray-700" style={textStyle}>
              Alimentos en la selección ({selectedFoods.length})
            </h3>
            <div className="space-y-2">
              {selectedFoods.map((food, index) => {
                const factor = food.cantidad / 100;
                const saciedadColor = getSaciedadColor(food.saciedad);
                const glucemiaColor = getGlucemiaColor(food.glucemia);

                return (
                  <div
                    key={index}
                    className="bg-gray-50 p-3 rounded-md border border-gray-200"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span
                        className="font-medium text-gray-800"
                        style={textStyle}
                      >
                        {food.nombre_alimento}
                      </span>
                      <span
                        className="text-gray-600 font-medium"
                        style={textStyle}
                      >
                        {food.cantidad}g
                      </span>
                    </div>

                    <div
                      className="grid grid-cols-2 gap-2 mb-2"
                      style={{ fontSize: `${fontSize - 1}px` }}
                    >
                      <div className="text-blue-600">
                        <span className="font-medium">Energía: </span>
                        {(food.energia * factor).toFixed(1)}kcal
                      </div>
                      <div className="text-green-600">
                        <span className="font-medium">Proteínas: </span>
                        {(food.proteinas * factor).toFixed(1)}g
                      </div>
                      <div className="text-purple-600">
                        <span className="font-medium">Grasas: </span>
                        {(food.grasa * factor).toFixed(1)}g
                      </div>
                      <div className="text-yellow-600">
                        <span className="font-medium">Carbohidratos: </span>
                        {(
                          (food.carbohidratos_disp || food.carbohidratos_tot) *
                          factor
                        ).toFixed(1)}
                        g
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {food.saciedad && (
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            saciedadColor === "green"
                              ? "bg-green-100 text-green-800 border border-green-200"
                              : saciedadColor === "yellow"
                              ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                              : saciedadColor === "red"
                              ? "bg-red-100 text-red-800 border border-red-200"
                              : "bg-gray-100 text-gray-800 border border-gray-200"
                          }`}
                        >
                          Saciedad: {food.saciedad}
                        </span>
                      )}
                      {food.glucemia && (
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            glucemiaColor === "green"
                              ? "bg-green-100 text-green-800 border border-green-200"
                              : glucemiaColor === "orange"
                              ? "bg-orange-100 text-orange-800 border border-orange-200"
                              : glucemiaColor === "red"
                              ? "bg-red-100 text-red-800 border border-red-200"
                              : "bg-gray-100 text-gray-800 border border-gray-200"
                          }`}
                        >
                          Glucemia: {food.glucemia}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      <ResumenKcalPeso
        selectedFoods={selectedFoods}
        grasaCorporalResult={grasaCorporalResult}
        fontSize={fontSize}
        userData={userData}
        energiaTotalResult={energiaTotalResult} // Nueva prop
        objetivoResult={objetivoResult} // Nueva prop
      />
    </div>
  );
};
