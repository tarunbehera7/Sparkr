import React, { useState } from 'react';
import { FaSearch, FaFilter } from 'react-icons/fa';

function Stories() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock data for stories with placeholder images
  const stories = [
    {
      id: 1,
      title: "Community Garden Initiative",
      category: "Environment",
      author: "Sarah Johnson",
      date: "2024-03-15",
      excerpt: "How a small community transformed an abandoned lot into a thriving garden...",
      image: "https://images.pexels.com/photos/2255935/pexels-photo-2255935.jpeg"
    },
    {
      id: 2,
      title: "Education for All",
      category: "Education",
      author: "Michael Chen",
      date: "2024-03-14",
      excerpt: "Breaking barriers to education in remote communities...",
      image: "https://images.pexels.com/photos/256431/pexels-photo-256431.jpeg"
    },
    {
      id: 3,
      title: "Clean Water Project",
      category: "Health",
      author: "Lisa Rodriguez",
      date: "2024-03-13",
      excerpt: "Bringing clean water access to rural villages...",
      image: "https://images.pexels.com/photos/6646917/pexels-photo-6646917.jpeg"
    }
  ];

  const categories = ['all', 'Environment', 'Education', 'Health', 'Social Justice'];

  // Filter stories based on search term and selected category
  const filteredStories = stories.filter(story => {
    const matchesSearch = story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         story.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         story.author.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || story.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="stories-page">
      <div className="stories-header">
        <h1>Impact Stories</h1>
        <p>Discover inspiring stories of change and impact from around the world</p>
      </div>

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
        {filteredStories.length > 0 ? (
          filteredStories.map(story => (
            <div key={story.id} className="story-card">
              <div className="story-image">
                <img src={story.image} alt={story.title} />
              </div>
              <div className="story-content">
                <span className="story-category">{story.category}</span>
                <h3>{story.title}</h3>
                <p>{story.excerpt}</p>
                <div className="story-meta">
                  <span className="story-author">By {story.author}</span>
                  <span className="story-date">{story.date}</span>
                </div>
                <button className="btn btn-primary">Read More</button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <p>No stories found matching your search criteria.</p>
          </div>
        )}
      </div>

      <div className="stories-footer">
        <button className="btn btn-secondary">Load More Stories</button>
      </div>
    </div>
  );
}

export default Stories; 