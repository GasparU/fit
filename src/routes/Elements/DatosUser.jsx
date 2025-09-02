import React from "react";

export const DatosUser = ({ userData, fontSize, handleUserDataChange }) => {
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

  return (
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
    </div>
  );
};
