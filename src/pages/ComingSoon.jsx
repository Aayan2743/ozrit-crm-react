import { Hourglass, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ComingSoon = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6">
      <div className="animate-pulse mb-4">
        <Hourglass className="h-12 w-12 text-purple-600" />
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
        Coming Soon 🚧
      </h1>
      <p className="text-gray-600 max-w-md mb-6">
        We’re working hard on this feature. Stay tuned — it’ll be live shortly!
      </p>

      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>
    </div>
  );
};

export default ComingSoon;
