const Loader = ({ fullScreen = true }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-gray-950 flex items-center justify-center z-50">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-gray-800 border-t-indigo-500 animate-spin" />
          <div
            className="w-16 h-16 rounded-full border-4 border-transparent border-b-purple-500 animate-spin absolute top-0 left-0"
            style={{ animationDirection: "reverse", animationDuration: "0.7s" }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-10 h-10 rounded-full border-4 border-gray-800 border-t-indigo-500 animate-spin" />
    </div>
  );
};

export default Loader;
