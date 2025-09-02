// Home.jsx
import { useState } from "react";
import { Resultados } from "../components/Resultados";
import { BusquedaComida } from "../components/BusquedaComida";
import { ResumenNutricional } from "../components/ResumenNutricional";
import { useCalculosNutricionales } from "../hooks/useCalculosNutricionales";
import { useCalculosCardio } from "../hooks/useCalculosCardio";

export const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [filtroSaciedad, setFiltroSaciedad] = useState("");
  const [filtroGlucemia, setFiltroGlucemia] = useState("");
  const [fontSize, setFontSize] = useState(14);
  const [userData, setUserData] = useState({
    edad: "",
    sexo: "hombre",
    talla: "",
    peso: "",
    imcObjetivo: 22,
    diasActividad: 0,
    porcentajeCardio: 70,
    objetivoPlan: "recomposicion",
    porcentajeObjetivo: 10,
  });

  const {
    imcResult,
    tmbResult,
    energiaTotalResult,
    tdeeResult,
    aguaResult,
    grasaCorporalResult,
  } = useCalculosNutricionales(userData);

  const { cardioResult, objetivoResult } = useCalculosCardio(
    userData,
    energiaTotalResult
  );

  const [columnOrder, setColumnOrder] = useState([
    "resultados",
    "busqueda",
    "resumen",
  ]);

  const handleUserDataChange = (field, value) => {
    setUserData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const increaseFontSize = () => {
    if (fontSize < 28) {
      setFontSize(fontSize + 2);
    }
  };

  const decreaseFontSize = () => {
    if (fontSize > 14) {
      setFontSize(fontSize - 2);
    }
  };

  // Manejador para el fin del arrastre
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const fromIndex = result.source.index;
    const toIndex = result.destination.index;

    if (fromIndex === toIndex) return;

    const newOrder = [...columnOrder];
    const [movedColumn] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, movedColumn);

    setColumnOrder(newOrder);
  };

  // Estilos dinámicos para todas las columnas
  const textStyle = {
    fontSize: `${fontSize}px`,
  };

  const titleStyle = {
    fontSize: `${fontSize + 2}px`,
  };

  const numberStyle = {
    fontSize: `${fontSize + 4}px`,
  };

  const smallTextStyle = {
    fontSize: `${fontSize - 2}px`,
  };

  // Mapeo de IDs de columnas a componentes
  const columnComponents = {
    resultados: (
      <div className="bg-white rounded-lg shadow p-3 md:p-4 h-full">
        <Resultados
          imcResult={imcResult}
          tmbResult={tmbResult}
          tdeeResult={tdeeResult}
          objetivoResult={objetivoResult}
          energiaTotalResult={energiaTotalResult}
          aguaResult={aguaResult}
          grasaCorporalResult={grasaCorporalResult}
          cardioResult={cardioResult}
          userData={userData}
          fontSize={fontSize}
        />
      </div>
    ),
    busqueda: (
      <div className="bg-white rounded-lg shadow p-3 md:p-4 h-full">
        <BusquedaComida
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedFoods={selectedFoods}
          setSelectedFoods={setSelectedFoods}
          filtroSaciedad={filtroSaciedad}
          setFiltroSaciedad={setFiltroSaciedad}
          filtroGlucemia={filtroGlucemia}
          setFiltroGlucemia={setFiltroGlucemia}
          fontSize={fontSize}
        />
      </div>
    ),
    resumen: (
      <div className="bg-white rounded-lg shadow p-3 md:p-4 h-full">
        <ResumenNutricional selectedFoods={selectedFoods} fontSize={fontSize} />
      </div>
    ),
  };

  // Títulos de las columnas
  const columnTitles = {
    resultados: "Resultados",
    busqueda: "Búsqueda de Alimentos",
    resumen: "Resumen Nutricional",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-cyan-50 p-2 md:p-4">
      {/* Encabezado con colores llamativos */}
      <header className="text-center mb-4 py-3 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg shadow-md">
        <h1 className="text-xl md:text-2xl font-bold text-white">
          Herramienta Nutricional para Gimnasio
        </h1>
        <p className="text-white text-sm md:text-base mt-1">
          Herramienta para profesionales de la salud y fitness
        </p>
      </header>

      {/* Botones de control de tamaño a la izquierda */}
      <div className="flex justify-start mb-3">
        <div className="bg-white rounded-lg shadow-sm p-2 flex items-center">
          <span className="text-gray-600 mr-2 text-sm">Tamaño de texto:</span>
          <button
            onClick={decreaseFontSize}
            disabled={fontSize <= 14}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full w-7 h-7 flex items-center justify-center mr-1 text-xs disabled:opacity-50"
          >
            A-
          </button>
          <button
            onClick={increaseFontSize}
            disabled={fontSize >= 28}
            className="bg-green-500 hover:bg-green-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs disabled:opacity-50"
          >
            A+
          </button>
          <span className="text-gray-600 ml-2 text-xs">{fontSize}px</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {/* Columna 1: Datos del usuario */}
        <div className="bg-white rounded-lg shadow p-3 md:p-4 flex flex-col">
          <h2 className="font-semibold mb-2 text-gray-700" style={titleStyle}>
            Datos del Usuario
          </h2>

          <div className="space-y-2 flex-grow overflow-y-auto">
            <div>
              <label className="block text-gray-700 mb-1" style={textStyle}>
                Edad
              </label>
              <input
                type="number"
                value={userData.edad}
                onChange={(e) => handleUserDataChange("edad", e.target.value)}
                className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-300 focus:border-green-400 transition-all"
                placeholder="Años"
                style={textStyle}
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1" style={textStyle}>
                Sexo
              </label>
              <select
                value={userData.sexo}
                onChange={(e) => handleUserDataChange("sexo", e.target.value)}
                className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-300 focus:border-green-400 transition-all"
                style={textStyle}
              >
                <option value="hombre">Hombre</option>
                <option value="mujer">Mujer</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-1" style={textStyle}>
                Talla (cm)
              </label>
              <input
                type="number"
                value={userData.talla}
                onChange={(e) => handleUserDataChange("talla", e.target.value)}
                className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-300 focus:border-green-400 transition-all"
                placeholder="Centímetros"
                style={textStyle}
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1" style={textStyle}>
                Peso (kg)
              </label>
              <input
                type="number"
                value={userData.peso}
                onChange={(e) => handleUserDataChange("peso", e.target.value)}
                className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-300 focus:border-green-400 transition-all"
                placeholder="Kilogramos"
                style={textStyle}
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1" style={textStyle}>
                Días de actividad física por semana
              </label>
              <input
                type="number"
                min="0"
                max="7"
                value={userData.diasActividad}
                onChange={(e) =>
                  handleUserDataChange("diasActividad", e.target.value)
                }
                className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-300 focus:border-green-400 transition-all"
                style={textStyle}
              />
              <div className="text-gray-500 mt-1" style={smallTextStyle}>
                0: Sedentario | 2-3: Ligero | 4-5: Moderado | 6+: Intenso
              </div>
            </div>

            {imcResult && parseFloat(imcResult.value) >= 30 && (
              <div>
                <label className="block text-gray-700 mb-1" style={textStyle}>
                  IMC Objetivo (18.5-24.9)
                  <span className="text-gray-500 ml-1" style={smallTextStyle}>
                    (para cálculo de TMB en obesidad)
                  </span>
                </label>
                <input
                  type="number"
                  min="18.5"
                  max="24.9"
                  step="0.1"
                  value={userData.imcObjetivo}
                  onChange={(e) =>
                    handleUserDataChange("imcObjetivo", e.target.value)
                  }
                  className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-300 focus:border-green-400 transition-all"
                  style={textStyle}
                />
              </div>
            )}

            <div>
              <label className="block text-gray-700 mb-1" style={textStyle}>
                Frecuencia Cardiaca Objetivo
              </label>
              <select
                value={userData.porcentajeCardio}
                onChange={(e) =>
                  handleUserDataChange("porcentajeCardio", e.target.value)
                }
                className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-300 focus:border-green-400 transition-all"
                style={textStyle}
              >
                <option value="55">50-60% (Muy Suave)</option>
                <option value="65">61-70% (Suave)</option>
                <option value="75">71-80% (Moderado)</option>
                <option value="85">81-90% (Intenso)</option>
                <option value="95">91-100% (Máximo)</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-1" style={textStyle}>
                Objetivos del Plan
              </label>
              <select
                value={userData.objetivoPlan}
                onChange={(e) =>
                  handleUserDataChange("objetivoPlan", e.target.value)
                }
                className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-300 focus:border-green-400 transition-all"
                style={textStyle}
              >
                <option value="recomposicion">Recomposición Corporal</option>
                <option value="deficit">Déficit Calórico</option>
                <option value="aumento">Aumento de Masa Muscular</option>
              </select>
            </div>

            {(userData.objetivoPlan === "deficit" ||
              userData.objetivoPlan === "aumento") && (
              <div>
                <label className="block text-gray-700 mb-1" style={textStyle}>
                  {userData.objetivoPlan === "deficit"
                    ? "Déficit Calórico"
                    : "Superávit Calórico"}{" "}
                  (%)
                </label>
                <select
                  value={userData.porcentajeObjetivo}
                  onChange={(e) =>
                    handleUserDataChange("porcentajeObjetivo", e.target.value)
                  }
                  className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-300 focus:border-green-400 transition-all"
                  style={textStyle}
                >
                  <option value="5">5%</option>
                  <option value="10">10%</option>
                  <option value="15">15%</option>
                  <option value="20">20%</option>
                  <option value="25">25%</option>
                </select>
                <div className="text-gray-500 mt-1" style={smallTextStyle}>
                  {userData.objetivoPlan === "deficit"
                    ? "Porcentaje de reducción calórica para pérdida de grasa"
                    : "Porcentaje de aumento calórico para ganancia muscular"}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Columna 2: Resultados */}
        <div className="bg-white rounded-lg shadow p-3 md:p-4">
          <Resultados
            imcResult={imcResult}
            tmbResult={tmbResult}
            tdeeResult={tdeeResult}
            objetivoResult={objetivoResult}
            energiaTotalResult={energiaTotalResult}
            aguaResult={aguaResult}
            grasaCorporalResult={grasaCorporalResult}
            cardioResult={cardioResult}
            userData={userData}
            fontSize={fontSize}
          />
        </div>

        {/* Columna 3: Búsqueda de alimentos */}
        <div className="bg-white rounded-lg shadow p-3 md:p-4">
          <BusquedaComida
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedFoods={selectedFoods}
            setSelectedFoods={setSelectedFoods}
            filtroSaciedad={filtroSaciedad}
            setFiltroSaciedad={setFiltroSaciedad}
            filtroGlucemia={filtroGlucemia}
            setFiltroGlucemia={setFiltroGlucemia}
            fontSize={fontSize}
          />
        </div>

        {/* Columna 4: Resumen nutricional */}
        <div className="bg-white rounded-lg shadow p-3 md:p-4">
          <ResumenNutricional
            selectedFoods={selectedFoods}
            fontSize={fontSize}
          />
        </div>
      </div>
    </div>
  );
};
