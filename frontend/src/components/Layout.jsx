import React from 'react';
import { Facebook, Twitter, Instagram, MapPin, Phone, Mail } from 'lucide-react';

export const Header = ({ title, subtitle }) => {
  return (
    <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 border-b border-gray-800 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-4 mb-2">
          <h1 className="text-4xl font-bold text-white">{title}</h1>
          <p className="text-gray-300 text-sm font-semibold" style={{ fontFamily: "'Segoe UI', 'Arial', sans-serif" }}>
            Premium Cars. Precision Service. Unmatched Excellence.
          </p>
        </div>
        {subtitle && <p className="text-gray-400 text-lg">{subtitle}</p>}
      </div>
    </div>
  );
};

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-gray-800 mt-20">
      <style>{`
        @keyframes phoneFlash {
          0%, 100% { color: #dc2626; }
          50% { color: #991b1b; }
        }
        .phone-flash {
          animation: phoneFlash 1.5s ease-in-out infinite;
        }
      `}</style>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Left Section - Branding */}
          <div>
            <h3 className="text-white font-bold mb-4">TOP SPEED</h3>
            <p className="text-gray-400 text-sm">Premium automotive platform</p>
          </div>

          {/* Middle Section - Manager Info & Address */}
          <div className="flex flex-col justify-center items-center text-center">
            <div className="mb-3">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-500 to-white font-bold text-lg font-['Segoe_UI',_Arial]">
                Manager Mohamed Yousry
              </span>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <Phone className="w-5 h-5 phone-flash" />
              <p className="text-gray-300 text-sm font-medium">+201022861438</p>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-5 h-5 text-red-600" />
              <p className="text-gray-300 text-sm">6th of October, 26th of July Road</p>
            </div>
            <p className="text-gray-400 text-xs">In front of Al-Dahan</p>
          </div>

          {/* Right Section - Contact & Social */}
          <div className="flex flex-col justify-center items-center md:items-end">
            <div className="flex items-center gap-2 mb-4">
              <Mail className="w-6 h-6" />
              <p className="text-gray-300 text-sm">topspeed@gmail.com</p>
            </div>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-600 transition"
                aria-label="Facebook"
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition"
                aria-label="Twitter"
              >
                <Twitter className="w-6 h-6" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-pink-600 transition"
                aria-label="Instagram"
              >
                <Instagram className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8">
          <p className="text-center text-gray-400">
            Programmer Bilal Mohamed
          </p>
          <p className="text-center text-gray-400 text-sm mt-4">
            Copyright {currentYear} TOP SPEED. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
