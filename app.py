from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import os
from datetime import datetime
import json

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure OpenAI API
openai.api_key = os.getenv('OPENAI_API_KEY')  # Set this in your environment variables

# Gavriel's portfolio context - This is the knowledge base about you
PORTFOLIO_CONTEXT = """
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

PERSONALITY:
- Analytical and results-driven
- Passionate about solving real-world problems with AI
- Eager to contribute to data-driven innovation
- Strong collaboration and communication skills
- Always learning and adapting to new technologies

Answer questions about Gavriel's background, experience, projects, and skills. Be enthusiastic and professional. If asked about specific technical details, provide concrete examples from his work. If someone asks about contacting him, provide his contact information. Always be helpful and showcase his expertise.
"""

def get_chatbot_response(user_message, conversation_history=[]):
    """
    Generate a response using OpenAI's GPT model with Gavriel's portfolio context
    """
    try:
        # Prepare the conversation with system context
        messages = [
            {"role": "system", "content": PORTFOLIO_CONTEXT}
        ]
        
        # Add conversation history (last 10 messages to maintain context)
        for msg in conversation_history[-10:]:
            messages.append(msg)
        
        # Add the current user message
        messages.append({"role": "user", "content": user_message})
        
        # Call OpenAI API
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",  # You can upgrade to gpt-4 if you have access
            messages=messages,
            max_tokens=500,
            temperature=0.7,
            top_p=1,
            frequency_penalty=0,
            presence_penalty=0
        )
        
        return response.choices[0].message.content.strip()
    
    except Exception as e:
        return f"I apologize, but I'm experiencing technical difficulties. Please try again later or contact Gavriel directly at gabikir1999@gmail.com. Error: {str(e)}"

# Store conversation history (in production, use a proper database)
conversations = {}

@app.route('/', methods=['GET'])
def home():
    """Health check endpoint"""
    return jsonify({
        "status": "active",
        "message": "Gavriel Kirichenko's Portfolio Chatbot API",
        "timestamp": datetime.now().isoformat()
    })

@app.route('/chat', methods=['POST'])
def chat():
    """Main chat endpoint"""
    try:
        data = request.get_json()
        
        if not data or 'message' not in data:
            return jsonify({'error': 'No message provided'}), 400
        
        user_message = data['message'].strip()
        session_id = data.get('session_id', 'default')
        
        if not user_message:
            return jsonify({'error': 'Empty message'}), 400
        
        # Get or initialize conversation history
        if session_id not in conversations:
            conversations[session_id] = []
        
        conversation_history = conversations[session_id]
        
        # Generate response
        bot_response = get_chatbot_response(user_message, conversation_history)
        
        # Update conversation history
        conversation_history.append({"role": "user", "content": user_message})
        conversation_history.append({"role": "assistant", "content": bot_response})
        
        # Keep only last 20 messages to prevent memory issues
        conversations[session_id] = conversation_history[-20:]
        
        return jsonify({
            'response': bot_response,
            'timestamp': datetime.now().isoformat(),
            'session_id': session_id
        })
    
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@app.route('/reset', methods=['POST'])
def reset_conversation():
    """Reset conversation history"""
    try:
        data = request.get_json()
        session_id = data.get('session_id', 'default')
        
        if session_id in conversations:
            del conversations[session_id]
        
        return jsonify({
            'message': 'Conversation reset successfully',
            'session_id': session_id
        })
    
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@app.route('/suggestions', methods=['GET'])
def get_suggestions():
    """Get suggested questions for users"""
    suggestions = [
        "Tell me about Gavriel's experience with machine learning",
        "What projects has Gavriel worked on?",
        "What are Gavriel's technical skills?",
        "How can I contact Gavriel?",
        "What's Gavriel's educational background?",
        "Tell me about the AI chatbot project",
        "What was Gavriel's role at YLTSP Software?",
        "What programming languages does Gavriel know?",
        "Show me Gavriel's data visualization experience"
    ]
    
    return jsonify({'suggestions': suggestions})

if __name__ == '__main__':
    # Check if OpenAI API key is set
    if not os.getenv('OPENAI_API_KEY'):
        print("⚠️  WARNING: OPENAI_API_KEY environment variable not set!")
        print("Please set your OpenAI API key:")
        print("export OPENAI_API_KEY='your-api-key-here'")
        print("\nOr add it to a .env file")
    
    print("🚀 Starting Gavriel's Portfolio Chatbot API...")
    print("📡 API will be available at: http://localhost:5000")
    print("💬 Chat endpoint: http://localhost:5000/chat")
    print("🔄 Reset endpoint: http://localhost:5000/reset")
    print("💡 Suggestions endpoint: http://localhost:5000/suggestions")
    
    app.run(debug=True, host='0.0.0.0', port=5000)