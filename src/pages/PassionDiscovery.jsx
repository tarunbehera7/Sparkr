import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaLightbulb, FaCheck, FaArrowRight, FaSave } from 'react-icons/fa';
import '../styles/PassionDiscovery.css';

const Discover = () => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [savedInterests, setSavedInterests] = useState([]);
  const [showResults, setShowResults] = useState(false);

  // Quiz questions
  const questions = [
    {
      id: 1,
      question: "What type of impact do you want to make?",
      options: [
        { id: 'environmental', label: "Environmental", value: "environmental" },
        { id: 'education', label: "Education", value: "education" },
        { id: 'health', label: "Health & Wellness", value: "health" },
        { id: 'tech', label: "Technology", value: "tech" },
        { id: 'community', label: "Community", value: "community" }
      ]
    },
    {
      id: 2,
      question: "How do you prefer to take action?",
      options: [
        { id: 'hands-on', label: "Hands-on volunteering", value: "hands-on" },
        { id: 'advocacy', label: "Advocacy and awareness", value: "advocacy" },
        { id: 'technical', label: "Technical solutions", value: "technical" },
        { id: 'mentoring', label: "Teaching and mentoring", value: "mentoring" },
        { id: 'organizing', label: "Community organizing", value: "organizing" }
      ]
    },
    {
      id: 3,
      question: "What skills do you want to develop?",
      options: [
        { id: 'communication', label: "Communication", value: "communication" },
        { id: 'technical', label: "Technical skills", value: "technical" },
        { id: 'leadership', label: "Leadership", value: "leadership" },
        { id: 'creative', label: "Creative problem-solving", value: "creative" },
        { id: 'analytical', label: "Analytical thinking", value: "analytical" }
      ]
    },
    {
      id: 4,
      question: "How much time can you commit?",
      options: [
        { id: 'minimal', label: "A few hours per month", value: "minimal" },
        { id: 'moderate', label: "A few hours per week", value: "moderate" },
        { id: 'substantial', label: "Several hours per week", value: "substantial" },
        { id: 'full-time', label: "Full-time commitment", value: "full-time" },
        { id: 'flexible', label: "Flexible, project-based", value: "flexible" }
      ]
    },
    {
      id: 5,
      question: "What motivates you the most?",
      options: [
        { id: 'innovation', label: "Innovation and creativity", value: "innovation" },
        { id: 'education', label: "Learning and teaching", value: "education" },
        { id: 'community', label: "Community building", value: "community" },
        { id: 'sustainability', label: "Environmental sustainability", value: "sustainability" },
        { id: 'health', label: "Health and wellbeing", value: "health" }
      ]
    }
  ];

  // Load saved interests from localStorage if user is logged in
  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`interests_${user.uid}`);
      if (saved) {
        setSavedInterests(JSON.parse(saved));
      }
    }
  }, [user]);

  const handleAnswer = (questionId, value) => {
    setAnswers({
      ...answers,
      [questionId]: value
    });
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Calculate results based on answers
      calculateResults();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const calculateResults = () => {
    const impactType = answers[1] || 'environmental';
    const actionType = answers[2] || 'hands-on';
    const skillType = answers[3] || 'communication';
    
    const causes = [
      {
        id: 1,
        title: "Environmental Conservation",
        description: "Protect ecosystems and promote sustainable practices",
        match: impactType === 'environmental' ? 100 : 20,
        icon: "🌱",
        resources: [
          { title: "Environmental Protection Agency", url: "https://www.epa.gov/" },
          { title: "World Wildlife Fund", url: "https://www.worldwildlife.org/" },
          { title: "Local Conservation Groups", url: "#" }
        ]
      },
      {
        id: 2,
        title: "Education Access",
        description: "Improve educational opportunities for all communities",
        match: impactType === 'education' ? 100 : 30,
        icon: "📚",
        resources: [
          { title: "UNESCO Education", url: "https://en.unesco.org/themes/education" },
          { title: "Khan Academy", url: "https://www.khanacademy.org/" },
          { title: "Local Education Initiatives", url: "#" }
        ]
      },
      {
        id: 3,
        title: "Public Health Initiatives",
        description: "Improve health outcomes and access to healthcare",
        match: impactType === 'health' ? 100 : 25,
        icon: "🏥",
        resources: [
          { title: "World Health Organization", url: "https://www.who.int/" },
          { title: "Global Health Corps", url: "https://ghcorps.org/" },
          { title: "Local Health Organizations", url: "#" }
        ]
      },
      {
        id: 4,
        title: "Technology for Good",
        description: "Use technology to create positive social impact",
        match: impactType === 'tech' ? 100 : 20,
        icon: "💻",
        resources: [
          { title: "Tech for Good", url: "https://www.techforgood.global/" },
          { title: "Code for Good", url: "https://www.codeforgood.org/" },
          { title: "Local Tech Communities", url: "#" }
        ]
      },
      {
        id: 5,
        title: "Community Development",
        description: "Build stronger, more resilient communities",
        match: impactType === 'community' ? 100 : 25,
        icon: "🤝",
        resources: [
          { title: "Community Tool Box", url: "https://ctb.ku.edu/" },
          { title: "United Way", url: "https://www.unitedway.org/" },
          { title: "Local Community Centers", url: "#" }
        ]
      }
    ];

    // Sort causes by match percentage
    const sortedCauses = causes.sort((a, b) => b.match - a.match);
    
    setResults(sortedCauses);
    setShowResults(true);
  };

  const saveInterest = (causeId) => {
    if (!user) {
      alert("Please log in to save your interests");
      return;
    }

    const cause = results.find(c => c.id === causeId);
    if (!cause) return;

    const newInterest = {
      id: causeId,
      title: cause.title,
      date: new Date().toISOString(),
      match: cause.match
    };

    const updatedInterests = [...savedInterests, newInterest];
    setSavedInterests(updatedInterests);
    
    // Save to localStorage
    localStorage.setItem(`interests_${user.uid}`, JSON.stringify(updatedInterests));
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setAnswers({});
    setResults(null);
    setShowResults(false);
  };

  return (
    <div className="passion-discovery-page">
      <div className="passion-header">
        <h1>Discover Your Passion</h1>
        <p>Find causes that align with your values and interests</p>
      </div>

      {!showResults ? (
        <div className="quiz-container">
          <div className="quiz-progress">
            <div 
              className="progress-bar" 
              style={{ width: `${(currentStep / questions.length) * 100}%` }}
            ></div>
            <div className="progress-text">
              Question {currentStep + 1} of {questions.length}
            </div>
          </div>

          <div className="question-card">
            <h2>{questions[currentStep].question}</h2>
            <div className="options-grid">
              {questions[currentStep].options.map((option) => (
                <button
                  key={option.id}
                  className={`option-button ${answers[questions[currentStep].id] === option.value ? 'selected' : ''}`}
                  onClick={() => handleAnswer(questions[currentStep].id, option.value)}
                >
                  {option.label}
                  {answers[questions[currentStep].id] === option.value && (
                    <FaCheck className="check-icon" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="quiz-navigation">
            <button 
              className="back-button" 
              onClick={handleBack}
              disabled={currentStep === 0}
            >
              Back
            </button>
            <button 
              className="next-button" 
              onClick={handleNext}
              disabled={!answers[questions[currentStep].id]}
            >
              {currentStep === questions.length - 1 ? 'See Results' : 'Next'}
              <FaArrowRight />
            </button>
          </div>
        </div>
      ) : (
        <div className="results-container">
          <h2>Your Recommended Causes</h2>
          <p>Based on your answers, here are causes that might interest you:</p>
          
          <div className="causes-grid">
            {results.map((cause) => (
              <div key={cause.id} className="cause-card">
                <div className="cause-icon">{cause.icon}</div>
                <h3>{cause.title}</h3>
                <p>{cause.description}</p>
                <div className="match-percentage">
                  <div className="match-bar">
                    <div 
                      className="match-fill" 
                      style={{ width: `${cause.match}%` }}
                    ></div>
                  </div>
                  <span>{cause.match}% match</span>
                </div>
                <div className="cause-resources">
                  <h4>Resources:</h4>
                  <ul>
                    {cause.resources.map((resource, index) => (
                      <li key={index}>
                        <a href={resource.url} target="_blank" rel="noopener noreferrer">
                          {resource.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <button 
                  className="save-interest-button"
                  onClick={() => saveInterest(cause.id)}
                >
                  <FaSave /> Save Interest
                </button>
              </div>
            ))}
          </div>

          <div className="results-actions">
            <button className="reset-button" onClick={resetQuiz}>
              Take Quiz Again
            </button>
          </div>
        </div>
      )}

      {user && savedInterests.length > 0 && (
        <div className="saved-interests">
          <h2>Your Saved Interests</h2>
          <div className="interests-list">
            {savedInterests.map((interest) => (
              <div key={interest.id} className="interest-item">
                <FaLightbulb className="interest-icon" />
                <div className="interest-details">
                  <h3>{interest.title}</h3>
                  <p>Saved on {new Date(interest.date).toLocaleDateString()}</p>
                  <div className="match-tag">{interest.match}% match</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Discover; 