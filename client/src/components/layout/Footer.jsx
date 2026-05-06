import { Link } from "react-router-dom";
import { FiBookOpen, FiGithub } from "react-icons/fi";

const Footer = () => (
  <footer className="bg-gray-950 border-t border-gray-800 mt-auto">
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
            <FiBookOpen className="text-white text-sm" />
          </div>
          <span className="font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            SmartLib
          </span>
        </div>
        <p className="text-gray-500 text-sm">
          © 2025 Smart Library Management System. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
