import { Navbar } from "../../components/Navbar";

export const Buttons = ({
  setFontSize,
}) => {

  return (
    <div className="flex items-center justify-between mb-4 p-4 bg-white rounded-lg shadow">
      <div className="flex space-x-2">
        <button
          onClick={() => setFontSize((prev) => Math.max(12, prev - 1))}
          className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded text-sm font-medium transition duration-200"
        >
          A-
        </button>
        <button
          onClick={() => setFontSize((prev) => Math.min(18, prev + 1))}
          className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded text-sm font-medium transition duration-200"
        >
          A+
        </button>
      </div>
    </div>
  );
};
