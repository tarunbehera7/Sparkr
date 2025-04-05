// import React, { useState, useEffect } from 'react';
// import { FaPlay, FaBook, FaNewspaper, FaVideo, FaTv, FaSearch } from 'react-icons/fa';

// const ContentLibrary = () => {
//   const [activeTab, setActiveTab] = useState('talks');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [content, setContent] = useState({});
//   const [loading, setLoading] = useState(true);

//   const contentCategories = [
//     { id: 'videos', label: 'Videos', icon: <FaVideo /> },
//     { id: 'talks', label: 'TED Talks', icon: <FaPlay /> },
//     { id: 'documentaries', label: 'Documentaries', icon: <FaTv /> },
//     { id: 'books', label: 'Books', icon: <FaBook /> },
//     { id: 'articles', label: 'Articles', icon: <FaNewspaper /> },
//   ];

//   const contentItems = {
//     videos: [
//       {
//         id: 1,
//         title: 'The Power of Community Action',
//         thumbnail: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
//         duration: '12:45',
//         views: 1245,
//         date: '2023-06-15',
//         category: 'Community',
//       },
//       {
//         id: 2,
//         title: 'Environmental Conservation Success Stories',
//         thumbnail: 'https://images.pexels.com/photos/2255935/pexels-photo-2255935.jpeg',
//         duration: '18:30',
//         views: 987,
//         date: '2023-06-14',
//         category: 'Environment',
//       },
//       {
//         id: 3,
//         title: 'Education for All: Breaking Barriers',
//         thumbnail: 'https://images.pexels.com/photos/256431/pexels-photo-256431.jpeg',
//         duration: '15:20',
//         views: 1567,
//         date: '2023-06-13',
//         category: 'Education',
//       },
//     ],
//     talks: [
//       {
//         id: 'ted1',
//         title: 'How to Build a Global Pro-Democracy Movement',
//         speaker: 'Yordanos Eyoel',
//         thumbnail: '/images/yordanos-ted-talk.jpg',
//         duration: '12:47',
//         views: '597K',
//         date: 'October 2023',
//         link: 'https://www.ted.com/talks/yordanos_eyoel_how_to_build_a_global_pro_democracy_movement'
//       },
//       {
//         id: 2,
//         title: 'The Future of Social Impact',
//         thumbnail: '/images/image.png',
//         speaker: 'John Doe',
//         duration: '19:45',
//         views: '2,789',
//         date: '2023-06-14',
//         link: 'https://www.ted.com/talks/rita_pierson_every_kid_needs_a_champion'
//       },
//     ],
//     documentaries: [
//       {
//         id: 1,
//         title: 'Climate Change: The Real Story',
//         thumbnail: 'https://images.pexels.com/photos/2255935/pexels-photo-2255935.jpeg',
//         duration: '45:00',
//         views: 5678,
//         date: '2023-06-15',
//       },
//       {
//         id: 2,
//         title: 'Education Revolution',
//         thumbnail: 'https://images.pexels.com/photos/256431/pexels-photo-256431.jpeg',
//         duration: '52:30',
//         views: 4321,
//         date: '2023-06-14',
//       },
//     ],
//     books: [
//       {
//         id: 1,
//         title: 'The Power of Community',
//         author: 'Sarah Johnson',
//         cover: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
//         rating: 4.8,
//         reviews: 156,
//         date: '2023-06-15',
//       },
//       {
//         id: 2,
//         title: 'Making a Difference',
//         author: 'Michael Chen',
//         cover: 'https://images.pexels.com/photos/2255935/pexels-photo-2255935.jpeg',
//         rating: 4.6,
//         reviews: 98,
//         date: '2023-06-14',
//       },
//     ],
//     articles: [
//       {
//         id: 1,
//         title: '10 Ways to Make a Difference in Your Community',
//         author: 'Emma Wilson',
//         thumbnail: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
//         readTime: '5 min',
//         views: 2345,
//         date: '2023-06-15',
//       },
//       {
//         id: 2,
//         title: 'The Science Behind Social Change',
//         author: 'David Brown',
//         thumbnail: 'https://images.pexels.com/photos/2255935/pexels-photo-2255935.jpeg',
//         readTime: '8 min',
//         views: 1876,
//         date: '2023-06-14',
//       },
//     ],
//   };

//   const getFilteredContent = () => {
//     if (!content || !contentItems) return [];
    
//     if (activeTab === 'talks') {
//       return content[activeTab]?.filter(item =>
//         item.title.toLowerCase().includes(searchQuery.toLowerCase())
//       ) || [];
//     }
//     return contentItems[activeTab]?.filter(item =>
//       item.title.toLowerCase().includes(searchQuery.toLowerCase())
//     ) || [];
//   };

