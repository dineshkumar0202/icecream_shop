import React from 'react';
// import HomeImage from '../images/home.png';

export default function NotFound() {
  return (
    <div 
      className="page-background flex items-center justify-center"
      style={{
        '--page-bg-image': `url(${HomeImage})`
      }}
    >
      {/* Content */}
      <div className="page-content text-center">
        <div className="text-8xl mb-6 animate-bounce">🍦</div>
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <button
          onClick={() => window.history.back()}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}
