from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from openai import OpenAI
import os
from datetime import datetime
import json
import time
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure OpenAI client (new v1.0+ syntax)
client = OpenAI(
    api_key=os.getenv('OPENAI_API_KEY')
)

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

FORMATTING INSTRUCTIONS:
- Use markdown formatting in your responses for better readability
- Use **bold** for important points and project names
- Use *italic* for emphasis
- Use bullet points (- or *) for lists
- Use ### for section headers when appropriate
- Use `code blocks` for technical terms and technologies
- Use --- for separators when listing multiple items
- Make responses well-structured and visually appealing

PERSONALITY:
- Analytical and results-driven
- Passionate about solving real-world problems with AI
- Eager to contribute to data-driven innovation
- Strong collaboration and communication skills
- Always learning and adapting to new technologies

Answer questions about Gavriel's background, experience, projects, and skills. Be enthusiastic and professional. Use markdown formatting to make responses clear and visually appealing. If asked about specific technical details, provide concrete examples from his work. If someone asks about contacting him, provide his contact information. Always be helpful and showcase his expertise.
"""

def get_chatbot_response_stream(user_message, conversation_history=[]):
    """
    Generate a streaming response using OpenAI's GPT model
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
        
        # Call OpenAI API with streaming
        stream = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages,
            max_tokens=800,
            temperature=0.7,
            top_p=1,
            frequency_penalty=0,
            presence_penalty=0,
            stream=True
        )
        
        return stream
    
    except Exception as e:
        print(f"OpenAI API Error: {str(e)}")
        return None