//   useEffect(() => {
//     // In a real app, this would be an API call
//     const mockContent = {
//       'talks': [  // Changed from 'TED Talks' to 'talks' to match activeTab
//         {
//           id: 'ted1',
//           title: 'How to Build a Global Pro-Democracy Movement',
//           speaker: 'Yordanos Eyoel',
//           thumbnail: 'https://pi.tedcdn.com/r/talkstar-photos/8/c/a/d/8cad4b2c-9e83-4c77-8fde-e2713726c6d0/YordanosEyoel_2023W-embed.jpg',
//           duration: '12:47',
//           views: '597K',
//           date: 'October 2023',
//           link: 'https://www.ted.com/talks/yordanos_eyoel_how_to_build_a_global_pro_democracy_movement'
//         },
//         {
//           id: 'ted2',
//           title: 'How to Start a Movement',
//           speaker: 'Derek Sivers',
//           thumbnail: 'https://i.ytimg.com/vi/V74AxCqOTvg/maxresdefault.jpg',
//           duration: '3:09',
//           views: '8.2M',
//           date: '2010',
//           link: 'https://www.ted.com/talks/derek_sivers_how_to_start_a_movement'
//         },
//         {
//           id: 'ted3',
//           title: 'The Political Power of Social Movements',
//           speaker: 'Sally Kohn',
//           thumbnail: 'https://i.ytimg.com/vi/QtH3SLUssxo/maxresdefault.jpg',
//           duration: '11:04',
//           views: '1.5M',
//           date: '2014',
//           link: 'https://www.ted.com/talks/sally_kohn_the_political_power_of_social_movements'
//         },
//       ],
//     };

//     setTimeout(() => {
//       setContent(mockContent);
//       setLoading(false);
//     }, 1000);
//   }, []);

//   const filteredContent = getFilteredContent();

//   return (
//     <div className="content-library-page">
//       <div className="content-header">
//         <h1>Content Library</h1>
//         <p>Discover curated content to help you learn, grow, and make a difference</p>
//       </div>

//       <div className="content-controls">
//         <div className="search-bar">
//           <FaSearch />
//           <input
//             type="text"
//             placeholder="Search content..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </div>
//         <div className="content-tabs">
//           {contentCategories.map(category => (
//             <button
//               key={category.id}
//               className={`tab ${activeTab === category.id ? 'active' : ''}`}
//               onClick={() => setActiveTab(category.id)}
//             >
//               {category.icon}
//               <span>{category.label}</span>
//             </button>
//           ))}
//         </div>
//       </div>

//       <div className="content-grid">
//         {loading ? (
//           <div className="loading">Loading content...</div>
//         ) : (
//           filteredContent.map(item => (
//             <div 
//               key={item.id} 
//               className="content-card"
//               onClick={() => item.link && window.open(item.link, '_blank')}
//               style={{ cursor: item.link ? 'pointer' : 'default' }}
//             >
//               <div className="content-thumbnail">
//                 <img 
//                   src={item.thumbnail} 
//                   alt={item.title}
//                   loading="lazy"
//                   onError={(e) => {
//                     if (!e.target.dataset.tried) {
//                       e.target.dataset.tried = true;
//                       e.target.src = '/images/yordanos-ted-talk.jpg';
//                     }
//                   }}
//                 />
//                 {item.duration && (
//                   <div className="duration">{item.duration}</div>
//                 )}
//               </div>
//               <div className="content-info">
//                 <h3>{item.title}</h3>
//                 {item.speaker && <p className="speaker">Speaker: {item.speaker}</p>}
//                 <div className="content-meta">
//                   {item.views && <span>{item.views} views</span>}
//                   <span>{item.date}</span>
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       <div className="daily-update">
//         <h2>Daily Updates</h2>
//         <p>New content is added daily to keep you informed and inspired.</p>
//         <div className="update-timestamp">
//           Last updated: {new Date().toLocaleString()}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ContentLibrary; 




import React, { useState, useEffect } from 'react';
import { FaPlay, FaBook, FaNewspaper, FaVideo, FaTv, FaSearch } from 'react-icons/fa';

