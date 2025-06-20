import React, { useState, useEffect } from 'react';
import { FaPlay, FaBook, FaNewspaper, FaVideo, FaTv, FaSearch } from 'react-icons/fa';
import axios from 'axios';
import '../styles/ContentLibrary.css';

const ContentLibrary = () => {
  const [activeTab, setActiveTab] = useState('talks');
  const [searchQuery, setSearchQuery] = useState('');
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [dailyUpdates, setDailyUpdates] = useState([]);
  const [error, setError] = useState(null);
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date());

  const contentCategories = [
    { id: 'talks', label: 'TED Talks', icon: <FaPlay /> },
    { id: 'documentaries', label: 'Documentaries', icon: <FaTv /> },
    { id: 'books', label: 'Books', icon: <FaBook /> },
    { id: 'articles', label: 'Articles', icon: <FaNewspaper /> },
  ];

  const contentItems = {
    talks: [
      // {
      //   id: 'ted1',
      //   title: 'How to Build a Global Pro-Democracy Movement',
      //   speaker: 'Yordanos Eyoel',
      //   thumbnail: '/images/yordanos-ted-talk.jpg',
      //   duration: '12:34',
      //   views: '1.2M',
      //   date: 'October 2023',
      //   link: 'https://www.ted.com/talks/yordanos_eyoel_how_to_build_a_global_pro_democracy_movement'
      // },
      {
          id: 'ted1',
          title: 'What would happen if the Amazon Rainforest disappeared?',
          speaker: 'Anna Rothschild',
          thumbnail: '/images/image8.png',
          duration: '12:34',
          views: '243,057',
          date: 'Jan 2025',
          link: 'https://www.ted.com/talks/anna_rothschild_what_would_happen_if_the_amazon_rainforest_disappeared'
        },
      {
        id: 'ted2',
        title: 'The tech we need to fight workplace ageism',
        thumbnail: '/images/image6.png',
        speaker: 'Piyachart Phiromswad',
        duration: '10:01',
        views: '801,293',
        date: 'Apr 2023',
        link: 'https://www.ted.com/talks/piyachart_phiromswad_the_tech_we_need_to_fight_workplace_ageism'
      },
      {
        id: 'ted3',
        title: 'How community-led research drives social change',
        thumbnail: '/images/image7.png',
        speaker: 'Monica Malta',
        duration: '07:23',
        views: '371,392',
        date: '2023-06-14',
        link: 'https://www.ted.com/talks/piyachart_phiromswad_the_tech_we_need_to_fight_workplace_ageism'
      }
    ],
    documentaries: [
      {
        id: 1,
        title: 'Climate change - Averting catastrophe | DW Documentary',
        thumbnail: './images/doc/image1.png',
        duration: '45:00',
        views: '2.9M',
        date: 'Jul 13, 2023',
        link: 'https://www.youtube.com/watch?v=pEt6-jA2UE4'
      },
      {
        id: 2,
        title: 'Technology Revolution',
        thumbnail: './images/doc/image2.png',
        duration: '52:30',
        views: '785k',
        date: 'Mar 28, 2024',
        link:'https://www.youtube.com/watch?v=-sB12gk9ESA'
        // link2:'https://www.youtube.com/watch?v=YAmzlo5pbN8'
      },
      {
        id: 3,
        title: 'Personalized nutrition - Could genetic tests improve your health and your figure? | DW Documentary',
        thumbnail: './images/doc/image3.png',
        duration: '42:26',
        views: '412k',
        date: 'Jan 18, 2024',
        link:'https://www.youtube.com/watch?v=YAmzlo5pbN8'
      },
    ],
    books: [
      {
        id: 1,
        title: 'Focus on what matters',
        author: 'Darius Foroux',
        thumbnail: './images/book/image1.png',
        rating: 4.5,
        reviews: 771,
        date: 'Dec 2022',
      },
      {
        id: 2,
        title: 'Making a Difference',
        author: 'Shubham Kumar Singh',
        thumbnail: './images/book/image2.png',
        rating: 4.6,
        reviews: 1007,
        date: 'Dec 2023',
      },
      {
        id: 3,
        title: 'The Future Is Faster Than You Think',
        author: 'Peter H. Diamandis and Steven Kotler',
        thumbnail: './images/book/image3.png',
        rating: 4.6,
        reviews: 2978,
        date: 'Jan 2020',
      },
    ],
    articles: [
      {
        id: 1,
        title: 'Brain Health: The Importance of Mental Well-Being',
        author: 'Emma Wilson',
        thumbnail: '/images/articles/image3.png',
        readTime: '5 min',
        // views: 2345,
        date: '2023-06-15',
        link:'https://www.who.int/health-topics/brain-health#tab=tab_1'
      },
      {
        id: 2,
        title: 'Environmental Health: The Impact of Pollution on Our Planet',
        author: 'Sarah',
        thumbnail: '/images/articles/image4.png',
        readTime: '8 min',
        // views: 1876,
        date: 'Oct 2023',
        link:'https://www.pureearth.org/iris-van-der-veken-impact-award/'
      },
      {
        id: 3,
        title: 'environmental health',
        author: 'Amber Unger',
        thumbnail: '/images/articles/image5.png',
        readTime: '8 min',
        // views: 1876,
        date: 'April 2025',
        link:'https://www.edutopia.org/article/wonder-wagons-allow-preschoolers-to-explore-nature'
      },
    ],
  };

  const getFilteredContent = () => {
    if (!content || !contentItems) return [];

    const activeContent = contentItems[activeTab] || [];
    return activeContent.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const fetchTEDTalks = async () => {
    try {
      setLoading(true);

      const API_KEY = 'AIzaSyAKpEvM8VHzqZFPq0JjZ7PKWtMVL-72u6Y'; // Replace with your actual API key
      
      const response = await axios.get(
        'https://www.googleapis.com/youtube/v3/search',
        {
          params: {
            part: 'snippet',
            channelId: 'UCAuUUnT6oDeKwE6v1NGQxug', // TED's YouTube channel ID
            type: 'video',
            order: 'date', // Get most recent videos
            maxResults: 5,
            key: API_KEY,
            // key: import.meta.env.VITE_REACT_APP_OTHER_API_KEY
          }
        }
      );

      if (response.data.items) {
        const tedTalks = response.data.items.map(video => ({
          id: video.id.videoId,
          title: video.snippet.title,
          thumbnail: video.snippet.thumbnails.high.url,
          description: video.snippet.description,
          publishedAt: video.snippet.publishedAt,
          link: `https://www.youtube.com/watch?v=${video.id.videoId}`
        }));
        setDailyUpdates(tedTalks);
        setLastUpdateTime(new Date());
      }
    } 
    catch (err) {
      console.error('Error fetching TED talks:', err);
      setError('Failed to fetch latest TED talks');
    } 
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTEDTalks();
    // Set up auto-refresh every 6 hours
    const refreshInterval = setInterval(fetchTEDTalks, 6 * 60 * 60 * 1000);
    return () => clearInterval(refreshInterval);
  }, []);

  const filteredContent = getFilteredContent();

  return (
    <div className="content-library-page">
      <div className="content-controls">
        <div className="search-bar1">
          <FaSearch />
          <input
            type="text"
            placeholder="Search content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="content-tabs">
          {contentCategories.map(category => (
            <button
              key={category.id}
              className={`tab ${activeTab === category.id ? 'active' : ''}`}
              onClick={() => setActiveTab(category.id)}
            >
              {category.icon}
              <span>{category.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={`content-grid ${activeTab === 'books' ? 'books' : ''}`}>
        {loading ? (
          <div className="loading">Loading content...</div>
        ) : (
          filteredContent.map(item => (
            <div 
              key={item.id} 
              className="content-card"
              onClick={() => item.link && window.open(item.link, '_blank')}
              style={{ cursor: item.link ? 'pointer' : 'default' }}
            >
              <div className="content-thumbnail">
                <img 
                  src={item.thumbnail} 
                  alt={item.title}
                  loading="lazy"
                  onError={(e) => {
                    if (!e.target.dataset.tried) {
                      e.target.dataset.tried = true;
                      e.target.src = '/images/yordanos-ted-talk.jpg';
                    }
                  }}
                />
                {item.duration && (
                  <div className="duration">{item.duration}</div>
                )}
              </div>
              <div className="content-info">
                <h3>{item.title}</h3>
                {item.author && <p className="author">{item.author}</p>}
                <div className="content-meta">
                  {item.views && <span>{item.views} views</span>}
                  <span>{item.date}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ContentLibrary;
