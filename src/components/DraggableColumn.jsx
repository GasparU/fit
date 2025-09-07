// components/DraggableColumn.jsx
import { Draggable } from "@hello-pangea/dnd";

export const DraggableColumn = ({
  columnId,
  index,
  title,
  children,
  titleStyle,
}) => {
  return (
    <Draggable draggableId={columnId} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`${snapshot.isDragging ? "opacity-70 shadow-xl" : ""}`}
        >
          {/* Solo el encabezado es arrastrable */}
          <div
            {...provided.dragHandleProps}
            className="cursor-grab active:cursor-grabbing mb-2"
          >
            <h2
              className="font-semibold text-gray-700 inline-block"
              style={titleStyle}
            >
              {title} ↗
            </h2>
            <span className="text-xs text-gray-400 ml-2">(arrastrar)</span>
          </div>

          {/* Contenido de la columna */}
          {children}
        </div>
      )}
    </Draggable>
  );
};
