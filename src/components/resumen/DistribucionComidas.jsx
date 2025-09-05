// DistribucionComidas.jsx (versión mejorada)
import { useState, useMemo } from "react";

export const DistribucionComidas = ({ caloriasObjetivo, fontSize = 14 }) => {
  const [numeroComidas, setNumeroComidas] = useState(3);

  // Definir las distribuciones
  const distribuciones = useMemo(() => {
    return {
      3: [
        {
          nombre: "Desayuno",
          porcentaje: 30,
          color: "bg-orange-100",
          textColor: "text-orange-800",
          borderColor: "border-orange-200",
          hoverColor: "hover:bg-orange-200",
          icon: "🌅",
        },
        {
          nombre: "Almuerzo",
          porcentaje: 40,
          color: "bg-green-100",
          textColor: "text-green-800",
          borderColor: "border-green-200",
          hoverColor: "hover:bg-green-200",
          icon: "🍽️",
        },
        {
          nombre: "Cena",
          porcentaje: 30,
          color: "bg-blue-100",
          textColor: "text-blue-800",
          borderColor: "border-blue-200",
          hoverColor: "hover:bg-blue-200",
          icon: "🌙",
        },
      ],
      5: [
        {
          nombre: "Desayuno",
          porcentaje: 20,
          color: "bg-orange-100",
          textColor: "text-orange-800",
          borderColor: "border-orange-200",
          hoverColor: "hover:bg-orange-200",
          icon: "🌅",
        },
        {
          nombre: "Merienda Matutina",
          porcentaje: 10,
          color: "bg-yellow-100",
          textColor: "text-yellow-800",
          borderColor: "border-yellow-200",
          hoverColor: "hover:bg-yellow-200",
          icon: "☕",
        },
        {
          nombre: "Almuerzo",
          porcentaje: 35,
          color: "bg-green-100",
          textColor: "text-green-800",
          borderColor: "border-green-200",
          hoverColor: "hover:bg-green-200",
          icon: "🍽️",
        },
        {
          nombre: "Merienda Vespertina",
          porcentaje: 10,
          color: "bg-purple-100",
          textColor: "text-purple-800",
          borderColor: "border-purple-200",
          hoverColor: "hover:bg-purple-200",
          icon: "🍎",
        },
        {
          nombre: "Cena",
          porcentaje: 25,
          color: "bg-blue-100",
          textColor: "text-blue-800",
          borderColor: "border-blue-200",
          hoverColor: "hover:bg-blue-200",
          icon: "🌙",
        },
      ],
    };
  }, []);

  // Calcular calorías por comida
  const comidasConCalorias = useMemo(() => {
    if (!caloriasObjetivo || caloriasObjetivo <= 0) return [];

    return distribuciones[numeroComidas].map((comida) => ({
      ...comida,
      calorias: Math.round((caloriasObjetivo * comida.porcentaje) / 100),
    }));
  }, [caloriasObjetivo, numeroComidas, distribuciones]);

  // Estilos dinámicos
  const textStyle = {
    fontSize: `${fontSize}px`,
  };

  const titleStyle = {
    fontSize: `${fontSize + 2}px`,
  };

  const numberStyle = {
    fontSize: `${fontSize + 2}px`,
  };

  const smallTextStyle = {
    fontSize: `${fontSize - 2}px`,
  };

  return (
    <div className="mt-6 border-t pt-6">
      <div className="flex justify-between items-center mb-6">
        <h3
          className="font-semibold text-gray-800 flex items-center"
          style={titleStyle}
        >
          <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-2 rounded-lg mr-3">
            📊
          </span>
          Distribución por Comidas
        </h3>

        <div className="flex items-center space-x-2 bg-white rounded-full shadow-sm p-1 border">
          <span className="text-gray-600 px-2" style={smallTextStyle}>
            Comidas:
          </span>
          <div className="flex bg-gray-100 rounded-full p-1">
            <button
              onClick={() => setNumeroComidas(3)}
              className={`px-4 py-2 rounded-full transition-all duration-300 transform hover:scale-105 ${
                numeroComidas === 3
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
              style={smallTextStyle}
            >
              3
            </button>
            <button
              onClick={() => setNumeroComidas(5)}
              className={`px-4 py-2 rounded-full transition-all duration-300 transform hover:scale-105 ${
                numeroComidas === 5
                  ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
              style={smallTextStyle}
            >
              5
            </button>
          </div>
        </div>
      </div>

      {caloriasObjetivo && caloriasObjetivo > 0 ? (
        <>
          {/* Tarjeta de calorías objetivo */}
          <div className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-100 shadow-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium" style={textStyle}>
                Calorías objetivo totales:
              </span>
              <span
                className="font-bold text-blue-600 bg-white px-3 py-1 rounded-full shadow-sm"
                style={numberStyle}
              >
                {caloriasObjetivo} kcal
              </span>
            </div>
          </div>

          {/* Tabla elegante */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Header de la tabla */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 grid grid-cols-12 p-4 border-b border-gray-200">
              <div
                className="col-span-5 font-semibold text-gray-700"
                style={textStyle}
              >
                Comida
              </div>
              <div
                className="col-span-3 font-semibold text-gray-700 text-right"
                style={textStyle}
              >
                Porcentaje
              </div>
              <div
                className="col-span-4 font-semibold text-gray-700 text-right"
                style={textStyle}
              >
                Calorías
              </div>
            </div>

            {/* Filas de la tabla */}
            <div className="divide-y divide-gray-100">
              {comidasConCalorias.map((comida, index) => (
                <div
                  key={index}
                  className={`grid grid-cols-12 p-4 transition-all duration-300 hover:shadow-md hover:transform hover:scale-[1.02] ${comida.hoverColor} ${comida.color}`}
                >
                  <div className="col-span-5 flex items-center">
                    <span className="text-xl mr-3">{comida.icon}</span>
                    <span
                      className={`font-medium ${comida.textColor}`}
                      style={textStyle}
                    >
                      {comida.nombre}
                    </span>
                  </div>
                  <div className="col-span-3 flex items-center justify-end">
                    <span
                      className="bg-white px-3 py-1 rounded-full text-gray-600 border border-gray-200 shadow-sm"
                      style={smallTextStyle}
                    >
                      {comida.porcentaje}%
                    </span>
                  </div>
                  <div className="col-span-4 flex items-center justify-end">
                    <span
                      className="font-bold text-gray-800 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm"
                      style={numberStyle}
                    >
                      {comida.calorias} kcal
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer de la tabla */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 grid grid-cols-12 p-4 border-t border-gray-200 font-semibold">
              <div className="col-span-5 text-gray-700" style={textStyle}>
                Total
              </div>
              <div
                className="col-span-3 text-gray-700 text-right"
                style={textStyle}
              >
                100%
              </div>
              <div
                className="col-span-4 text-blue-600 text-right"
                style={numberStyle}
              >
                {caloriasObjetivo} kcal
              </div>
            </div>
          </div>

          {/* Cards de consejos */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-100 shadow-sm">
              <div className="flex items-start">
                <span className="text-2xl mr-3">💡</span>
                <div>
                  <h4
                    className="font-semibold text-blue-800 mb-1"
                    style={textStyle}
                  >
                    Consejo de distribución
                  </h4>
                  <p className="text-blue-700" style={smallTextStyle}>
                    Distribuir las calorías en {numeroComidas} comidas ayuda a
                    mantener estables los niveles de energía durante el día y
                    evita picos de hambre.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100 shadow-sm">
              <div className="flex items-start">
                <span className="text-2xl mr-3">⚖️</span>
                <div>
                  <h4
                    className="font-semibold text-green-800 mb-1"
                    style={textStyle}
                  >
                    Personalización
                  </h4>
                  <p className="text-green-700" style={smallTextStyle}>
                    Estos porcentajes son recomendaciones generales. Ajusta
                    según tus preferencias, horarios y necesidades personales.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Barra de progreso visual */}
          <div className="mt-6">
            <h4 className="font-semibold text-gray-700 mb-3" style={textStyle}>
              Distribución visual:
            </h4>
            <div className="flex h-6 bg-gray-200 rounded-full overflow-hidden shadow-inner">
              {comidasConCalorias.map((comida, index) => (
                <div
                  key={index}
                  className={`h-full transition-all duration-500 ease-out ${comida.color} ${comida.borderColor} border-r`}
                  style={{ width: `${comida.porcentaje}%` }}
                  title={`${comida.nombre}: ${comida.porcentaje}%`}
                />
              ))}
            </div>
            <div className="flex justify-between mt-2">
              {comidasConCalorias.map((comida, index) => (
                <span
                  key={index}
                  className={`text-xs ${comida.textColor}`}
                  style={smallTextStyle}
                >
                  {comida.porcentaje}%
                </span>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div
          className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl border border-gray-200"
          style={textStyle}
        >
          <div className="text-4xl mb-2">📊</div>
          Complete los datos del usuario para calcular la distribución de
          calorías.
        </div>
      )}
    </div>
  );
};
