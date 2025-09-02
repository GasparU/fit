// ResumenNutricional.jsx (actualizado)
import { useMemo } from "react";

export const ResumenNutricional = ({ selectedFoods, fontSize = 14 }) => {
  // Función para convertir valores a número de forma segura
  const safeParseFloat = (value) => {
    if (value === null || value === undefined || value === "") return 0;
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  };

  // Estilos dinámicos
  const textStyle = {
    fontSize: `${fontSize}px`,
  };

  const titleStyle = {
    fontSize: `${fontSize + 2}px`,
  };

  const numberStyle = {
    fontSize: `${fontSize + 4}px`,
  };

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
                {totalNutrients.energia.toFixed(1)}kcal
              </p>
            </div>

            {/* <div className="bg-green-50 p-3 rounded-md transition-all duration-300 hover:bg-green-100">
              <h3 className="font-medium text-green-800" style={textStyle}>
                Proteínas Total
              </h3>
              <p className="font-bold text-green-600" style={numberStyle}>
                {totalNutrients.proteinas.toFixed(1)}g
              </p>
            </div>

            <div className="bg-purple-50 p-3 rounded-md transition-all duration-300 hover:bg-purple-100">
              <h3 className="font-medium text-purple-800" style={textStyle}>
                Grasas Total
              </h3>
              <p className="font-bold text-purple-600" style={numberStyle}>
                {totalNutrients.grasas.toFixed(1)}g
              </p>
            </div>

            <div className="bg-yellow-50 p-3 rounded-md transition-all duration-300 hover:bg-yellow-100">
              <h3 className="font-medium text-yellow-800" style={textStyle}>
                Carbohidratos Disp.
              </h3>
              <p className="font-bold text-yellow-600" style={numberStyle}>
                {totalNutrients.carbohidratos_disp.toFixed(1)}g
              </p>
            </div> */}
          </div>

          {/* Información adicional */}
          <div className="space-y-3">
            {/* {totalNutrients.fibra > 0 && (
              <div className="bg-indigo-50 p-3 rounded-md transition-all duration-300 hover:bg-indigo-100">
                <h3 className="font-medium text-indigo-800" style={textStyle}>
                  Fibra Dietética
                </h3>
                <p className="font-bold text-indigo-600" style={numberStyle}>
                  {totalNutrients.fibra.toFixed(1)}g
                </p>
              </div>
            )}

            {totalNutrients.agua > 0 && (
              <div className="bg-cyan-50 p-3 rounded-md transition-all duration-300 hover:bg-cyan-100">
                <h3 className="font-medium text-cyan-800" style={textStyle}>
                  Agua Total
                </h3>
                <p className="font-bold text-cyan-600" style={numberStyle}>
                  {totalNutrients.agua.toFixed(1)}ml
                </p>
              </div>
            )} */}

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

          {/* Resumen de alimentos */}
          <div className="mt-4">
            <h3 className="font-medium mb-2 text-gray-700" style={textStyle}>
              Alimentos en la selección ({selectedFoods.length})
            </h3>
            <ul
              className="text-gray-600 space-y-1"
              style={{ fontSize: `${fontSize - 2}px` }}
            >
              {selectedFoods.map((food, index) => (
                <li key={index} className="flex justify-between">
                  <span>{food.nombre_alimento}</span>
                  <span>{food.cantidad}g</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};
