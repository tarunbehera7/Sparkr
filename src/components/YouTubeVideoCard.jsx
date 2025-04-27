import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/YouTubeVideoCard.css';

const YouTubeVideoCard = ({ videoId }) => {
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        const response = await axios.get(
          `https://www.googleapis.com/youtube/v3/videos`,
          {
            params: {
              part: 'snippet,statistics',
              id: videoId,
              // "API key 1" from google cloud( Google )..
              key: import.meta.env.VITE_YOUTUBE_API_KEY
            }
          }
        );

        if (response.data.items && response.data.items.length > 0) {
          setVideoData(response.data.items[0]);
        } else {
          setError('Video not found');
        }
      } catch (err) {
        setError('Failed to fetch video data');
        console.error('Error fetching video data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideoData();
  }, [videoId]);

  if (loading) {
    return <div className="video-card loading">Loading...</div>;
  }

  if (error) {
    return <div className="video-card error">{error}</div>;
  }

  if (!videoData) {
    return null;
  }

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="video-card">
      <div className="video-thumbnail">
        <img
          src={videoData.snippet.thumbnails.high.url}
          alt={videoData.snippet.title}
        />
        <div className="video-duration">
          {/* You can add duration if needed */}
        </div>
      </div>
      <div className="video-info">
        <h3 className="video-title">{videoData.snippet.title}</h3>
        <div className="video-stats">
          <span className="views">
            {formatNumber(videoData.statistics.viewCount)} views
          </span>
          <span className="likes">
            {formatNumber(videoData.statistics.likeCount)} likes
          </span>
        </div>
        <div className="video-description">
          {videoData.snippet.description.substring(0, 100)}...
        </div>
        <div className="video-meta">
          <span className="channel-name">{videoData.snippet.channelTitle}</span>
          <span className="publish-date">
            {new Date(videoData.snippet.publishedAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default YouTubeVideoCard; 