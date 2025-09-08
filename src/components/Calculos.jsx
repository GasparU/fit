import { useState } from "react";
import objetivosImg from '/objetivos.png'


export const Calculos = () => {
  const [peso, setPeso] = useState("");
  const [repeticiones, setRepeticiones] = useState("");
  const [resultados, setResultados] = useState({});
  const [objetivo, setObjetivo] = useState("");
  const [porcentaje, setPorcentaje] = useState("");
  const [resultadosObjetivo, setResultadosObjetivo] = useState({});

  const calcular1RM = () => {
    const P = parseFloat(peso);
    const R = parseFloat(repeticiones);

    if (isNaN(P) || isNaN(R) || P <= 0 || R <= 0) {
      alert("Por favor ingresa valores válidos para peso y repeticiones");
      return;
    }

    const calculos = {
      epley: P * (1 + 0.033 * R),
      lander: (100 * P) / (101.3 - 2.67123 * R),
      oconner: P / (1 + 0.025 * R),
      lombardi: P * Math.pow(R, 0.1),
      mayhew: (100 * P) / (52.2 + 41.9 * Math.exp(-0.055 * R)),
      brzycki: P / (1.0278 - 0.0278 * R),
      wathen: (100 * P) / (48.8 + 53.8 * Math.exp(-0.075 * R)),
      lesuer: (100 * P) / (48.8 + 53.8 * Math.exp(-0.075 * R)),
    };

    setResultados(calculos);

    // Calcular pesos según objetivo si está seleccionado
    if (objetivo && porcentaje) {
      const porcentajeNum = parseFloat(porcentaje);
      const resultadosObj = {};

      Object.keys(calculos).forEach((key) => {
        resultadosObj[key] = (calculos[key] * porcentajeNum) / 100;
      });

      setResultadosObjetivo(resultadosObj);
    } else {
      setResultadosObjetivo({});
    }
  };

  const reiniciarCalculos = () => {
    setPeso("");
    setRepeticiones("");
    setResultados({});
    setObjetivo("");
    setPorcentaje("");
    setResultadosObjetivo({});
  };

  const handleObjetivoChange = (e) => {
    const value = e.target.value;
    setObjetivo(value);
    setPorcentaje(""); // Resetear porcentaje al cambiar objetivo
  };

  const formulas = [
    {
      id: "epley",
      nombre: "Epley",
      formula: "1RM = P × (1 + (0.033 × R))",
      descripcion: "Bastante Precisa cuando 10 < R < 15",
    },
    {
      id: "lander",
      nombre: "Lander",
      formula: "1RM = (100 × P) / (101.3 - (2.67123 * R))",
      descripcion: "Fórmula general",
    },
    {
      id: "oconner",
      nombre: "O'Conner",
      formula: "1RM = P / (1 + (0.025 × R))",
      descripcion: "Fórmula simplificada",
    },
    {
      id: "lombardi",
      nombre: "Lombardi",
      formula: "1RM = P × R^0.10",
      descripcion: "Potencia fraccionaria",
    },
    {
      id: "mayhew",
      nombre: "Mayhew",
      formula: "1RM = (100 × P) / (52.2 + 41.9 × e^(-0.055 × R))",
      descripcion: "Press de banca",
    },
    {
      id: "brzycki",
      nombre: "Brzycki",
      formula: "1RM = P / (1.0278 - (0.0278 × R))",
      descripcion: "La más precisa cuando R ≤ 10",
    },
    {
      id: "wathen",
      nombre: "Wathen",
      formula: "1RM = (100 × P) / (48.8 + 53.8 × e^(-0.075 × R))",
      descripcion: "Regresión exponencial",
    },
    {
      id: "lesuer",
      nombre: "LeSuer",
      formula: "1RM = (100 × P) / (48.8 + 53.8 × e^(-0.075 × R))",
      descripcion: "Similar a Wathen",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-cyan-50 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Calculadora de 1RM (Una Repetición Máxima)
        </h1>

        {/* Inputs principales */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Datos de Entrada
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Peso (kg) *
              </label>
              <input
                type="number"
                value={peso}
                onChange={(e) => setPeso(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ej: 80"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Repeticiones *
              </label>
              <input
                type="number"
                value={repeticiones}
                onChange={(e) => setRepeticiones(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ej: 8"
                min="1"
                max="20"
              />
            </div>
            <div>
              <button
                onClick={calcular1RM}
                className="w-full bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg font-semibold transition duration-200"
              >
                Calcular
              </button>
            </div>
            <div>
              <button
                onClick={reiniciarCalculos}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white p-2 rounded-lg font-semibold transition duration-200"
              >
                Reiniciar
              </button>
            </div>
          </div>
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Objetivo *
              </label>
              <select
                value={objetivo}
                onChange={handleObjetivoChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Seleccionar objetivo</option>
                <option value="resistencia">Resistencia</option>
                <option value="hipertrofia">Hipertrofia</option>
                <option value="fuerza">Fuerza</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Porcentaje (
                {objetivo
                  ? `${
                      objetivo === "resistencia"
                        ? "40-60%"
                        : objetivo === "hipertrofia"
                        ? "60-80%"
                        : "80-100%"
                    }`
                  : "Selecciona objetivo"}
                ) *
              </label>
              <select
                value={porcentaje}
                onChange={(e) => setPorcentaje(e.target.value)}
                disabled={!objetivo}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50"
              >
                <option value="">Seleccionar %</option>
                {objetivo === "resistencia" && (
                  <>
                    <option value="40">40%</option>
                    <option value="45">45%</option>
                    <option value="50">50%</option>
                    <option value="55">55%</option>
                    <option value="60">60%</option>
                  </>
                )}
                {objetivo === "hipertrofia" && (
                  <>
                    <option value="60">60%</option>
                    <option value="65">65%</option>
                    <option value="70">70%</option>
                    <option value="75">75%</option>
                    <option value="80">80%</option>
                  </>
                )}
                {objetivo === "fuerza" && (
                  <>
                    <option value="80">80%</option>
                    <option value="85">85%</option>
                    <option value="90">90%</option>
                    <option value="95">95%</option>
                    <option value="100">100%</option>
                  </>
                )}
              </select>
            </div>
          </div>
        </div>

        {/* Resultados */}
        {Object.keys(resultados).length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Resultados
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {formulas.map((formula) => (
                <div
                  key={formula.id}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                >
                  <div className="flex justify-between content-center">
                    <div>
                      <h3 className="font-semibold text-green-600 text-lg mb-2">
                        {formula.nombre}
                      </h3>
                      <div className="text-2xl font-bold text-gray-800 mb-2">
                        {resultados[formula.id].toFixed(1)} kg
                      </div>
                    </div>
                    {resultadosObjetivo[formula.id] && (
                      <div className="border-gray-200 justify-items-center pt-0">
                        <h4 className="font-semibold text-blue-600 text-lg mb-1">
                          {objetivo.charAt(0).toUpperCase() + objetivo.slice(1)}{" "}
                          {/* ({porcentaje}%) */}
                        </h4>
                        <div className="text-lg font-bold text-blue-800 content-center mt-4">
                          {resultadosObjetivo[formula.id].toFixed(1)} kg
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 bg-white p-2 rounded border border-gray-200 mb-2">
                    {formula.formula}
                  </div>
                  <p className="text-sm text-gray-500">{formula.descripcion}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sección de información con gráfico */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Información de las fórmulas */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Fórmulas de Cálculo
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formulas.map((formula) => (
                <div
                  key={formula.id}
                  className="border-l-2 border-green-500 pl-3 py-2"
                >
                  <h3 className="font-semibold text-gray-800 text-sm">
                    {formula.nombre}
                  </h3>
                  <div className="bg-gray-100 p-2 rounded my-1 font-mono text-xs">
                    {formula.formula}
                  </div>
                  <p className="text-xs text-gray-600">{formula.descripcion}</p>
                  <div className="text-xs text-gray-500 mt-1">
                    <strong>Variables:</strong> P = Peso, R = Repeticiones al
                    fallo
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Objetivos de Entrenamiento
            </h2>
            <div className="flex justify-center">
              <img
                src={`${objetivosImg}?v=1`}
                alt="Tabla de objetivos de entrenamiento por porcentaje de 1RM"
                className="w-full max-w-md h-auto rounded-lg shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Leyenda */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
          <p className="text-sm text-yellow-700">
            Estas fórmulas son estimaciones. El 1RM real puede variar según
            factores como: experiencia del atleta, tipo de ejercicio, fatiga,
            técnica, etc. Se recomienda precaución al intentar levantar pesos
            máximos.
          </p>
        </div>
      </div>
    </div>
  );
};
