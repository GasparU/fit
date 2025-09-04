// components/common/SaciedadBadge.jsx
export const SaciedadBadge = ({ nivel, fontSize = 12 }) => {
  const nivelNormalizado = nivel?.toLowerCase();

  let clase = "bg-gray-100 text-gray-800 border border-gray-200";
  if (
    nivelNormalizado?.includes("alto") ||
    nivelNormalizado?.includes("alta") ||
    nivelNormalizado?.includes("high")
  ) {
    clase = "bg-green-100 text-green-800 border border-green-200";
  } else if (
    nivelNormalizado?.includes("medio") ||
    nivelNormalizado?.includes("media") ||
    nivelNormalizado?.includes("medium")
  ) {
    clase = "bg-yellow-100 text-yellow-800 border border-yellow-200";
  } else if (
    nivelNormalizado?.includes("bajo") ||
    nivelNormalizado?.includes("baja") ||
    nivelNormalizado?.includes("low")
  ) {
    clase = "bg-red-100 text-red-800 border border-red-200";
  }

  return (
    <span
      className={`px-2 py-1 rounded ${clase}`}
      style={{ fontSize: `${fontSize}px` }}
    >
      Saciedad: {nivel}
    </span>
  );
};

// components/common/GlucemiaBadge.jsx
export const GlucemiaBadge = ({ nivel, fontSize = 12 }) => {
  const nivelNormalizado = nivel?.toLowerCase();

  let clase = "bg-gray-100 text-gray-800 border border-gray-200";
  if (
    nivelNormalizado?.includes("alto") ||
    nivelNormalizado?.includes("alta") ||
    nivelNormalizado?.includes("high")
  ) {
    clase = "bg-red-100 text-red-800 border border-red-200";
  } else if (
    nivelNormalizado?.includes("medio") ||
    nivelNormalizado?.includes("media") ||
    nivelNormalizado?.includes("medium")
  ) {
    clase = "bg-orange-100 text-orange-800 border border-orange-200";
  } else if (
    nivelNormalizado?.includes("bajo") ||
    nivelNormalizado?.includes("baja") ||
    nivelNormalizado?.includes("low")
  ) {
    clase = "bg-green-100 text-green-800 border border-green-200";
  }

  return (
    <span
      className={`px-2 py-1 rounded ${clase}`}
      style={{ fontSize: `${fontSize}px` }}
    >
      Glucemia: {nivel}
    </span>
  );
};
