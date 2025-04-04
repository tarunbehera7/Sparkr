import React from 'react';
import { FaUsers, FaLightbulb, FaHandshake, FaGlobe } from 'react-icons/fa';

function About() {
  const teamMembers = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Founder & CEO",
      bio: "Passionate about social impact and community building",
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg"
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Head of Community",
      bio: "Experienced in community engagement and social initiatives",
      image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg"
    },
    {
      id: 3,
      name: "Emma Wilson",
      role: "Content Director",
      bio: "Storyteller and content strategist focused on social causes",
      image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg"
    }
  ];

  const values = [
    {
      icon: <FaUsers />,
      title: "Community First",
      description: "We believe in the power of community to drive change"
    },
    {
      icon: <FaLightbulb />,
      title: "Innovation",
      description: "Constantly evolving to better serve our community"
    },
    {
      icon: <FaHandshake />,
      title: "Collaboration",
      description: "Working together to create lasting impact"
    },
    {
      icon: <FaGlobe />,
      title: "Global Impact",
      description: "Connecting changemakers across the world"
    }
  ];

  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="about-hero-content">
          <h1>About StorySpark</h1>
          <p>Empowering communities through storytelling and collective action</p>
        </div>
      </section>

      <section className="mission-section">
        <div className="mission-content">
          <h2>Our Mission</h2>
          <p>
            We are dedicated to creating a platform where stories of change can inspire action,
            where communities can connect and collaborate, and where every individual has the
            opportunity to make a difference in the world.
          </p>
        </div>
      </section>

      <section className="values-section">
        <h2>Our Values</h2>
        <div className="values-grid">
          {values.map((value, index) => (
            <div key={index} className="value-card">
              <div className="value-icon">{value.icon}</div>
              <h3>{value.title}</h3>
              <p>{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="team-section">
        <h2>Our Team</h2>
        <div className="team-grid">
          {teamMembers.map(member => (
            <div key={member.id} className="team-card">
              <div className="team-member-image">
                <img src={member.image} alt={member.name} />
              </div>
              <div className="team-member-info">
                <h3>{member.name}</h3>
                <span className="role">{member.role}</span>
                <p>{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="contact-section">
        <h2>Get in Touch</h2>
        <div className="contact-content">
          <p>Have questions or want to learn more? We'd love to hear from you.</p>
          <form className="contact-form">
            <input type="text" placeholder="Name" />
            <input type="email" placeholder="Email" />
            <textarea placeholder="Message"></textarea>
            <button type="submit" className="btn btn-primary">Send Message</button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default About; 