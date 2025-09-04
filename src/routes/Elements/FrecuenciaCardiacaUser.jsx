import React from "react";

export const FrecuenciaCardiacaUser = ({
  handleUserDataChange,
  userData,
  textStyle,
}) => {
  const handleCardioChange = (e) => {
    const selectedValue = e.target.value;
    let nivel = "Moderado";

    // Determinar el nivel basado en el valor seleccionado
    if (selectedValue === "55") nivel = "Muy Suave";
    else if (selectedValue === "65") nivel = "Suave";
    else if (selectedValue === "75") nivel = "Moderado";
    else if (selectedValue === "85") nivel = "Intenso";
    else if (selectedValue === "95") nivel = "Máximo";

    handleUserDataChange("porcentajeCardio", selectedValue);
    handleUserDataChange("nivelCardio", nivel);
  };

  return (
    <div>
      <label className="block text-gray-700 mb-1" style={textStyle}>
        Frecuencia Cardiaca Objetivo
      </label>
      <select
        value={userData.porcentajeCardio || "75"}
        onChange={handleCardioChange}
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
  );
};