const ContentLibrary = () => {
  const [activeTab, setActiveTab] = useState('talks');
  const [searchQuery, setSearchQuery] = useState('');
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);

  const contentCategories = [
    { id: 'videos', label: 'Videos', icon: <FaVideo /> },
    { id: 'talks', label: 'TED Talks', icon: <FaPlay /> },
    { id: 'documentaries', label: 'Documentaries', icon: <FaTv /> },
    { id: 'books', label: 'Books', icon: <FaBook /> },
    { id: 'articles', label: 'Articles', icon: <FaNewspaper /> },
  ];

  const contentItems = {
    videos: [
      {
        id: 1,
        title: 'The Power of Community Action',
        thumbnail: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
        duration: '12:45',
        views: 1245,
        date: '2023-06-15',
        category: 'Community',
      },
      {
        id: 2,
        title: 'Environmental Conservation Success Stories',
        thumbnail: 'https://images.pexels.com/photos/2255935/pexels-photo-2255935.jpeg',
        duration: '18:30',
        views: 987,
        date: '2023-06-14',
        category: 'Environment',
      },
      {
        id: 3,
        title: 'Education for All: Breaking Barriers',
        thumbnail: 'https://images.pexels.com/photos/256431/pexels-photo-256431.jpeg',
        duration: '15:20',
        views: 1567,
        date: '2023-06-13',
        category: 'Education',
      },
    ],
    talks: [
      {
        id: 'ted1',
        title: 'How to Build a Global Pro-Democracy Movement',
        speaker: 'Yordanos Eyoel',
        thumbnail: '/images/yordanos-ted-talk.jpg',
        duration: '12:47',
        views: '597K',
        date: 'October 2023',
        link: 'https://www.ted.com/talks/yordanos_eyoel_how_to_build_a_global_pro_democracy_movement'
      },
      {
        id: 'ted2',
        title: 'The Future of Social Impact',
        thumbnail: 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg',
        speaker: 'John Doe',
        duration: '19:45',
        views: '2,789',
        date: '2023-06-14',
        link: '#'
      },
    ],
    documentaries: [
      {
        id: 1,
        title: 'Climate Change: The Real Story',
        thumbnail: 'https://images.pexels.com/photos/2255935/pexels-photo-2255935.jpeg',
        duration: '45:00',
        views: 5678,
        date: '2023-06-15',
      },
      {
        id: 2,
        title: 'Education Revolution',
        thumbnail: 'https://images.pexels.com/photos/256431/pexels-photo-256431.jpeg',
        duration: '52:30',
        views: 4321,
        date: '2023-06-14',
      },
    ],
    books: [
      {
        id: 1,
        title: 'The Power of Community',
        author: 'Sarah Johnson',
        cover: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
        rating: 4.8,
        reviews: 156,
        date: '2023-06-15',
      },
      {
        id: 2,
        title: 'Making a Difference',
        author: 'Michael Chen',
        cover: 'https://images.pexels.com/photos/2255935/pexels-photo-2255935.jpeg',
        rating: 4.6,
        reviews: 98,
        date: '2023-06-14',
      },
    ],
    articles: [
      {
        id: 1,
        title: '10 Ways to Make a Difference in Your Community',
        author: 'Emma Wilson',
        thumbnail: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
        readTime: '5 min',
        views: 2345,
        date: '2023-06-15',
      },
      {
        id: 2,
        title: 'The Science Behind Social Change',
        author: 'David Brown',
        thumbnail: 'https://images.pexels.com/photos/2255935/pexels-photo-2255935.jpeg',
        readTime: '8 min',
        views: 1876,
        date: '2023-06-14',
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

  useEffect(() => {
    // Simulate loading data (replace with API call in real app)
    const mockContent = {
      talks: [
        {
          id: 'ted1',
          title: 'How to Build a Global Pro-Democracy Movement',
          speaker: 'Yordanos Eyoel',
          thumbnail: 'https://pi.tedcdn.com/r/talkstar-photos/8/c/a/d/8cad4b2c-9e83-4c77-8fde-e2713726c6d0/YordanosEyoel_2023W-embed.jpg',
          duration: '12:47',
          views: '597K',
          date: 'October 2023',
          link: 'https://www.ted.com/talks/yordanos_eyoel_how_to_build_a_global_pro_democracy_movement'
        },
        {
          id: 'ted2',
          title: 'How to Start a Movement',
          speaker: 'Derek Sivers',
          thumbnail: 'https://i.ytimg.com/vi/V74AxCqOTvg/maxresdefault.jpg',
          duration: '3:09',
          views: '8.2M',
          date: '2010',
          link: 'https://www.ted.com/talks/derek_sivers_how_to_start_a_movement'
        },
      ]
    };

    setTimeout(() => {
      setContent(mockContent);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredContent = getFilteredContent();

  return (
    <div className="content-library-page">
      <div className="content-header">
        <h1>Content Library</h1>
        <p>Discover curated content to help you learn, grow, and make a difference</p>
      </div>

      <div className="content-controls">
        <div className="search-bar">
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

      <div className="content-grid">
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
                {item.speaker && <p className="speaker">Speaker: {item.speaker}</p>}
                <div className="content-meta">
                  {item.views && <span>{item.views} views</span>}
                  <span>{item.date}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="daily-update">
        <h2>Daily Updates</h2>
        <p>New content is added daily to keep you informed and inspired.</p>
        <div className="update-timestamp">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default ContentLibrary;
