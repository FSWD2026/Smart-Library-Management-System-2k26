const Loader = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-950">
    <div className="relative">
      <div className="w-16 h-16 rounded-full border-4 border-gray-800 border-t-indigo-500 animate-spin" />
      <div
        className="w-16 h-16 rounded-full border-4 border-transparent border-b-purple-500 animate-spin absolute top-0 left-0"
        style={{ animationDirection: "reverse", animationDuration: "0.8s" }}
      />
    </div>
  </div>
);

export default Loader;
