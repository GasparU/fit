import React from 'react'

export const ImcUser = ({
  imcResult,
  handleUserDataChange,
  textStyle,
  smallTextStyle,
  userData,
}) => {
  return (
    <div>
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
    </div>
  );
};

