import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaPlay, FaLightbulb, FaUsers, FaGlobeAmericas, FaRocket, FaCompass, FaHandshake, FaArrowDown } from 'react-icons/fa';
import SocialIcons from '../components/SocialIcons';
import '../styles/Home.css';

const Home = () => {
  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const statsData = [
    { number: "1000+", label: "Impact Stories" },
    { number: "25+", label: "Categories" },
    { number: "100+", label: "Content Partners" },
    { number: "2k+", label: "Learning Resources" }
  ];

  const features = [
    {
      icon: <FaLightbulb />,
      title: "Find Your Passion",
      description: "Discover causes that resonate with your values and interests"
    },
    {
      icon: <FaCompass />,
      title: "Discover",
      description: "Take our quiz to find causes that match your interests and skills"
    },
    {
      icon: <FaUsers />,
      title: "Learn & Grow",
      description: "Access curated resources and expert insights"
    },
    {
      icon: <FaGlobeAmericas />,
      title: "Connect Globally",
      description: "Join a worldwide community of changemakers"
    },
    {
      icon: <FaHandshake />,
      title: "Hub",
      description: "Connect with organizations and take meaningful action"
    },
    {
      icon: <FaRocket />,
      title: "Take Action",
      description: "Turn inspiration into meaningful impact"
    }
  ];

  

  return (
    <div className="home-container">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="background-video"
      >
        <source src="/video/bg2.mp4" type="video/mp4" />
      </video>
      <motion.section
        className="hero-section"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <div className="hero-content">
          <motion.div
            className="discover-badge"
            variants={fadeInUp}
          >
            Discover stories that inspire change
          </motion.div>

          <motion.h1 variants={fadeInUp}>
            Welcome to <span>Sparkr</span>
          </motion.h1>

          <motion.p variants={fadeInUp}>
            Empowering change through stories that connect hearts, minds, and
            communities across the globe.
          </motion.p>

          <motion.div
            className="cta-buttons"
            variants={fadeInUp}
          >
            <Link to="/stories" className="primary-button">
              Explore Stories
            </Link>
            <Link to="/content" className="secondary-button">
              Content Library
            </Link>
          </motion.div>

          <motion.div
            className="social-links-container"
            variants={fadeInUp}
          >
            <SocialIcons />
          </motion.div>
        </div>

        <motion.div
          className="community-image-section"
          variants={fadeInUp}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="animated-scene"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {/* Animated circles representing community members */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="animated-circle"
                initial={{
                  x: Math.random() * 200 - 100,
                  y: Math.random() * 200 - 100,
                  scale: 0
                }}
                animate={{
                  x: Math.random() * 200 - 100,
                  y: Math.random() * 200 - 100,
                  scale: 1
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: i * 0.1
                }}
              />
            ))}

            {/* Connecting lines between circles */}
            <motion.div
              className="connecting-lines"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ duration: 1.5 }}
            />

            {/* Central hub animation */}
            <motion.div
              className="central-hub"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.5
              }}
            >
              <motion.div
                className="hub-pulse"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.2, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          </motion.div>

          <motion.div
          // className="online-status"
          // initial={{ opacity: 0, y: 20 }}
          // animate={{ opacity: 1, y: 0 }}
          // transition={{ delay: 0.8, duration: 0.5 }}
          >
            2,500+ changemakers online now
          </motion.div>
        </motion.div>
      </motion.section>

      {/* <motion.section 
        className="arrow-down-container"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <motion.div 
          className="arrow-down"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <FaArrowDown size={24} color="#6366F1" />
        </motion.div>
      </motion.section> */}

      <motion.section
        className="stats-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
      >
        <div className="stats-grid">
          {statsData.map((stat, index) => (
            <motion.div
              key={index}
              className="stat-card"
              variants={fadeInUp}
              whileHover={{ y: -8, boxShadow: "0px 12px 24px rgba(0, 0, 0, 0.12)" }}
            >
              <h2>{stat.number}</h2>
              <p>{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section
        className="how-it-works"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
      >
        <motion.h2
          className="section-title"
          variants={fadeInUp}
        >
          How Sparkr Works
        </motion.h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="feature-card"
              variants={fadeInUp}
            // whileHover={{ y: -8, boxShadow: "0px 12px 24px rgba(0, 0, 0, 0.12)" }}
            >
              <motion.div
                className="feature-icon"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                {feature.icon}
              </motion.div>
              <div className="feature-content">
                <div className="feature-number">{index + 1}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section
        className="cta-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <motion.h2 variants={fadeInUp}>
          Ready to Make a Difference?
        </motion.h2>
        <motion.p variants={fadeInUp}>
          Join our community of changemakers today
        </motion.p>
        <motion.div variants={fadeInUp}>
          <Link to="/map" className="cta-button">
            Connect Now
          </Link>
        </motion.div>
      </motion.section>
    </div>
  );
};

export default Home; 