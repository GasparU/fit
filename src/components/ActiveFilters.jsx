// ActiveFilters.jsx
export const ActiveFilters = ({
  filtroSaciedad,
  filtroGlucemia,
  smallTextStyle,
}) => {
  if (!filtroSaciedad && !filtroGlucemia) return null;

  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {filtroSaciedad && (
        <span
          className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
          style={smallTextStyle}
        >
          Saciedad:{" "}
          {filtroSaciedad === "alto"
            ? "Alta"
            : filtroSaciedad === "medio"
            ? "Media"
            : "Baja"}
        </span>
      )}
      {filtroGlucemia && (
        <span
          className="bg-green-100 text-green-800 px-2 py-1 rounded-full"
          style={smallTextStyle}
        >
          Glucemia:{" "}
          {filtroGlucemia === "alto"
            ? "Alta"
            : filtroGlucemia === "medio"
            ? "Media"
            : "Baja"}
        </span>
      )}
    </div>
  );
};
