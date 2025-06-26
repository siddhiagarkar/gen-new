import React from 'react';

const Dashboard = ({ headlines }) => {
  const pastels = [
    'bg-pastel-cyan',    
  ];

  return (
    <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 p-4">
      {headlines.map((headline, index) => (
        <div 
          key={index}
          className={`${pastels[0]} 
            rounded-2xl p-6 shadow-md hover:shadow-lg
            transition-all duration-300 h-full`}
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            {headline.title}
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            {headline.description || "Read more..."}
          </p>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">
              {new Date(headline.publishedAt).toLocaleDateString()}
            </span>
            <button className="text-xs px-3 py-1 bg-white rounded-full shadow-sm">
              Explore →
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;