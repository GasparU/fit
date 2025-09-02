// Home.jsx
import { useState } from "react";
import { Resultados } from "../components/Resultados";
import { BusquedaComida } from "../components/BusquedaComida";
import { ResumenNutricional } from "../components/ResumenNutricional";
import { useCalculosNutricionales } from "../hooks/useCalculosNutricionales";
import { useCalculosCardio } from "../hooks/useCalculosCardio";
import { Buttons } from "./Elements/Buttons";
import { DatosUser } from "./Elements/DatosUser";
import { ActividadUser } from "./Elements/ActividadUser";
import { ImcUser } from "./Elements/ImcUser";
import { FrecuenciaCardiacaUser } from "./Elements/FrecuenciaCardiacaUser";
import { ObjetivosPlanUser } from "./Elements/ObjetivosPlanUser";
import { DistribucionMacronutrientes } from "./Elements/DistribucionMacronutrientes";

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
  proteinas: "",
  carbohidratos: "",
  grasas: ""
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
  // Función para calcular los rangos de macronutrientes según el objetivo
  const getMacroRanges = () => {
    switch (userData.objetivoPlan) {
      case "deficit":
        return {
          proteinas: { min: 1.6, max: 2.4, porcentaje: "20-30%" },
          carbohidratos: { min: 3, max: 4, porcentaje: "40-50%" },
          grasas: { min: 0.8, max: 1, porcentaje: "20-30%" },
        };
      case "recomposicion":
        return {
          proteinas: { min: 1.7, max: 2.4, porcentaje: "25-30%" },
          carbohidratos: { min: 4, max: 5, porcentaje: "40-50%" },
          grasas: { min: 0.5, max: 0.5, porcentaje: "15-25%" },
        };
      case "aumento":
        return {
          proteinas: { min: 1.6, max: 2.4, porcentaje: "20-30%" },
          carbohidratos: { min: 5, max: 6, porcentaje: "45-55%" },
          grasas: { min: 0.5, max: 0.5, porcentaje: "20-30%" },
        };
      default:
        return {
          proteinas: { min: 1.6, max: 2.4, porcentaje: "20-30%" },
          carbohidratos: { min: 3, max: 4, porcentaje: "40-50%" },
          grasas: { min: 0.8, max: 1, porcentaje: "20-30%" },
        };
    }
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

      <Buttons
        fontSize={fontSize}
        handleUserDataChange={handleUserDataChange}
        userData={userData}
        setFontSize={setFontSize}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {/* Columna 1: Datos del usuario */}
        <div className="bg-white rounded-lg shadow p-3 md:p-4 flex flex-col">
          <h2 className="font-semibold mb-2 text-gray-700" style={titleStyle}>
            Datos del Usuario
          </h2>

          <div className="space-y-2 flex-grow overflow-y-auto">
            <DatosUser
              userData={userData}
              fontSize={fontSize}
              handleUserDataChange={handleUserDataChange}
            />

            <ActividadUser
              userData={userData}
              handleUserDataChange={handleUserDataChange}
              fontSize={fontSize}
              textStyle={textStyle}
              smallTextStyle={smallTextStyle}
            />

            <ImcUser
              userData={userData}
              smallTextStyle={smallTextStyle}
              imcResult={imcResult}
              textStyle={textStyle}
              handleUserDataChange={handleUserDataChange}
            />

            <FrecuenciaCardiacaUser
              handleUserDataChange={handleUserDataChange}
              userData={userData}
              textStyle={textStyle}
            />

            <ObjetivosPlanUser
              textStyle={textStyle}
              handleUserDataChange={handleUserDataChange}
              userData={userData}
              smallTextStyle={smallTextStyle}
            />

            <DistribucionMacronutrientes
              getMacroRanges={getMacroRanges}
              textStyle={textStyle}
              userData={userData}
              handleUserDataChange={handleUserDataChange}
              smallTextStyle={smallTextStyle}
            />
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
            userData={userData}
            grasaCorporalResult={grasaCorporalResult}
            fontSize={fontSize}
          />
        </div>
      </div>
    </div>
  );
};
