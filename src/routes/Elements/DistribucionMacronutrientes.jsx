import React from 'react'

export const DistribucionMacronutrientes = ({
  getMacroRanges,
  textStyle,
  userData,
  handleUserDataChange,
  smallTextStyle,
}) => {
  return (
    <>
      {userData.edad && userData.talla && userData.peso && (
        <>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h3 className="font-semibold text-gray-700 mb-2" style={textStyle}>
              Distribución de Macronutrientes
            </h3>

            <div>
              <label className="block text-gray-700 mb-1" style={textStyle}>
                Proteínas (g/kg)
                <span className="text-gray-500 ml-1" style={smallTextStyle}>
                  ({getMacroRanges().proteinas.min} a{" "}
                  {getMacroRanges().proteinas.max} g/kg -{" "}
                  {getMacroRanges().proteinas.porcentaje})
                </span>
              </label>
              <input
                type="number"
                min={getMacroRanges().proteinas.min}
                max={getMacroRanges().proteinas.max}
                step="0.1"
                value={userData.proteinas}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (
                    value >= getMacroRanges().proteinas.min &&
                    value <= getMacroRanges().proteinas.max
                  ) {
                    handleUserDataChange("proteinas", value);
                  }
                }}
                className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-300 focus:border-green-400 transition-all"
                style={textStyle}
              />
            </div>

            <div className="mt-2">
              <label className="block text-gray-700 mb-1" style={textStyle}>
                Carbohidratos (g/kg)
                <span className="text-gray-500 ml-1" style={smallTextStyle}>
                  ({getMacroRanges().carbohidratos.min} a{" "}
                  {getMacroRanges().carbohidratos.max} g/kg -{" "}
                  {getMacroRanges().carbohidratos.porcentaje})
                </span>
              </label>
              <input
                type="number"
                min={getMacroRanges().carbohidratos.min}
                max={getMacroRanges().carbohidratos.max}
                step="0.1"
                value={userData.carbohidratos}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (
                    value >= getMacroRanges().carbohidratos.min &&
                    value <= getMacroRanges().carbohidratos.max
                  ) {
                    handleUserDataChange("carbohidratos", value);
                  }
                }}
                className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-300 focus:border-green-400 transition-all"
                style={textStyle}
              />
            </div>

            <div className="mt-2">
              <label className="block text-gray-700 mb-1" style={textStyle}>
                Grasas (g/kg)
                <span className="text-gray-500 ml-1" style={smallTextStyle}>
                  ({getMacroRanges().grasas.min} a {getMacroRanges().grasas.max}{" "}
                  g/kg - {getMacroRanges().grasas.porcentaje})
                </span>
              </label>
              <input
                type="number"
                min={getMacroRanges().grasas.min}
                max={getMacroRanges().grasas.max}
                step="0.1"
                value={userData.grasas}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (
                    value >= getMacroRanges().grasas.min &&
                    value <= getMacroRanges().grasas.max
                  ) {
                    handleUserDataChange("grasas", value);
                  }
                }}
                className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-300 focus:border-green-400 transition-all"
                style={textStyle}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};
