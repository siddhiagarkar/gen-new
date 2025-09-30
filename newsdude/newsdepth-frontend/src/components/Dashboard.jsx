import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = ({ headlines }) => {
  const pastels = [
    'bg-pastel-cyan',    
  ];

  // Function to create a stable ID from URL
  const createArticleId = (url) => {
    return btoa(url).replace(/=/g, '').substring(0, 20); // Base64 encode and trim
  };

  return (
    <div className='header-container bg-cyan-100'>
      {headlines.map((headline, index) => {
        const articleId = createArticleId(headline.url);
        
        return (
          <div 
            key={articleId} // Use stable ID instead of index
            className={`${pastels[0]} custom-card`}
          >
            <div className="card-content-container">
              <div className="flex-grow">
                <h2 className="headline-text">
                  {headline.title}
                </h2>
                
                {/* Add image container below headline */}
                {headline.urlToImage && (
                  <div className="mt-3 mb-4">
                    <img 
                      src={headline.urlToImage}
                      alt={headline.title}
                      className="news-image"
                      onError={(e) => {
                        e.target.style.display = 'none'
                      }}
                    />
                  </div>
                )}
              </div>
              
              <div className="flex-justify-end">
                <button className="custom-button">
                  <Link 
                    to={`/chat/${articleId}`}
                    state={{ article: headline }} // Pass the entire article object
                  >
                    ENGAGE
                  </Link>
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Dashboard;