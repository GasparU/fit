// DraggableFoodItem.jsx
import { Draggable } from "@hello-pangea/dnd";
import { normalizarValor, safeParseFloat } from "../utils/foodFilters";

export const DraggableFoodItem = ({
  food,
  index,fontSize,
  handleCantidadChange,
  handleInputFocus,
  handleInputBlur,
  // setSelectedFoods,
  textStyle,
  smallTextStyle,
  onRemove,
}) => {
  const factor = food.cantidad / 100;
  const energia = (safeParseFloat(food.energia) * factor).toFixed(0);
  const energiaPor100g = safeParseFloat(food.energia).toFixed(0);

  return (
    <Draggable draggableId={index.toString()} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`bg-white p-3 rounded-lg border border-gray-150 transition-all duration-150 ${
            snapshot.isDragging
              ? "opacity-90 shadow-md ring-1 ring-blue-100 z-50"
              : "shadow-xs hover:shadow-sm hover:border-gray-200"
          }`}
        >
          {/* Encabezado compacto - Área arrastrable */}
          <div
            {...provided.dragHandleProps}
            className="cursor-grab active:cursor-grabbing flex justify-between items-start mb-2"
          >
            {/* Nombre y energía */}
            <div className="flex-1 min-w-0">
              <h3
                className="font-normal text-gray-800 truncate"
                style={{
                  ...textStyle,
                  fontSize: `${parseInt(textStyle.fontSize) - 1}px`,
                }}
              >
                {food.nombre_alimento}
              </h3>
            </div>

            {/* Energía y botón eliminar */}
            <div className="flex items-center space-x-2 ml-2">
              <div className="bg-blue-50 px-2 py-auto rounded-md">
                <span
                  className="text-blue-700 font-medium py-20"
                  style={{
                    ...smallTextStyle,
                    fontSize: `${parseInt(fontSize) - 1}px`,
                  }}
                >
                  {energia} kcal
                </span>
              </div>

              <button
                onClick={onRemove}
                className="text-gray-400 hover:text-red-400 transition-colors duration-150  font-bold"
                style={smallTextStyle}
                title="Eliminar"
              >
                X
              </button>
            </div>
          </div>

          {/* Controles e información - Compactos */}
          <div className="flex items-center justify-between">
            {/* Control de cantidad */}
            <div className="flex items-center space-x-2 ">
              <span
                className="text-gray-600 font-medium text-2xl"
                style={{
                  ...smallTextStyle,
                  fontSize: `${parseInt(fontSize) - 1}px`,
                }}
              >
                Cantidad:
              </span>
              <input
                type="number"
                min="1"
                step="1"
                value={food.cantidad}
                onChange={(e) =>
                  handleCantidadChange(index, parseFloat(e.target.value) || 1)
                }
                onFocus={handleInputFocus}
                onBlur={(e) => handleInputBlur(e, index)}
                className="w-12 border border-gray-200 rounded-md py-0.5 px-1.5 text-center focus:ring-1 focus:ring-blue-200 focus:border-blue-200"
                style={{
                  ...smallTextStyle,
                  fontSize: `${parseInt(fontSize) - 1}px`,
                }}
              />
              <span
                className="text-gray-500 font-medium"
                style={{
                  ...smallTextStyle,
                  fontSize: `${parseInt(fontSize) - 1}px`,
                }}
              >
                g
              </span>
            </div>

            {/* Indicadores mini */}
            <div className="flex space-x-1">
              {food.saciedad && (
                <span
                  className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs ${
                    normalizarValor(food.saciedad) === "alto" ||
                    normalizarValor(food.saciedad) === "alta" ||
                    normalizarValor(food.saciedad) === "high"
                      ? "bg-green-50 text-green-600"
                      : normalizarValor(food.saciedad) === "medio" ||
                        normalizarValor(food.saciedad) === "media" ||
                        normalizarValor(food.saciedad) === "medium"
                      ? "bg-yellow-50 text-yellow-600"
                      : "bg-red-50 text-red-600"
                  }`}
                  style={{ fontSize: `${fontSize - 1}px` }}
                  title={`Saciedad: ${food.saciedad}`}
                >
                  Saciedad
                </span>
              )}

              {food.glucemia && (
                <span
                  className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs ${
                    normalizarValor(food.glucemia) === "alto" ||
                    normalizarValor(food.glucemia) === "alta" ||
                    normalizarValor(food.glucemia) === "high"
                      ? "bg-red-50 text-red-600"
                      : normalizarValor(food.glucemia) === "medio" ||
                        normalizarValor(food.glucemia) === "media" ||
                        normalizarValor(food.glucemia) === "medium"
                      ? "bg-orange-50 text-orange-600"
                      : "bg-green-50 text-green-600"
                  }`}
                  style={{ fontSize: `${fontSize - 1}px` }}
                  title={`Glucemia: ${food.glucemia}`}
                >
                  Glucemia
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};
