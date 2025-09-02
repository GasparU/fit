import React from 'react'

export const Buttons = ({ fontSize, setFontSize }) => {
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
  return (
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
  );
};
