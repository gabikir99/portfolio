const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Portfolio context for the chatbot
const PORTFOLIO_CONTEXT = `
You are an AI assistant representing Gavriel Kirichenko's portfolio. You have detailed knowledge about his background, skills, and projects.

ABOUT GAVRIEL:
- Data Scientist & AI Developer from Bradford, Ontario
- Currently pursuing Applied AI Solutions Development at George Brown College (2025-Present)
- Bachelor of Arts in Computer Science from York University (2017-2023)
- Google Advanced & General Data Analytics Certifications (2024)
- Email: gabikir1999@gmail.com | Phone: (647) 608-3345
- LinkedIn: https://www.linkedin.com/in/gavrielkirichenko/
- GitHub: https://github.com/gabikir99
- Kaggle: https://www.kaggle.com/gavrielkirichenko

TECHNICAL SKILLS:
- Programming & ML: Python, TensorFlow/Keras, PyTorch, scikit-learn, Hugging Face Transformers
- Signal Processing & Computer Vision: OpenCV, frame differencing, contour detection, time-series pipelines
- Data Science: pandas, NumPy, regression/classification models, feature engineering, Excel
- Visualization: Tableau, Power BI, Matplotlib, Seaborn, PowerPoint
- DevOps & Cloud: AWS, Docker, Git, GitHub Actions, CI/CD pipelines
- ML Concepts: CNNs, RNNs, LSTMs, NLP, sentiment analysis, model evaluation, hyperparameter tuning

WORK EXPERIENCE:
- Junior Python Developer Intern at YLTSP SOFTWARE Inc. (Jan 2023 - Aug 2023)
  * Led A/B testing in Python and SQL, boosting user engagement by 12%
  * Automated ETL pipelines, reduced query time by 25%
  * Collaborated with front-end teams to deploy variants 20% faster
  * Designed OOP-driven Python modules for data automation

KEY PROJECTS:
1. AI-Powered Career Coaching Chatbot (2025)
   - Built with Python, Flask, OpenAI GPT-4 API, custom memory management
   - 95%+ text extraction accuracy from PDF resumes
   - Dynamic prompt templates and user context retention

2. LLM-Powered Banking Assistant
   - OpenAI API, LangChain, FastAPI, ChromaDB integration
   - RAG-style contextual retrieval and Model Context Protocol (MCP)
   - Session memory and streaming responses

3. Cybersecurity Visualization Dashboard (2025)
   - Tableau Prep Builder for data cleaning and enrichment
   - Interactive dashboards with geospatial maps and temporal trends
   - Clustering and conditional formatting for anomaly detection

4. Chess Game Outcome Predictor (2023)
   - Python and scikit-learn on historical Kaggle data
   - Random Forest classification with feature engineering
   - Led data cleaning and transformation of raw chess moves
`;

