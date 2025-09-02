import React from 'react'

export const ObjetivosPlanUser = ({
  textStyle,
  handleUserDataChange,
  userData,
  smallTextStyle,
}) => {
  return (
    <div>
      <div>
        <label className="block text-gray-700 mb-1" style={textStyle}>
          Objetivos del Plan
        </label>
        <select
          value={userData.objetivoPlan}
          onChange={(e) => handleUserDataChange("objetivoPlan", e.target.value)}
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
  );
};
