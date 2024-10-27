"use client";
import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import { useAuth } from './providers/AuthProvider';

const carouselMessages: string[] = [
  "Get 10% off on business sign up",
  "Free shipping on orders over $50",
  "New arrivals - Shop the latest collection",
  "Limited time offer: 20% off winter essentials",
  "Join our loyalty program for exclusive deals"
];

const Navbar: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const { user, logout, isAuthenticated } = useAuth();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselMessages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselMessages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? carouselMessages.length - 1 : prev - 1
    );
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="w-full">
      {/* Top Utility Bar */}
      <div className="bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-end py-2">
            <div className="flex items-center space-x-6">
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900">Help</a>
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900">Orders & Returns</a>
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">Hi, {user?.name}</span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900"
                    aria-label="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <a href="/login" className="text-sm text-gray-600 hover:text-gray-900">Login</a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-8">
          <div className="flex items-center justify-between h-16">
            <div className="text-3xl font-bold">
              <a href="/" className="hover:text-gray-700 transition-colors">
                ECOMMERCE
              </a>
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-black font-medium hover:text-gray-700">Categories</a>
              <a href="#" className="text-black font-medium hover:text-gray-700">Sale</a>
              <a href="#" className="text-black font-medium hover:text-gray-700">Clearance</a>
              <a href="#" className="text-black font-medium hover:text-gray-700">New stock</a>
              <a href="#" className="text-black font-medium hover:text-gray-700">Trending</a>
            </nav>

            {/* Search and Cart Icons */}
            <div className="flex items-center space-x-4">
              <button className="p-2" aria-label="Search">
                <Search className="w-5 h-5" />
              </button>
              <button className="p-2" aria-label="Shopping Cart">
                <ShoppingCart className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Promotional Banner */}
      <div className="bg-gray-200 text-black py-2 px-4">
        <div className="flex items-center justify-center space-x-4">
          <button onClick={prevSlide} className="text-black" aria-label="Previous Slide">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="text-center text-sm">
            {carouselMessages[currentSlide]}
          </div>
          <button onClick={nextSlide} className="text-black" aria-label="Next Slide">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;