def get_chatbot_response(user_message, conversation_history=[]):
    """
    Generate a non-streaming response using OpenAI's GPT model
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
        
        # Call OpenAI API without streaming
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            max_tokens=800,
            temperature=0.7,
            top_p=1,
            frequency_penalty=0,
            presence_penalty=0
        )
        
        return response.choices[0].message.content.strip()
    
    except Exception as e:
        print(f"OpenAI API Error: {str(e)}")
        return f"I apologize, but I'm experiencing technical difficulties. Please try again later or contact Gavriel directly at **gabikir1999@gmail.com**. \n\nYou can also connect with him on:\n- **LinkedIn**: https://www.linkedin.com/in/gavrielkirichenko/\n- **GitHub**: https://github.com/gabikir99\n- **Kaggle**: https://www.kaggle.com/gavrielkirichenko"

# Store conversation history (in production, use a proper database)
conversations = {}

@app.route('/', methods=['GET'])
def home():
    """Health check endpoint"""
    return jsonify({
        "status": "active",
        "message": "Gavriel Kirichenko's Portfolio Chatbot API",
        "timestamp": datetime.now().isoformat(),
        "openai_configured": bool(os.getenv('OPENAI_API_KEY')),
        "features": ["streaming", "markdown", "conversation_memory"]
    })

@app.route('/chat', methods=['POST'])
def chat():
    """Main chat endpoint with non-streaming response"""
    try:
        data = request.get_json()
        
        if not data or 'message' not in data:
            return jsonify({'error': 'No message provided'}), 400
        
        user_message = data['message'].strip()
        session_id = data.get('session_id', 'default')
        
        if not user_message:
            return jsonify({'error': 'Empty message'}), 400
        
        # Check if OpenAI API key is configured
        if not os.getenv('OPENAI_API_KEY'):
            return jsonify({
                'response': "I'm currently not configured with an OpenAI API key. Please contact Gavriel directly:\n\n**📧 Email**: gabikir1999@gmail.com\n**💼 LinkedIn**: https://www.linkedin.com/in/gavrielkirichenko/\n**💻 GitHub**: https://github.com/gabikir99\n**📊 Kaggle**: https://www.kaggle.com/gavrielkirichenko",
                'timestamp': datetime.now().isoformat(),
                'session_id': session_id,
                'formatted': True
            })
        
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
            'session_id': session_id,
            'formatted': True
        })
    
    except Exception as e:
        print(f"Chat endpoint error: {str(e)}")
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@app.route('/chat/stream', methods=['POST', 'GET'])
def chat_stream():
    """Streaming chat endpoint"""
    def generate():
        try:
            data = request.get_json()
            
            if not data or 'message' not in data:
                yield f"data: {json.dumps({'error': 'No message provided'})}\n\n"
                return
            
            user_message = data['message'].strip()
            session_id = data.get('session_id', 'default')
            
            if not user_message:
                yield f"data: {json.dumps({'error': 'Empty message'})}\n\n"
                return
            
            # Check if OpenAI API key is configured
            if not os.getenv('OPENAI_API_KEY'):
                fallback_response = "I'm currently not configured with an OpenAI API key. Please contact Gavriel directly:\n\n**📧 Email**: gabikir1999@gmail.com\n**💼 LinkedIn**: https://www.linkedin.com/in/gavrielkirichenko/\n**💻 GitHub**: https://github.com/gabikir99\n**📊 Kaggle**: https://www.kaggle.com/gavrielkirichenko"
                
                # Stream the fallback response word by word
                words = fallback_response.split(' ')
                for i, word in enumerate(words):
                    chunk_data = {
                        'content': word + ' ',
                        'timestamp': datetime.now().isoformat(),
                        'session_id': session_id,
                        'formatted': True
                    }
                    yield f"data: {json.dumps(chunk_data)}\n\n"
                    time.sleep(0.05)  # Small delay for better UX
                
                yield f"data: {json.dumps({'done': True})}\n\n"
                return
            
            # Get or initialize conversation history
            if session_id not in conversations:
                conversations[session_id] = []
            
            conversation_history = conversations[session_id]
            
            # Add user message to conversation history
            conversation_history.append({"role": "user", "content": user_message})
            
            # Get streaming response
            stream = get_chatbot_response_stream(user_message, conversation_history)
            
            if stream is None:
                yield f"data: {json.dumps({'error': 'Failed to get response from AI'})}\n\n"
                return
            
            # Stream the response
            full_response = ""
            for chunk in stream:
                if chunk.choices[0].delta.content is not None:
                    content = chunk.choices[0].delta.content
                    full_response += content
                    
                    chunk_data = {
                        'content': content,
                        'timestamp': datetime.now().isoformat(),
                        'session_id': session_id,
                        'formatted': True
                    }
                    yield f"data: {json.dumps(chunk_data)}\n\n"
                    # Flush the data to ensure it's sent immediately
                    yield f": keepalive\n\n"
            
            # Update conversation history with full response
            conversation_history.append({"role": "assistant", "content": full_response})
            conversations[session_id] = conversation_history[-20:]
            
            # Send completion signal
            yield f"data: {json.dumps({'done': True})}\n\n"
            
        except Exception as e:
            print(f"Streaming error: {str(e)}")
            yield f"data: {json.dumps({'error': f'Streaming error: {str(e)}'})}\n\n"
    
    response = Response(generate(), mimetype='text/event-stream')
    response.headers['Cache-Control'] = 'no-cache'
    response.headers['X-Accel-Buffering'] = 'no'
    return response

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
        "Tell me about Gavriel's ML experience",
        "What projects has he worked on?",
        "What are his technical skills?",
        "How can I contact Gavriel?",
        "What's his educational background?",
        "Tell me about the AI chatbot project",
        "What was his role at YLTSP Software?",
        "Show me his data visualization work",
        "What makes Gavriel unique as a developer?"
    ]
    
    return jsonify({'suggestions': suggestions})

@app.route('/health', methods=['GET'])
def health_check():
    """Detailed health check"""
    api_key_configured = bool(os.getenv('OPENAI_API_KEY'))
    
    health_status = {
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'openai_api_configured': api_key_configured,
        'active_conversations': len(conversations),
        'version': '2.0.0',
        'features': {
            'streaming': True,
            'markdown_formatting': True,
            'conversation_memory': True,
            'fallback_mode': True
        }
    }
    
    # Test OpenAI connection if API key is configured
    if api_key_configured:
        try:
            test_response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": "test"}],
                max_tokens=5
            )
            health_status['openai_connection'] = 'working'
        except Exception as e:
            health_status['openai_connection'] = f'error: {str(e)}'
            health_status['status'] = 'degraded'
    
    return jsonify(health_status)

if __name__ == '__main__':
    # Check if OpenAI API key is set
    if not os.getenv('OPENAI_API_KEY'):
        print("⚠️  WARNING: OPENAI_API_KEY environment variable not set!")
        print("The chatbot will still run but will show formatted contact information instead of AI responses.")
        print("\nTo enable AI responses:")
        print("1. Get an API key from: https://platform.openai.com/api-keys")
        print("2. Set the environment variable:")
        print("   export OPENAI_API_KEY='your-api-key-here'")
        print("   OR add it to a .env file")
    else:
        print("✅ OpenAI API key detected!")
    
    print("\n🚀 Starting Gavriel's Portfolio Chatbot API v2.0...")
    print("📡 API will be available at: http://localhost:5000")
    print("💬 Chat endpoint: http://localhost:5000/chat")
    print("🌊 Streaming chat: http://localhost:5000/chat/stream")
    print("🔄 Reset endpoint: http://localhost:5000/reset")
    print("💡 Suggestions endpoint: http://localhost:5000/suggestions")
    print("🏥 Health check: http://localhost:5000/health")
    print("\n✨ New features: Streaming responses, Markdown formatting, Enhanced UX")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
