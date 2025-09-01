
// BusquedaComida.jsx
import { useMemo } from "react";
import { useDrag, useDrop } from 'react-dnd';
import { alimentosList } from "../firebase/lista";

// Función para convertir valores a número de forma segura
const safeParseFloat = (value) => {
  if (value === null || value === undefined || value === "") return 0;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? 0 : parsed;
};

// Función para normalizar valores de filtro
const normalizarValor = (valor) => {
  if (!valor) return "";
  return valor.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

// Componente de alimento arrastrable
const DraggableFoodItem = ({
  food,
  index,
  moveFood,
  handleCantidadChange,
  handleInputFocus,
  handleInputBlur,
  setSelectedFoods,
  textStyle,
  smallTextStyle,
}) => {
  const factor = food.cantidad / 100;

  const [{ isDragging }, drag] = useDrag({
    type: "food",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "food",
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveFood(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  

  return (
    <div
      ref={drop}
      className={`bg-gray-50 p-3 rounded-md border border-gray-200 transition-all duration-200 ${
        isDragging
          ? "opacity-50 ring-2 ring-blue-400 z-50 shadow-lg"
          : "hover:bg-gray-100"
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        {/* Área arrastrable - solo el nombre del alimento */}
        <span
          ref={drag}
          className="font-medium cursor-move flex items-center"
          style={textStyle}
        >
          {food.nombre_alimento}
          <span className="ml-2 text-xs text-gray-500">↕️</span>
        </span>
        <button
          onClick={() =>
            setSelectedFoods((prev) => prev.filter((_, i) => i !== index))
          }
          className="text-red-500 hover:text-red-700 transition-colors duration-200"
          style={smallTextStyle}
        >
          ✕
        </button>
      </div>

      {/* Área no arrastrable - input de cantidad y información nutricional */}
      <div className="flex items-center mb-2">
        <label
          className="text-gray-600 mr-2 whitespace-nowrap"
          style={textStyle}
        >
          Cantidad (g):
        </label>
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
          className="w-20 border border-gray-300 rounded p-1"
          style={textStyle}
        />
      </div>

      <div
        className="text-gray-600 grid grid-cols-2 gap-1"
        style={smallTextStyle}
      >
        <div>
          Energía: {(safeParseFloat(food.energia) * factor).toFixed(1)}kcal
        </div>
        <div>
          Proteínas: {(safeParseFloat(food.proteinas) * factor).toFixed(1)}g
        </div>
        <div>Grasas: {(safeParseFloat(food.grasas) * factor).toFixed(1)}g</div>
        <div>
          Carbohidratos:{" "}
          {(safeParseFloat(food.carbohidratos_disp) * factor).toFixed(1)}g
        </div>
        {safeParseFloat(food.agua) > 0 && (
          <div>
            Agua: {(safeParseFloat(food.agua) * factor).toFixed(1)}
            ml
          </div>
        )}
      </div>

      <div className="mt-2 flex gap-2">
        {food.saciedad && (
          <span
            className={`inline-block px-2 py-1 rounded text-xs ${
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
          >
            Saciedad: {food.saciedad}
          </span>
        )}
        {food.glucemia && (
          <span
            className={`inline-block px-2 py-1 rounded text-xs ${
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
          >
            Glucemia: {food.glucemia}
          </span>
        )}
      </div>
    </div>
  );
};

// Componente principal
export const BusquedaComida = ({
  searchTerm,
  setSearchTerm,
  selectedFoods,
  setSelectedFoods,
  filtroSaciedad,
  setFiltroSaciedad,
  filtroGlucemia,
  setFiltroGlucemia,
  fontSize = 14
}) => {
  // Estilos dinámicos
  const textStyle = {
    fontSize: `${fontSize}px`,
  };

  const titleStyle = {
    fontSize: `${fontSize + 2}px`,
  };

  const smallTextStyle = {
    fontSize: `${fontSize - 2}px`,
  };

  // Filtrar alimentos
  const filteredFoods = useMemo(() => {
    if (!searchTerm) return [];
    
    return alimentosList.filter((food) => {
      const matchesSearch = normalizarValor(food.nombre_alimento).includes(normalizarValor(searchTerm));
      
      const matchesSaciedad = !filtroSaciedad || 
        (filtroSaciedad === "alto" && (
          normalizarValor(food.saciedad) === "alto" || 
          normalizarValor(food.saciedad) === "alta" ||
          normalizarValor(food.saciedad) === "high"
        )) ||
        (filtroSaciedad === "medio" && (
          normalizarValor(food.saciedad) === "medio" || 
          normalizarValor(food.saciedad) === "media" ||
          normalizarValor(food.saciedad) === "medium" ||
          normalizarValor(food.saciedad) === "moderado" ||
          normalizarValor(food.saciedad) === "moderada"
        )) ||
        (filtroSaciedad === "bajo" && (
          normalizarValor(food.saciedad) === "bajo" || 
          normalizarValor(food.saciedad) === "baja" ||
          normalizarValor(food.saciedad) === "low"
        ));
      
      const matchesGlucemia = !filtroGlucemia || 
        (filtroGlucemia === "alto" && (
          normalizarValor(food.glucemia) === "alto" || 
          normalizarValor(food.glucemia) === "alta" ||
          normalizarValor(food.glucemia) === "high"
        )) ||
        (filtroGlucemia === "medio" && (
          normalizarValor(food.glucemia) === "medio" || 
          normalizarValor(food.glucemia) === "media" ||
          normalizarValor(food.glucemia) === "medium" ||
          normalizarValor(food.glucemia) === "moderado" ||
          normalizarValor(food.glucemia) === "moderada"
        )) ||
        (filtroGlucemia === "bajo" && (
          normalizarValor(food.glucemia) === "bajo" || 
          normalizarValor(food.glucemia) === "baja" ||
          normalizarValor(food.glucemia) === "low"
        ));
      
      return matchesSearch && matchesSaciedad && matchesGlucemia;
    });
  }, [searchTerm, filtroSaciedad, filtroGlucemia]);

  // Mover alimento en la lista
  const moveFood = (fromIndex, toIndex) => {
    const newSelectedFoods = [...selectedFoods];
    const [movedFood] = newSelectedFoods.splice(fromIndex, 1);
    newSelectedFoods.splice(toIndex, 0, movedFood);
    setSelectedFoods(newSelectedFoods);
  };

  // Manejar selección de alimento
  const handleFoodSelect = (food) => {
    setSelectedFoods((prev) => [...prev, { ...food, cantidad: 100 }]);
    setSearchTerm("");
  };

  // Manejar cambio de cantidad
  const handleCantidadChange = (index, cantidad) => {
    setSelectedFoods((prev) =>
      prev.map((food, i) =>
        i === index ? { ...food, cantidad: Math.max(1, cantidad) } : food
      )
    );
  };

  // Manejar focus en input
  const handleInputFocus = (e) => {
    e.target.select();
  };

  // Manejar blur en input
  const handleInputBlur = (e, index) => {
    if (e.target.value === '' || parseInt(e.target.value) < 1) {
      handleCantidadChange(index, 100);
    }
  };

  // Limpiar todos los filtros
  const limpiarFiltros = () => {
    setFiltroSaciedad("");
    setFiltroGlucemia("");
    setSearchTerm("");
  };

  return (
    <div className="bg-white rounded-lg shadow p-3 md:p-4 h-full flex flex-col">
      <h2 className="font-semibold mb-2 text-gray-700" style={titleStyle}>
        Búsqueda de Alimentos
      </h2>

      {/* Filtros de saciedad y glucemia */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-gray-700 mb-1" style={textStyle}>
            Saciedad
          </label>
          <select
            value={filtroSaciedad}
            onChange={(e) => setFiltroSaciedad(e.target.value)}
            className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            style={textStyle}
          >
            <option value="">Todos</option>
            <option value="alto">Alta</option>
            <option value="medio">Media</option>
            <option value="bajo">Baja</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 mb-1" style={textStyle}>
            Glucemia
          </label>
          <select
            value={filtroGlucemia}
            onChange={(e) => setFiltroGlucemia(e.target.value)}
            className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            style={textStyle}
          >
            <option value="">Todos</option>
            <option value="alto">Alta</option>
            <option value="medio">Media</option>
            <option value="bajo">Baja</option>
          </select>
        </div>
      </div>

      {/* Botón para limpiar filtros */}
      {(filtroSaciedad || filtroGlucemia) && (
        <div className="mb-3">
          <button
            onClick={limpiarFiltros}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-md text-sm transition-colors"
            style={smallTextStyle}
          >
            Limpiar filtros
          </button>
        </div>
      )}

      <div className="relative mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Escriba el nombre de un alimento..."
          className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          style={textStyle}
        />

        {/* Información de filtros activos */}
        {(filtroSaciedad || filtroGlucemia) && (
          <div className="mt-2 flex flex-wrap gap-2">
            {filtroSaciedad && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full" style={smallTextStyle}>
                Saciedad: {filtroSaciedad === "alto" ? "Alta" : filtroSaciedad === "medio" ? "Media" : "Baja"}
              </span>
            )}
            {filtroGlucemia && (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full" style={smallTextStyle}>
                Glucemia: {filtroGlucemia === "alto" ? "Alta" : filtroGlucemia === "medio" ? "Media" : "Baja"}
              </span>
            )}
          </div>
        )}

        {/* Lista de sugerencias */}
        {searchTerm && filteredFoods.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto" style={textStyle}>
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
                    `Carbohidratos: ${safeParseFloat(food.carbohidratos_disp).toFixed(1)}g`}
                </div>
                <div className="mt-1">
                  {food.saciedad && (
                    <span
                      className={`inline-block px-2 py-1 rounded mr-2 ${
                        normalizarValor(food.saciedad) === "alto" || normalizarValor(food.saciedad) === "alta" || normalizarValor(food.saciedad) === "high"
                          ? "bg-green-100 text-green-800 border border-green-200"
                          : normalizarValor(food.saciedad) === "medio" || normalizarValor(food.saciedad) === "media" || normalizarValor(food.saciedad) === "medium"
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
                        normalizarValor(food.glucemia) === "alto" || normalizarValor(food.glucemia) === "alta" || normalizarValor(food.glucemia) === "high"
                          ? "bg-red-100 text-red-800 border border-red-200"
                          : normalizarValor(food.glucemia) === "medio" || normalizarValor(food.glucemia) === "media" || normalizarValor(food.glucemia) === "medium"
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
        )}

        {searchTerm && filteredFoods.length === 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-2 text-gray-500" style={textStyle}>
            {filtroSaciedad || filtroGlucemia 
              ? "No se encontraron alimentos con ese nombre que cumplan los filtros aplicados."
              : "No se encontraron alimentos con ese nombre."}
          </div>
        )}
      </div>

      {/* Alimentos seleccionados con react-dnd */}
      <div className="flex-grow overflow-y-auto">
        <h3 className="font-medium mb-2 text-gray-700" style={titleStyle}>
          Alimentos seleccionados ({selectedFoods.length})
        </h3>
        {selectedFoods.length === 0 ? (
          <p className="text-gray-500 italic" style={textStyle}>
            No hay alimentos seleccionados. Busque y seleccione alimentos arriba.
          </p>
        ) : (
          <div className="space-y-3">
            {selectedFoods.map((food, index) => (
              <DraggableFoodItem
                key={index}
                index={index}
                food={food}
                moveFood={moveFood}
                handleCantidadChange={handleCantidadChange}
                handleInputFocus={handleInputFocus}
                handleInputBlur={handleInputBlur}
                setSelectedFoods={setSelectedFoods}
                textStyle={textStyle}
                smallTextStyle={smallTextStyle}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BusquedaComida;