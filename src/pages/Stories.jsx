import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter } from 'react-icons/fa';
import axios from 'axios';
import '../styles/Stories.css';

function Stories() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = ['all', 'Environment', 'Education', 'Health', 'Technology', 'Community'];

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        setError(null);

        // console.log('API KEY from env:', import.meta.env.VITE_REACT_APP_API_KEY);
        

        const API_KEY = 'AIzaSyBn5sgW_2Rc01UcHjzYYUAmNJO60gy_GUY';
        // const API_KEY = 'AIzaSyCYu9RKDfKUOMarLP_qVvuqRmEEnn43Flg'; // Replace with your actual API key
      
        // Fetch videos for each category
        const categoryQueries = {
          Environment: 'environmental sustainability impact stories',
          Education: 'education impact stories innovation',
          Health: 'healthcare innovation impact stories',
          Technology: 'technology social impact innovation',
          Community: 'community development impact stories'
        };

        const allVideos = [];
        
        // Fetch videos for each category in parallel
        await Promise.all(
          Object.entries(categoryQueries).map(async ([category, query]) => {
            const response = await axios.get(
              'https://www.googleapis.com/youtube/v3/search',
              {
                params: {
                  part: 'snippet',
                  q: query,
                  type: 'video',
                  maxResults: 6, // Reduced per category to avoid quota limits
                  key: API_KEY,
                  // key : import.meta.env.VITE_REACT_APP_API_KEY,
                  relevanceLanguage: 'en',
                  videoEmbeddable: true
                },
                headers: {
                  'Accept': 'application/json'
                }
              }
            );

            if (response.data.items) {
              // Add category to each video object
              const videosWithCategory = response.data.items.map(video => ({
                ...video,
                category: category
              }));
              allVideos.push(...videosWithCategory);
            }
          })
        );

        if (allVideos.length > 0) {
          setVideos(allVideos);
        } else {
          setError('No videos found');
        }
      } catch (err) {
        console.error('Error details:', err.response?.data || err.message);
        if (err.response?.status === 403) {
          setError('API key is invalid or has insufficient permissions. Please check your API key settings.');
        } else if (err.response?.status === 400) {
          setError('Invalid request. Please check your API parameters.');
        } else {
          setError('Failed to fetch videos. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  // Filter videos based on search term and category
  const filteredVideos = videos.filter(video => {
    if (!video.snippet?.title || !video.snippet?.description) return false;
    
    const searchTermLower = searchTerm.toLowerCase().trim();
    const titleLower = video.snippet.title.toLowerCase();
    const descriptionLower = video.snippet.description.toLowerCase();
    
    // Category filtering
    if (selectedCategory !== 'all' && video.category !== selectedCategory) {
      return false;
    }
    
    // Search term filtering
    if (searchTermLower) {
      return titleLower.includes(searchTermLower) || 
             descriptionLower.includes(searchTermLower);
    }
    
    return true;
  });

  if (loading) {
    return (
      <div className="stories-page">
        <div className="loading">Loading videos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="stories-page">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="stories-page">
      {/* <div className="stories-header">
        <h1>Impact Stories</h1>
        <p>Discover inspiring stories of change and impact from around the world</p>
      </div> */}

      <div className="stories-controls">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search stories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="category-filter">
          <FaFilter className="filter-icon" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="stories-grid">
        {filteredVideos.length > 0 ? (
          filteredVideos.map(video => (
            <div 
              key={video.id.videoId} 
              className="story-card"
              onClick={() => window.open(`https://www.youtube.com/watch?v=${video.id.videoId}`, '_blank')}
            >
              <div className="story-image">
                <img src={video.snippet.thumbnails.high.url} alt={video.snippet.title} />
                <div className="duration">10:30</div> {/* This would be dynamic in a real implementation */}
              </div>
              <div className="story-content">
                <h3>{video.snippet.title}</h3>
                <div className="story-meta">
                  <span className="story-author">{video.snippet.channelTitle}</span>
                  <span className="story-date">
                    {new Date(video.snippet.publishedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <p>No videos found matching your search criteria.</p>
          </div>
        )}
      </div>

      <div className="stories-footer">
        <button className="btn btn-secondary">Load More Videos</button>
      </div>
    </div>
  );
}

export default Stories; 
