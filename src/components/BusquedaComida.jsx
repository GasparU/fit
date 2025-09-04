
// BusquedaComida.jsx
import { useMemo } from "react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { alimentosList } from "../firebase/lista";
import { applyFoodFilters } from "../utils/foodFilters";
import { DraggableFoodItem } from "./DraggableFoodItem";
import { FoodSuggestions } from "./FoodSuggestions";
import { ActiveFilters } from "./ActiveFilters";

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

  // Reemplazar lógica de filtrado
  const filteredFoods = useMemo(() => {
    if (!searchTerm) return [];
    return applyFoodFilters(
      alimentosList,
      searchTerm,
      filtroSaciedad,
      filtroGlucemia
    );
  }, [searchTerm, filtroSaciedad, filtroGlucemia]);

  // Mover alimento en la lista
 const handleDragEnd = (result) => {
   if (!result.destination) return;

   const items = Array.from(selectedFoods);
   const [reorderedItem] = items.splice(result.source.index, 1);
   items.splice(result.destination.index, 0, reorderedItem);

   setSelectedFoods(items);
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
    if (e.target.value === "" || parseInt(e.target.value) < 1) {
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
        <ActiveFilters
          filtroSaciedad={filtroSaciedad}
          filtroGlucemia={filtroGlucemia}
          smallTextStyle={smallTextStyle}
        />

        {/* Lista de sugerencias */}
        <FoodSuggestions
          searchTerm={searchTerm}
          filteredFoods={filteredFoods}
          filtroSaciedad={filtroSaciedad}
          filtroGlucemia={filtroGlucemia}
          handleFoodSelect={handleFoodSelect}
          textStyle={textStyle}
          smallTextStyle={smallTextStyle}
        />
      </div>

      {/* Alimentos seleccionados con react-beautiful-dnd */}
      <div className="flex-grow overflow-y-auto">
        <h3 className="font-medium mb-2 text-gray-700" style={titleStyle}>
          Alimentos seleccionados ({selectedFoods.length})
        </h3>
        {selectedFoods.length === 0 ? (
          <p className="text-gray-500 italic" style={textStyle}>
            No hay alimentos seleccionados. Busque y seleccione alimentos
            arriba.
          </p>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="selected-foods">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-3"
                >
                  {selectedFoods.map((food, index) => (
                    <DraggableFoodItem
                      key={index}
                      index={index}
                      food={food}
                      handleCantidadChange={handleCantidadChange}
                      handleInputFocus={handleInputFocus}
                      handleInputBlur={handleInputBlur}
                      setSelectedFoods={setSelectedFoods}
                      textStyle={textStyle}
                      smallTextStyle={smallTextStyle}
                    />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>
    </div>
  );
};

export default BusquedaComida;