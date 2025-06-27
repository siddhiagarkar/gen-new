import React from 'react';

const Dashboard = ({ headlines }) => {
  const pastels = [
    'bg-pastel-cyan',    
  ];

  return (
    <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 p-11">
      {headlines.map((headline, index) => (
        <div 
          key={index}
          className={`${pastels[0]} 
            custom-card`}
        >
          <div className="mx-10"> 
            <h2 className="text-lg font-semibold text-gray-800 mb-2 px-10">
              {headline.title}
            </h2>
            <p className="text-gray-600 text-sm mb-4 px-10">
              {headline.description || "Read more..."}
            </p>
            <div className="flex justify-between items-center px-10">
              <span className="text-xs text-gray-500">
                {new Date(headline.publishedAt).toLocaleDateString()}
              </span>
              <button className="text-xs px-3 py-1 bg-white rounded-full shadow-sm">
                Explore →
              </button>
            </div>
          </div>

        </div>
      ))}
    </div>
  );
};

export default Dashboard;