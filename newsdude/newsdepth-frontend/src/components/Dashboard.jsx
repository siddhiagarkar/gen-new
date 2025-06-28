import React from 'react';
import { Link } from 'react-router-dom';
const Dashboard = ({ headlines }) => {
  const pastels = [
    'bg-pastel-cyan',    
  ];

  return (

    <div className='header-container'>

      <h1 className='newsbud-header'>NewsThru AI</h1>
      {headlines.map((headline, index) => (
        <div 
          key={index}
          className={`${pastels[0]} 
            custom-card`}
        >
          <div className="card-content-container">
  <div className="flex-grow">
    <h2 className="headline-text">
      {headline.title}
    </h2>
    
    {/* Add image container below headline */}
    {headline.urlToImage && (
      <div className="mt-3 mb-4"> {/* Adjust spacing as needed */}
        <img 
          src={headline.urlToImage}
          alt={headline.title}
          className="news-image" /* Smaller image */
          onError={(e) => {
            e.target.style.display = 'none' /* Hide if image fails to load */
          }}
        />
      </div>
    )}
  </div>
  
  <div className="flex-justify-end">
    <button className="custom-button">
      <Link to = {`/chat/${index}`}>
      ENGAGE
      </Link>
    </button>
  </div>
</div>
          
        </div>

      ))}
    </div>
  );
};

export default Dashboard;
            {/* <p className="text-gray-600 text-sm mb-4 px-10">
              {headline.description || "Read more..."}
            </p> */}
              {/* <span className="text-xs text-gray-500">
                {new Date(headline.publishedAt).toLocaleDateString()}
              </span> */}
