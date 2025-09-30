import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chatbot from '../components/Chatbot';
import { useParams, useLocation } from 'react-router-dom';

const Chat = () => {
  const [headlines, setHeadlines] = useState([]);
  const { articleId } = useParams(); // Changed from headlineIndex to articleId
  const location = useLocation();
  const [selectedHeadline, setSelectedHeadline] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to decode article ID
  const decodeArticleId = (id) => {
    try {
      return atob(id); // Decode from base64
    } catch (error) {
      console.error('Error decoding article ID:', error);
      return null;
    }
  };

  const fetchHeadlines = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const API_KEY = process.env.REACT_APP_NEWS_API_KEY;
      const response = await axios.get(
        `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`
      );

      setHeadlines(response.data.articles);
    } catch (err) {
      setError('Failed to load news. Please try again later.');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchHeadlines(); 
  }, []);

  // Find the correct headline when component mounts or params change
  useEffect(() => {
    if (location.state?.article) {
      // Article was passed via Link state (preferred)
      setSelectedHeadline(location.state.article);
      setLoading(false);
    } else if (articleId && headlines.length > 0) {
      // Fallback: Find article by decoded URL
      const decodedUrl = decodeArticleId(articleId);
      if (decodedUrl) {
        const foundHeadline = headlines.find(article => 
          article.url === decodedUrl
        );
        if (foundHeadline) {
          setSelectedHeadline(foundHeadline);
        } else {
          setError('Article not found. It may have been removed or updated.');
        }
      }
      setLoading(false);
    }
  }, [articleId, headlines, location.state]);

  if (loading) return <div>Loading...</div>;
  
  if (error) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button onClick={() => window.history.back()} className="bg-blue-600 text-white px-4 py-2 rounded">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!selectedHeadline) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Article Not Found</h2>
          <p className="text-gray-600 mb-4">The requested article could not be loaded.</p>
          <button onClick={() => window.history.back()} className="bg-blue-600 text-white px-4 py-2 rounded">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 p-6 font-serif">
      <Chatbot 
        headline={selectedHeadline} 
        onRefresh={fetchHeadlines} 
      />
    </div>
  );
};

export default Chat;