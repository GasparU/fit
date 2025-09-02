import { useState } from "react";

// Resultados.jsx - REEMPLAZA TODO el código del componente con esto:
export const Resultados = ({
  imcResult,
  tmbResult,
  tdeeResult,
  objetivoResult, // Cambiado de deficitResult a objetivoResult
  aguaResult,
  energiaTotalResult,
  grasaCorporalResult,
  cardioResult,
  userData,
  fontSize = 14,
}) => {
  // Obtener información de zona de frecuencia cardíaca
  const getZonaInfo = (nivel) => {
    if (nivel === "Muy Suave")
      return {
        nombre: "Muy Suave",
        beneficio: "Ayuda a la Recuperación Post-Esfuerzo",
        combustible: "Caminar",
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
      };
    if (nivel === "Suave")
      return {
        nombre: "Suave",
        beneficio: "Mejora la Resistencia Básica y la Quema de grasas",
        combustible: "Grasas",
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
      };
    if (nivel === "Moderado")
      return {
        nombre: "Moderado",
        beneficio: "Mejora la Resistencia Aeróbica",
        combustible: "Glucógeno Principalmente y Grasa",
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
      };
    if (nivel === "Intenso")
      return {
        nombre: "Intenso",
        beneficio: "Incrementa la Resistencia Anaeróbica en sesiones cortas",
        combustible: "Glucógeno",
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-200",
      };
    return {
      nombre: "Máximo",
      beneficio: "Mejora la Velocidad y Tonifica el Sistema Neuromuscular",
      combustible: "Fosfato de creatina",
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    };
  };

  // Función para verificar si un resultado existe y tiene valor
  const hasValue = (result) => {
    return (
      result &&
      result.value !== undefined &&
      result.value !== null &&
      result.value !== ""
    );
  };

  // Verificar y formatear los resultados de cardio
  const getCardioDisplayValues = () => {
    if (!cardioResult) return null;

    // Diferentes estructuras posibles para cardioResult
    if (cardioResult.rangoMin && cardioResult.rangoMax) {
      return {
        rangoMin: cardioResult.rangoMin,
        rangoMax: cardioResult.rangoMax,
        rango:
          cardioResult.rango ||
          `${cardioResult.rangoMin}-${cardioResult.rangoMax} ppm`,
        nivel: cardioResult.nivel,
        formula: cardioResult.formula,
      };
    } else if (cardioResult.value && cardioResult.porcentaje) {
      // Si viene en el formato antiguo (value y porcentaje)
      const rangoMin = Math.round(cardioResult.value * 0.9);
      const rangoMax = Math.round(cardioResult.value * 1.1);
      return {
        rangoMin,
        rangoMax,
        rango: `${rangoMin}-${rangoMax} ppm`,
        nivel: cardioResult.nivel || "Moderado",
        formula: cardioResult.formula || "Frecuencia Cardíaca Objetivo",
      };
    } else if (cardioResult.value) {
      // Si solo viene el valor
      return {
        rangoMin: Math.round(cardioResult.value * 0.9),
        rangoMax: Math.round(cardioResult.value * 1.1),
        rango: `${Math.round(cardioResult.value * 0.9)}-${Math.round(
          cardioResult.value * 1.1
        )} ppm`,
        nivel: "Moderado",
        formula: "Frecuencia Cardíaca Objetivo",
      };
    }

    return null;
  };

  const cardioDisplayValues = getCardioDisplayValues();
  const zonaCardio = cardioDisplayValues
    ? getZonaInfo(cardioDisplayValues.nivel)
    : null;

  // Función para verificar y formatear el resultado de objetivo
  const getObjetivoDisplayValues = () => {
    if (!objetivoResult) return null;

    // Si ya tiene la estructura correcta
    if (objetivoResult.tipo && objetivoResult.final) {
      return objetivoResult;
    }

    // Si viene en formato antiguo (deficit)
    if (objetivoResult.deficit !== undefined) {
      return {
        tipo: "deficit",
        final: objetivoResult.deficit,
        porcentaje: objetivoResult.porcentaje || 0,
        deficit: objetivoResult.deficitValue || 0,
      };
    }

    // Si viene en formato antiguo (aumento)
    if (objetivoResult.aumento !== undefined) {
      return {
        tipo: "aumento",
        final: objetivoResult.aumento,
        porcentaje: objetivoResult.porcentaje || 0,
        aumento: objetivoResult.aumentoValue || 0,
      };
    }

    return null;
  };

  const objetivoDisplayValues = getObjetivoDisplayValues();

  // Estado para el orden de los elementos
  const [elementOrder, setElementOrder] = useState([
    "imc",
    "tmb",
    "tdee",
    "energiaTotal",
    "objetivo",
    "agua",
    "grasa",
    "cardio", 
  ]);

  // Estado para el arrastre
  const [draggingId, setDraggingId] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);

  // Handlers para drag and drop
  const handleDragStart = (e, id) => {
    setDraggingId(id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDragOver = (e, id) => {
    e.preventDefault();
    if (id !== dragOverId) {
      setDragOverId(id);
    }
  };

  const handleDragEnd = () => {
    setDraggingId(null);
    setDragOverId(null);
  };

  const handleDrop = (e, targetId) => {
    e.preventDefault();
    const sourceId = e.dataTransfer.getData("text/plain");

    if (sourceId !== targetId) {
      const newOrder = [...elementOrder];
      const sourceIndex = newOrder.indexOf(sourceId);
      const targetIndex = newOrder.indexOf(targetId);

      newOrder.splice(sourceIndex, 1);
      newOrder.splice(targetIndex, 0, sourceId);

      setElementOrder(newOrder);
    }

    setDraggingId(null);
    setDragOverId(null);
  };

  // Reiniciar al orden original
  const resetOrder = () => {
    setElementOrder([
      "imc",
      "tmb",
      "tdee",
      "objetivo",
      "energiaTotal",
      "agua",
      "grasa",
      "cardio",
    ]); // Cambiado 'deficit' por 'objetivo'
  };

  // Estilos dinámicos para el texto
  const textStyle = {
    fontSize: `${fontSize}px`,
  };

  const titleStyle = {
    fontSize: `${fontSize + 2}px`,
  };

  const numberStyle = {
    fontSize: `${fontSize + 4}px`,
  };

  // Mapeo de IDs a componentes
  const componentMap = {
    imc: hasValue(imcResult) && (
      <div
        key="imc"
        draggable
        onDragStart={(e) => handleDragStart(e, "imc")}
        onDragOver={(e) => handleDragOver(e, "imc")}
        onDragEnd={handleDragEnd}
        onDrop={(e) => handleDrop(e, "imc")}
        className={`p-2 rounded-md border transition-all duration-500 ease-in-out ${
          imcResult.colorClass || "bg-gray-50 border-gray-200"
        } ${draggingId === "imc" ? "opacity-50" : ""} ${
          dragOverId === "imc" ? "border-2 border-dashed border-blue-400" : ""
        }`}
      >
        <h3 className="font-medium" style={textStyle}>
          Índice de Masa Corporal (IMC)
        </h3>
        <p className="font-bold" style={numberStyle}>
          {imcResult.value}
        </p>
        <p style={textStyle}>{imcResult.classification}</p>
      </div>
    ),

    tmb: hasValue(tmbResult) && (
      <div
        key="tmb"
        draggable
        onDragStart={(e) => handleDragStart(e, "tmb")}
        onDragOver={(e) => handleDragOver(e, "tmb")}
        onDragEnd={handleDragEnd}
        onDrop={(e) => handleDrop(e, "tmb")}
        className={`p-2 rounded-md bg-indigo-50 border border-indigo-200 transition-all duration-500 ease-in-out ${
          draggingId === "tmb" ? "opacity-50" : ""
        } ${
          dragOverId === "tmb" ? "border-2 border-dashed border-blue-400" : ""
        }`}
      >
        <h3
          className="font-medium text-indigo-800 flex items-center"
          style={textStyle}
        >
          Tasa Metabólica Basal (TMB)
          <div className="relative group ml-1">
            <span className="bg-indigo-200 text-indigo-800 rounded-full h-4 w-4 flex items-center justify-center cursor-help text-xs">
              ?
            </span>
            <div className="absolute invisible group-hover:visible z-50 w-64 p-2 bg-white border border-gray-200 rounded-md shadow-lg text-xs text-gray-600 left-0 -translate-x-1/4 mt-1">
              {tmbResult.formula && tmbResult.formula.includes("Hombres") ? (
                <>
                  Fórmula de Katch–McArdle
                  <br></br>
                  TMB Hombres = 10 × Peso(kg) + 6.25 × Altura(cm) - 5 ×
                  Edad(años) + 5
                </>
              ) : (
                <>
                  Fórmula de Mifflin-ST Jeor 
                  <br></br>
                  TMB Mujeres = 10 × Peso(kg) + 6.25
                  × Altura(cm) - 5 × Edad(años) - 161
                </>
              )}
              {tmbResult.formula && tmbResult.formula.includes("obesidad") && (
                <>
                  <br />
                  Peso ajustado = Peso ideal + 0.25 × (Peso real - Peso ideal)
                  <br />
                  Peso ideal = IMC objetivo × (Altura(m))²
                </>
              )}
            </div>
          </div>
        </h3>
        <p className="font-bold text-indigo-600" style={numberStyle}>
          {tmbResult.value} kcal
        </p>
      </div>
    ),

    tdee: hasValue(tdeeResult) && (
      <div
        key="tdee"
        draggable
        onDragStart={(e) => handleDragStart(e, "tdee")}
        onDragOver={(e) => handleDragOver(e, "tdee")}
        onDragEnd={handleDragEnd}
        onDrop={(e) => handleDrop(e, "tdee")}
        className={`p-2 rounded-md bg-teal-50 border border-teal-200 transition-all duration-500 ease-in-out ${
          draggingId === "tdee" ? "opacity-50" : ""
        } ${
          dragOverId === "tdee" ? "border-2 border-dashed border-blue-400" : ""
        }`}
      >
        <h3 className="font-medium text-teal-800" style={textStyle}>
          Gasto Energético Diario (TDEE)
        </h3>

        <div className="grid grid-cols-5 gap-1 mt-2 items-center">
          <div className="text-center">
            <p className="text-teal-700 text-xs">TMB:</p>
            <p className="font-bold text-teal-600" style={numberStyle}>
              {tmbResult?.value} kcal
            </p>
          </div>

          <div className="text-center text-teal-700 font-bold text-lg">×</div>

          <div className="text-center">
            <p className="text-teal-700 text-xs">Factor:</p>
            <p className="font-bold text-teal-600" style={numberStyle}>
              {tdeeResult.factor}
            </p>
          </div>

          <div className="text-center text-teal-700 font-bold text-lg">=</div>

          <div className="text-center">
            <p className="text-teal-700 text-xs">TDEE:</p>
            <p className="font-bold text-teal-600" style={numberStyle}>
              {tdeeResult.value} kcal
            </p>
          </div>
        </div>

        <p className="text-teal-700 mt-2" style={textStyle}>
          {tdeeResult.nivel}
        </p>

        <div className="mt-2 bg-teal-100 p-2 rounded-md">
          <p className="text-teal-800 text-sm" style={textStyle}>
            <strong>TDEE</strong> = TMB × Factor de Actividad
          </p>
          <p className="text-teal-700 text-xs mt-1">
            Este es el gasto energético base sin incluir el efecto térmico de
            los alimentos
          </p>
        </div>
      </div>
    ),

    energiaTotal: energiaTotalResult && (
      <div
        key="energiaTotal"
        draggable
        onDragStart={(e) => handleDragStart(e, "energiaTotal")}
        onDragOver={(e) => handleDragOver(e, "energiaTotal")}
        onDragEnd={handleDragEnd}
        onDrop={(e) => handleDrop(e, "energiaTotal")}
        className={`p-2 rounded-md bg-blue-50 border border-blue-200 transition-all duration-500 ease-in-out ${
          draggingId === "energiaTotal" ? "opacity-50" : ""
        } ${
          dragOverId === "energiaTotal"
            ? "border-2 border-dashed border-blue-400"
            : ""
        }`}
      >
        <h3 className="font-medium text-blue-800" style={textStyle}>
          Gasto Calórico Total (TDEE + ETA)
        </h3>

        <div className="grid grid-cols-5 gap-1 mt-2 items-center">
          <div className="text-center">
            <p className="text-blue-700 text-xs">TDEE:</p>
            <p className="font-bold text-blue-600" style={numberStyle}>
              {energiaTotalResult.tdee} kcal
            </p>
          </div>

          <div className="text-center text-blue-700 font-bold text-lg">+</div>

          <div className="text-center">
            <p className="text-blue-700 text-xs">ETA (10%):</p>
            <p className="font-bold text-blue-600" style={numberStyle}>
              {energiaTotalResult.eta} kcal
            </p>
          </div>

          <div className="text-center text-blue-700 font-bold text-lg">=</div>

          <div className="text-center">
            <p className="text-blue-700 text-xs">Total:</p>
            <p className="font-bold text-blue-600" style={numberStyle}>
              {energiaTotalResult.value} kcal
            </p>
          </div>
        </div>

        <div className="mt-2 bg-blue-100 p-2 rounded-md">
          <p className="text-blue-800 text-sm" style={textStyle}>
            <strong>Gasto Calórico Total</strong> = TDEE + ETA
          </p>
          <p className="text-blue-700 text-xs mt-1">
            ETA (Efecto Térmico de los Alimentos) = 10% del TDEE
          </p>
        </div>
      </div>
    ),

    objetivo: objetivoDisplayValues && (
      <div
        key="objetivo"
        draggable
        onDragStart={(e) => handleDragStart(e, "objetivo")}
        onDragOver={(e) => handleDragOver(e, "objetivo")}
        onDragEnd={handleDragEnd}
        onDrop={(e) => handleDrop(e, "objetivo")}
        className={`p-2 rounded-md border transition-all duration-500 ease-in-out ${
          objetivoDisplayValues.tipo === "deficit"
            ? "bg-purple-50 border-purple-200"
            : "bg-green-50 border-green-200"
        } ${draggingId === "objetivo" ? "opacity-50" : ""} ${
          dragOverId === "objetivo"
            ? "border-2 border-dashed border-blue-400"
            : ""
        }`}
      >
        {objetivoDisplayValues.tipo === "deficit" ? (
          <>
            <h3 className="font-medium text-purple-800" style={textStyle}>
              Plan de Déficit Calórico
            </h3>
            <div className="flex justify-between items-center mt-1">
              <div>
                <p className="text-purple-700" style={textStyle}>
                  Gasto Total:
                </p>
                <p className="font-bold text-purple-600" style={numberStyle}>
                  {energiaTotalResult?.value} kcal
                </p>
              </div>
              <div className="text-lg">-</div>
              <div>
                <p className="text-purple-700" style={textStyle}>
                  Déficit ({objetivoDisplayValues.porcentaje}%):
                </p>
                <p className="font-bold text-purple-600" style={numberStyle}>
                  {objetivoDisplayValues.deficit ||
                    Math.round(
                      (energiaTotalResult?.value *
                        objetivoDisplayValues.porcentaje) /
                        100
                    )}{" "}
                  kcal
                </p>
              </div>
              <div className="text-lg">=</div>
              <div>
                <p className="text-purple-700" style={textStyle}>
                  Objetivo diario:
                </p>
                <p className="font-bold text-purple-600" style={numberStyle}>
                  {objetivoDisplayValues.final} kcal
                </p>
              </div>
            </div>
            <div className="mt-2 bg-purple-100 p-2 rounded-md">
              <p className="text-purple-800 text-xs">
                Basado en el <strong>Gasto Calórico Total</strong> (TDEE + ETA)
              </p>
            </div>
          </>
        ) : (
          <>
            <h3 className="font-medium text-green-800" style={textStyle}>
              Plan de Aumento Calórico
            </h3>
            <div className="flex justify-between items-center mt-1">
              <div>
                <p className="text-green-700" style={textStyle}>
                  Gasto Total:
                </p>
                <p className="font-bold text-green-600" style={numberStyle}>
                  {energiaTotalResult?.value} kcal
                </p>
              </div>
              <div className="text-lg">+</div>
              <div>
                <p className="text-green-700" style={textStyle}>
                  Superávit ({objetivoDisplayValues.porcentaje}%):
                </p>
                <p className="font-bold text-green-600" style={numberStyle}>
                  {objetivoDisplayValues.aumento ||
                    Math.round(
                      (energiaTotalResult?.value *
                        objetivoDisplayValues.porcentaje) /
                        100
                    )}{" "}
                  kcal
                </p>
              </div>
              <div className="text-lg">=</div>
              <div>
                <p className="text-green-700" style={textStyle}>
                  Objetivo diario:
                </p>
                <p className="font-bold text-green-600" style={numberStyle}>
                  {objetivoDisplayValues.final} kcal
                </p>
              </div>
            </div>
            <div className="mt-2 bg-green-100 p-2 rounded-md">
              <p className="text-green-800 text-xs">
                Basado en el <strong>Gasto Calórico Total</strong> (TDEE + ETA)
              </p>
            </div>
          </>
        )}
      </div>
    ),

    agua: aguaResult && (
      <div
        key="agua"
        draggable
        onDragStart={(e) => handleDragStart(e, "agua")}
        onDragOver={(e) => handleDragOver(e, "agua")}
        onDragEnd={handleDragEnd}
        onDrop={(e) => handleDrop(e, "agua")}
        className={`p-2 rounded-md bg-blue-50 border border-blue-200 transition-all duration-500 ease-in-out ${
          draggingId === "agua" ? "opacity-50" : ""
        } ${
          dragOverId === "agua" ? "border-2 border-dashed border-blue-400" : ""
        }`}
      >
        <h3 className="font-medium text-blue-800" style={textStyle}>
          Requerimiento de Agua
        </h3>
        <p className="font-bold text-blue-600" style={numberStyle}>
          {aguaResult.litros} L
        </p>
        <p className="text-blue-700" style={textStyle}>
          Base: {aguaResult.base}ml
          {aguaResult.extra > 0 && (
            <span className="ml-1 text-green-600">
              + Extra: 500ml (por actividad)
            </span>
          )}
        </p>
        <div className="mt-1 text-xs text-blue-600">
          <p>Recomendación diaria de hidratación</p>
        </div>
      </div>
    ),

    grasa: hasValue(grasaCorporalResult) && (
      <div
        key="grasa"
        draggable
        onDragStart={(e) => handleDragStart(e, "grasa")}
        onDragOver={(e) => handleDragOver(e, "grasa")}
        onDragEnd={handleDragEnd}
        onDrop={(e) => handleDrop(e, "grasa")}
        className={`p-2 rounded-md bg-amber-50 border border-amber-200 transition-all duration-500 ease-in-out ${
          draggingId === "grasa" ? "opacity-50" : ""
        } ${
          dragOverId === "grasa" ? "border-2 border-dashed border-blue-400" : ""
        }`}
      >
        <h3
          className="font-medium text-amber-800 flex items-center"
          style={textStyle}
        >
          % Grasa Corporal (Deurenberg)
          <div className="relative group ml-1">
            <span className="bg-amber-200 text-amber-800 rounded-full h-4 w-4 flex items-center justify-center cursor-help text-xs">
              ?
            </span>
            <div className="absolute invisible group-hover:visible z-50 w-72 p-2 bg-white border border-gray-200 rounded-md shadow-lg text-xs text-gray-600 left-0 -translate-x-1/4 mt-1">
              <p className="font-semibold">
                Fórmula: {grasaCorporalResult.formula}
              </p>
              <p className="mt-1 font-semibold">
                Género: Hombre = 1, Mujer = 0
              </p>
            </div>
          </div>
        </h3>
        <p className="font-bold text-amber-600" style={numberStyle}>
          {grasaCorporalResult.value}%
        </p>
      </div>
    ),

    cardio: cardioDisplayValues && zonaCardio && (
      <div
        key="cardio"
        draggable
        onDragStart={(e) => handleDragStart(e, "cardio")}
        onDragOver={(e) => handleDragOver(e, "cardio")}
        onDragEnd={handleDragEnd}
        onDrop={(e) => handleDrop(e, "cardio")}
        className={`p-2 rounded-md border transition-all duration-500 ease-in-out ${
          zonaCardio.bgColor
        } ${zonaCardio.borderColor} ${
          draggingId === "cardio" ? "opacity-50" : ""
        } ${
          dragOverId === "cardio"
            ? "border-2 border-dashed border-blue-400"
            : ""
        }`}
      >
        <h3
          className="font-medium text-gray-800 flex items-center"
          style={textStyle}
        >
          Frecuencia Cardíaca Objetivo
          <div className="relative group ml-1">
            <span className="bg-gray-200 text-gray-800 rounded-full h-4 w-4 flex items-center justify-center cursor-help text-xs">
              ?
            </span>
            <div className="absolute invisible group-hover:visible z-50 w-72 p-2 bg-white border border-gray-200 rounded-md shadow-lg text-xs text-gray-600 left-0 -translate-x-1/4 mt-1">
              <p className="font-semibold">
                Fórmula: {cardioDisplayValues.formula}
              </p>
              <div className="mt-2 grid grid-cols-2 gap-1 text-center">
                <div className="bg-blue-100 p-1 rounded text-xs">
                  50-60%: Muy Suave
                </div>
                <div className="bg-green-100 p-1 rounded text-xs">
                  61-70%: Suave
                </div>
                <div className="bg-yellow-100 p-1 rounded text-xs">
                  71-80%: Moderado
                </div>
                <div className="bg-orange-100 p-1 rounded text-xs">
                  81-90%: Intenso
                </div>
                <div className="bg-red-100 p-1 rounded text-xs">
                  91-100%: Máximo
                </div>
              </div>
            </div>
          </div>
        </h3>
        <div className="flex items-baseline justify-between mt-1">
          <div>
            <p className="text-gray-600" style={textStyle}>
              Mínimo:
            </p>
            <p className="font-bold text-gray-800" style={numberStyle}>
              {cardioDisplayValues.rangoMin} ppm
            </p>
          </div>
          <div className="text-gray-400 mx-2">-</div>
          <div>
            <p className="text-gray-600" style={textStyle}>
              Máximo:
            </p>
            <p className="font-bold text-gray-800" style={numberStyle}>
              {cardioDisplayValues.rangoMax} ppm
            </p>
          </div>
        </div>
        <div className="relative group mt-1">
          <p className={`font-medium ${zonaCardio.color}`} style={textStyle}>
            Zona: {zonaCardio.nombre} ({cardioDisplayValues.rango})
          </p>
          <div className="absolute invisible group-hover:visible z-50 w-64 p-2 bg-white border border-gray-200 rounded-md shadow-lg text-xs text-gray-600 left-0 -translate-x-1/4 mt-1">
            <p className="font-semibold">Beneficios:</p>
            <p>{zonaCardio.beneficio}</p>
            <p className="font-semibold mt-1">Combustible principal:</p>
            <p>{zonaCardio.combustible}</p>
          </div>
        </div>
      </div>
    ),
  };

  return (
    <div className="bg-white rounded-lg shadow p-3 md:p-4 h-full flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-semibold text-gray-700" style={titleStyle}>
          Resultados
        </h2>
        <button
          onClick={resetOrder}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-1 rounded text-sm transition-colors"
          style={textStyle}
          title="Restablecer orden original"
        >
          ↺ Reiniciar orden
        </button>
      </div>

      <div className="space-y-3 flex-grow">
        {elementOrder.map((id) => componentMap[id]).filter(Boolean)}

        {Object.values(componentMap).filter(Boolean).length === 0 && (
          <div className="text-center py-8 text-gray-500" style={textStyle}>
            Complete los datos del usuario para ver los resultados
          </div>
        )}
      </div>
    </div>
  );
};
