// components/common/InputField.jsx
export const InputField = ({
  label,
  value,
  onChange,
  type = "number",
  min,
  max,
  step,
  placeholder,
  textStyle,
  smallText,
  ...props
}) => {
  return (
    <div>
      <label className="block text-gray-700 mb-1" style={textStyle}>
        {label}
        {smallText && (
          <span
            className="text-gray-500 ml-1"
            style={{ fontSize: `${parseInt(textStyle.fontSize) - 2}px` }}
          >
            {smallText}
          </span>
        )}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
        className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-300 focus:border-green-400 transition-all"
        style={textStyle}
        {...props}
      />
    </div>
  );
};
