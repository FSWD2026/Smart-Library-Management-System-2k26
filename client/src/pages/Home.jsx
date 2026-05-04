import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FiBookOpen, FiUsers, FiShield, FiArrowRight } from "react-icons/fi";

const features = [
  {
    icon: FiBookOpen,
    title: "Vast Collection",
    desc: "Thousands of books across all genres at your fingertips.",
  },
  {
    icon: FiUsers,
    title: "Easy Borrowing",
    desc: "Borrow and return books with just a few clicks.",
  },
  {
    icon: FiShield,
    title: "Secure Access",
    desc: "JWT-protected accounts with role-based access control.",
  },
];

const Home = () => {
  const { isAuthenticated } = useSelector((s) => s.auth);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden py-24 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/50 via-gray-950 to-purple-950/30" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-10 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />

        <div className="relative max-w-4xl mx-auto text-center animate-slide-up">
          <div className="inline-flex items-center gap-2 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium px-4 py-2 rounded-full mb-6">
            <FiBookOpen size={14} />
            Smart Library Management System
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
            Your Digital{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Library
            </span>{" "}
            Awaits
          </h1>
          <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10">
            Discover, borrow, and manage books effortlessly. A modern library
            experience built for the digital age.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/books"
              className="btn-primary flex items-center gap-2 text-base px-8 py-3"
            >
              Browse Books <FiArrowRight />
            </Link>
            {!isAuthenticated && (
              <Link
                to="/register"
                className="btn-outline flex items-center gap-2 text-base px-8 py-3"
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Why{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              SmartLib?
            </span>
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="glass p-6 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 group"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="w-12 h-12 bg-indigo-600/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-600/40 transition-colors">
                  <f.icon className="text-indigo-400 text-xl" />
                </div>
                <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
