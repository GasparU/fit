

export const ActividadUser = ({
  handleUserDataChange,
  fontSize,
  userData,
  smallTextStyle,
}) => {
  const textStyle = {
    fontSize: `${fontSize}px`,
  };

  return (
    <div>
      <label className="block text-gray-700 mb-1" style={textStyle}>
        Días de actividad física por semana
      </label>
      <input
        type="number"
        min="0"
        max="7"
        value={userData.diasActividad}
        onChange={(e) => handleUserDataChange("diasActividad", e.target.value)}
        className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-300 focus:border-green-400 transition-all"
        style={textStyle}
      />
      <div className="text-gray-500 mt-1" style={smallTextStyle}>
        0: Sedentario | 2-3: Ligero | 4-5: Moderado | 6+: Intenso
      </div>
    </div>
  );
};
