// Mobile Navigation
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Active navigation link
const sections = document.querySelectorAll('section');
const navLinksArray = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinksArray.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});

// Animated counters
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current);
                setTimeout(updateCounter, 20);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    });
}

// Skill bars animation
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    skillBars.forEach(bar => {
        const width = bar.getAttribute('data-width');
        bar.style.width = width;
    });
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            
            // Trigger specific animations
            if (entry.target.classList.contains('stats-grid')) {
                animateCounters();
            }
            
            if (entry.target.classList.contains('skills-grid')) {
                animateSkillBars();
            }
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.stats-grid, .skills-grid, .project-card, .contact-item');
    animatedElements.forEach(el => observer.observe(el));
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Floating cards random movement
function randomFloatingMovement() {
    const floatingCards = document.querySelectorAll('.floating-card');
    
    floatingCards.forEach((card, index) => {
        const randomX = Math.random() * 20 - 10;
        const randomY = Math.random() * 20 - 10;
        const randomRotation = Math.random() * 10 - 5;
        
        card.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${randomRotation}deg)`;
        
        setTimeout(() => {
            card.style.transform = 'translate(0, 0) rotate(0deg)';
        }, 2000);
    });
}

// Add random movement every 5 seconds
setInterval(randomFloatingMovement, 5000);

// Parallax effect for hero section
// window.addEventListener('scroll', () => {
//     const scrolled = window.pageYOffset;
//     const parallaxElements = document.querySelectorAll('.floating-card');
    
//     parallaxElements.forEach((element, index) => {
//         const speed = 0.5 + (index * 0.1);
//         element.style.transform = `translateY(${scrolled * speed}px)`;
//     });
// });

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Typing effect for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect
document.addEventListener('DOMContentLoaded', () => {
    const heroTitle = document.querySelector('.name');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 100);
        }, 1000);
    }
});

// Add hover effects to project cards
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Add click ripple effect to buttons
function createRipple(event) {
    const button = event.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
    circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
    circle.classList.add('ripple');
    
    const ripple = button.getElementsByClassName('ripple')[0];
    if (ripple) {
        ripple.remove();
    }
    
    button.appendChild(circle);
}

// Add ripple effect to buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', createRipple);
});

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Chatbot Functionality
// Determine API base URL (useful if the page is served from a different port)
const API_BASE_URL = window.location.port === '5000' ? '' : 'http://localhost:5000';

class PortfolioChatbot {
    constructor() {
        this.isOpen = false;
        this.sessionId = this.generateSessionId();
        this.init();
    }
    
    generateSessionId() {
        return 'session_' + Math.random().toString(36).substr(2, 9);
    }
    
    init() {
        this.chatbotToggle = document.getElementById('chatbot-toggle');
        this.chatbotWindow = document.getElementById('chatbot-window');
        this.resizeHandle = document.getElementById('resize-handle');
        this.chatbotClose = document.getElementById('chatbot-close');
        this.chatbotInput = document.getElementById('chatbot-input');
        this.chatbotSend = document.getElementById('chatbot-send');
        this.chatbotMessages = document.getElementById('chatbot-messages');
        this.suggestionsContainer = document.querySelector('.chatbot-suggestions');

        this.loadSuggestions();    
        this.bindEvents();
    }

    async loadSuggestions() {
        if (!this.suggestionsContainer) return;
        try {
            const res = await fetch(`${API_BASE_URL}/suggestions`);
            const data = await res.json();
            this.suggestionsContainer.innerHTML = '';
            data.suggestions.forEach(text => {
                const btn = document.createElement('button');
                btn.className = 'suggestion-btn';
                btn.dataset.message = text;
                btn.textContent = `• ${text}`;  
                this.suggestionsContainer.appendChild(btn);
            });
            this.suggestionBtns = this.suggestionsContainer.querySelectorAll('.suggestion-btn');
            this.addSuggestionEvents();
        } catch (e) {
            console.error('Error loading suggestions:', e);
        }
    }

    addSuggestionEvents() {
        if (!this.suggestionBtns) return;
        this.suggestionBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const message = btn.getAttribute('data-message');
                this.chatbotInput.value = message;
                this.sendMessage();
            });
        });
    }
    
    bindEvents() {
        this.chatbotToggle.addEventListener('click', () => this.toggleChatbot());
        this.chatbotClose.addEventListener('click', () => this.closeChatbot());
        this.chatbotSend.addEventListener('click', () => this.sendMessage());
        this.resizeHandle.addEventListener('mousedown', (e) => this.initResize(e));
        
        this.chatbotInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
        
        // Close chatbot when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.chatbotWindow.contains(e.target) && !this.chatbotToggle.contains(e.target)) {
                this.closeChatbot();
            }
        });
    }
    
    toggleChatbot() {
        if (this.isOpen) {
            this.closeChatbot();
        } else {
            this.openChatbot();
        }
    }
    
    openChatbot() {
        this.isOpen = true;
        this.chatbotWindow.classList.add('active');
        this.chatbotInput.focus();
        
        // Hide suggestions after first interaction
        setTimeout(() => {
            const suggestions = document.querySelector('.chatbot-suggestions');
            if (this.chatbotMessages.children.length > 1) {
                suggestions.style.display = 'none';
            }
        }, 100);
    }
    
    closeChatbot() {
        this.isOpen = false;
        this.chatbotWindow.classList.remove('active');
    }
    
    async sendMessage() {
        const message = this.chatbotInput.value.trim();
        if (!message) return;
        
        console.log('Sending message:', message); // Debug log
        
        // Add user message
        this.addMessage(message, 'user');
        this.chatbotInput.value = '';
        
        // Hide suggestions after first message
        const suggestions = document.querySelector('.chatbot-suggestions');
        suggestions.style.display = 'none';
        
        // Show typing indicator
        this.showTypingIndicator();
        
        try {
            const response = await fetch(`${API_BASE_URL}/chat/stream`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    session_id: this.sessionId
                })
            });
            
            console.log('Response status:', response.status); // Debug log
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const contentType = response.headers.get('Content-Type') || '';
            if (!contentType.includes('text/event-stream')) {
                this.removeTypingIndicator();
                const data = await response.json();
                this.addMessage(data.response || 'No response', 'bot');
                return;
            }
            // Remove typing indicator before streaming
            this.removeTypingIndicator();
            
            // Create bot message container for streaming
            const messageDiv = this.createMessageContainer('bot');
            const messageContent = messageDiv.querySelector('.message-content');
            
            // Handle streaming response
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';
            let messageBuffer = '';
            
            while (true) {
                const { done, value } = await reader.read();
                
                if (done) break;
                
                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop(); // Keep incomplete line in buffer
                
                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(6));
                            console.log('Received data:', data); // Debug log
                            
                            if (data.error) {
                                messageContent.innerHTML = '<p>Sorry, I encountered an error. Please try again.</p>';
                                break;
                            }
                            
                            if (data.done) {
                                // Format the final message content
                                const finalContent = this.formatMessage(messageBuffer);
                                messageContent.innerHTML = finalContent;
                                break;
                            }
                            
                            if (data.content) {
                                messageBuffer += data.content;
                                messageContent.innerHTML = this.formatMessage(messageBuffer);
                                this.scrollToBottom();
                                await new Promise(res => setTimeout(res, 60));
                            }
                        } catch (e) {
                            console.error('Error parsing streaming data:', e);
                        }
                    }
                }
            }
            
        } catch (error) {
            console.error('Chat error:', error);
            this.removeTypingIndicator();
            this.addMessage('Sorry, I\'m having trouble connecting. Please try again later. Error: ' + error.message, 'bot');
        }
    }
    
    createMessageContainer(sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = sender === 'bot' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageContent);
        
        this.chatbotMessages.appendChild(messageDiv);
        this.scrollToBottom();
        
        return messageDiv;
    }
    
    addMessage(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = sender === 'bot' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        // Parse markdown-like formatting
        const formattedContent = this.formatMessage(content);
        messageContent.innerHTML = formattedContent;
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageContent);
        
        this.chatbotMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }
    
    formatMessage(content) {
        // Convert markdown-like formatting to HTML with proper list handling

        const parseInline = (text) => {
            return text
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/`(.*?)`/g, '<code>$1</code>');
        };

        const lines = content.split('\n');
        let html = '';
        let inList = false;

        lines.forEach(line => {
            const headingMatch = line.match(/^(#{1,6})\s+(.*)/); // Markdown headings
            const bulletMatch = line.match(/^\s*([-*•])\s+(.*)/);
            if (bulletMatch) {
                const itemText = bulletMatch[2].trim();
                // If the line ends with a colon, treat it as a heading, not a list item
                if (itemText.endsWith(':')) {
                    if (inList) {
                        html += '</ul>';
                        inList = false;
                    }
                    html += `<p>${parseInline(itemText)}</p>`;
                } else {
                    if (!inList) {
                        html += '<ul>';
                        inList = true;
                    }
                    html += `<li>${parseInline(itemText)}</li>`;
                }
            } else {
                if (inList) {
                    html += '</ul>';
                    inList = false;
                }
                const trimmed = line.trim();
                if (trimmed) {
                    html += `<p>${parseInline(trimmed)}</p>`;
                } else {
                    html += '<br>';
                }
            }
        });

        if (inList) {
            html += '</ul>';
        }

        return html;
    }
    
    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing-message';
        typingDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;
        
        this.chatbotMessages.appendChild(typingDiv);
        this.scrollToBottom();
    }
    
    removeTypingIndicator() {
        const typingMessage = this.chatbotMessages.querySelector('.typing-message');
        if (typingMessage) {
            typingMessage.remove();
        }
    }
    
    initResize(e) {
        e.preventDefault();
        this.startX = e.clientX;
        this.startY = e.clientY;
        const rect = this.chatbotWindow.getBoundingClientRect();
        this.startWidth = rect.width;
        this.startHeight = rect.height;
        this.doResizeBound = this.doResize.bind(this);
        this.stopResizeBound = this.stopResize.bind(this);
        document.addEventListener('mousemove', this.doResizeBound);
        document.addEventListener('mouseup', this.stopResizeBound);
    }

    doResize(e) {
        const newWidth = Math.max(280, this.startWidth + (this.startX - e.clientX));
        const newHeight = Math.max(400, this.startHeight + (this.startY - e.clientY));
        this.chatbotWindow.style.width = `${newWidth}px`;
        this.chatbotWindow.style.height = `${newHeight}px`;
    }

    stopResize() {
        document.removeEventListener('mousemove', this.doResizeBound);
        document.removeEventListener('mouseup', this.stopResizeBound);
    }

    scrollToBottom() {
        this.chatbotMessages.scrollTop = this.chatbotMessages.scrollHeight;
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioChatbot();
});