// Mock chatbot response function (since we can't use OpenAI API in WebContainer)
function getChatbotResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    if (message.includes('contact') || message.includes('email') || message.includes('phone')) {
        return `You can contact Gavriel through:

**📧 Email**: gabikir1999@gmail.com
**📱 Phone**: (647) 608-3345
**💼 LinkedIn**: https://www.linkedin.com/in/gavrielkirichenko/
**💻 GitHub**: https://github.com/gabikir99
**📊 Kaggle**: https://www.kaggle.com/gavrielkirichenko

Feel free to reach out for collaboration opportunities or to discuss his projects!`;
    }
    
    if (message.includes('skill') || message.includes('tech')) {
        return `Gavriel's **Technical Skills** include:

**🐍 Programming & ML**: Python, TensorFlow/Keras, PyTorch, scikit-learn, Hugging Face Transformers

**👁️ Computer Vision**: OpenCV, frame differencing, contour detection, time-series pipelines

**📊 Data Science**: pandas, NumPy, regression/classification models, feature engineering, Excel

**📈 Visualization**: Tableau, Power BI, Matplotlib, Seaborn, PowerPoint

**☁️ DevOps & Cloud**: AWS, Docker, Git, GitHub Actions, CI/CD pipelines

**🧠 ML Concepts**: CNNs, RNNs, LSTMs, NLP, sentiment analysis, model evaluation, hyperparameter tuning`;
    }
    
    if (message.includes('project')) {
        return `Here are Gavriel's **Key Projects**:

**🤖 AI-Powered Career Coaching Chatbot (2025)**
- Built with Python, Flask, OpenAI GPT-4 API
- 95%+ text extraction accuracy from PDF resumes
- Dynamic prompt templates and user context retention

**🏦 LLM-Powered Banking Assistant**
- OpenAI API, LangChain, FastAPI, ChromaDB integration
- RAG-style contextual retrieval and Model Context Protocol (MCP)
- Session memory and streaming responses

**🔒 Cybersecurity Visualization Dashboard (2025)**
- Tableau Prep Builder for data cleaning and enrichment
- Interactive dashboards with geospatial maps and temporal trends
- Clustering and conditional formatting for anomaly detection

**♟️ Chess Game Outcome Predictor (2023)**
- Python and scikit-learn on historical Kaggle data
- Random Forest classification with feature engineering
- Led data cleaning and transformation of raw chess moves`;
    }
    
    if (message.includes('education') || message.includes('study') || message.includes('degree')) {
        return `**🎓 Gavriel's Educational Background**:

**Current**: Applied AI Solutions Development at George Brown College (2025-Present)
- Focusing on cutting-edge AI technologies and practical applications

**Bachelor of Arts in Computer Science** from York University (2017-2023)
- Strong foundation in computer science principles and programming

**Google Advanced & General Data Analytics Certifications (2024)**
- Industry-recognized expertise in data analysis and visualization

This combination of formal education and professional certifications gives him a well-rounded foundation in both theoretical concepts and practical applications.`;
    }
    
    if (message.includes('experience') || message.includes('work') || message.includes('job')) {
        return `**💼 Gavriel's Work Experience**:

**Junior Python Developer Intern** at YLTSP SOFTWARE Inc. (Jan 2023 - Aug 2023)

Key Achievements:
- **📈 Led A/B testing** in Python and SQL, boosting user engagement by 12%
- **⚡ Automated ETL pipelines**, reduced query time by 25%
- **🚀 Collaborated with front-end teams** to deploy variants 20% faster
- **🏗️ Designed OOP-driven Python modules** for data automation

This role gave him hands-on experience with data-driven development, performance optimization, and cross-functional collaboration in a professional software development environment.`;
    }
    
    // Default response
    return `Hello! I'm here to help you learn about **Gavriel Kirichenko**, a talented Data Scientist and AI Developer.

**🎯 What would you like to know?**
- His technical skills and expertise
- Recent projects and achievements
- Educational background
- Work experience
- How to contact him

**📍 Quick Facts**:
- 🎓 Currently studying Applied AI Solutions Development at George Brown College
- 💻 Experienced in Python, ML, Data Science, and AI
- 🏆 Google Data Analytics Certified
- 🔬 Passionate about solving real-world problems with AI

Feel free to ask me anything about Gavriel's background, skills, or projects!`;
}

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        message: "Gavriel Kirichenko's Portfolio API",
        features: ['portfolio', 'chatbot', 'contact_info']
    });
});

app.post('/chat', (req, res) => {
    try {
        const { message, session_id = 'default' } = req.body;
        
        if (!message || !message.trim()) {
            return res.status(400).json({ error: 'No message provided' });
        }
        
        const response = getChatbotResponse(message.trim());
        
        res.json({
            response,
            timestamp: new Date().toISOString(),
            session_id,
            formatted: true
        });
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ error: 'Server error occurred' });
    }
});

app.get('/suggestions', (req, res) => {
    const suggestions = [
        "Tell me about Gavriel's ML experience",
        "What projects has he worked on?",
        "What are his technical skills?",
        "How can I contact Gavriel?",
        "What's his educational background?",
        "Tell me about the AI chatbot project",
        "What was his role at YLTSP Software?",
        "Show me his data visualization work",
        "What makes Gavriel unique as a developer?"
    ];
    
    res.json({ suggestions });
});

app.post('/reset', (req, res) => {
    const { session_id = 'default' } = req.body;
    res.json({
        message: 'Conversation reset successfully',
        session_id
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Gavriel's Portfolio Server running on port ${PORT}`);
    console.log(`📡 API available at: http://localhost:${PORT}`);
    console.log(`💬 Chat endpoint: http://localhost:${PORT}/chat`);
    console.log(`💡 Suggestions: http://localhost:${PORT}/suggestions`);
    console.log(`🏥 Health check: http://localhost:${PORT}/health`);
});