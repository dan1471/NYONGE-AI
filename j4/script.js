 document.addEventListener('DOMContentLoaded', () => {
    const chatbox = document.getElementById('chatbox');
    const commandInput = document.getElementById('commandInput');
    const executeBtn = document.getElementById('executeBtn');
    const newChatBtn = document.getElementById('newChatBtn');
    const sidebar = document.getElementById('sidebar');
    const hideSidebarBtn = document.getElementById('hideSidebarBtn');
    const showSidebarBtn = document.getElementById('showSidebarBtn');

    const userName = "Dancan"; // You can change this to your name or take it as input from the user
  
    document.addEventListener('DOMContentLoaded', function() {
        const sidebar = document.querySelector('.sidebar');
        const showButton = document.querySelector('.sidebar-toggle');
        const hideButton = document.querySelector('.sidebar-hide');
        const mainContainer = document.querySelector('.main-container');

        showButton.addEventListener('click', function() {
            sidebar.classList.remove('hidden');
            mainContainer.style.marginLeft = '25%'; /* Adjust for sidebar */
        });

        hideButton.addEventListener('click', function() {
            sidebar.classList.add('hidden');
            mainContainer.style.marginLeft = '0'; /* Full width */
        });
    });
 

 
    function wishMe() {
        const hour = new Date().getHours();
        let greeting = '';
        if (hour >= 0 && hour < 12) {
            greeting = `Good Morning, ${userName}`;
        } else if (hour >= 12 && hour < 18) {
            greeting = `Good Afternoon, ${userName}`;
        } else {
            greeting = `Good Evening, ${userName}`;
        }
        appendMessage('system', greeting);
        speak(greeting);
        speak('I am JARVIS. Please tell me how I can help you, SIR?');
    }

    function executeQuery(query) {
        appendMessage('user', query);
        showTypingIndicator();

        axios.post('https://api.aimlapi.com/v1/chat/completions', {
            model: "mistralai/Mistral-7B-Instruct-v0.2",
            messages: [
                {
                    "role": "system",
                    "content": "You are an AI assistant who knows everything."
                },
                {
                    "role": "user",
                    "content": query
                }
            ]
        }, {
            headers: {
                'Authorization': `Bearer aeeea78df44f4f32adb78dc20c988de4`
            }
        })
        .then(response => {
            const message = response.data.choices[0].message.content;
            const fullMessage = `s${message}`;
            removeTypingIndicator();
            typeMessage('assistant', fullMessage);
            speak(fullMessage);
        })
        .catch(error => {
            console.error('Error:', error);
            removeTypingIndicator();
            appendMessage('system', 'Sorry, an error occurred.');
        });
    }

    function appendMessage(sender, text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        messageDiv.textContent = text;
        chatbox.appendChild(messageDiv);
        chatbox.scrollTop = chatbox.scrollHeight;
    }

    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message assistant typing';
        typingDiv.id = 'typingIndicator';
        typingDiv.textContent = 'typing...';
        chatbox.appendChild(typingDiv);
        chatbox.scrollTop = chatbox.scrollHeight;
    }

    function removeTypingIndicator() {
        const typingDiv = document.getElementById('typingIndicator');
        if (typingDiv) {
            chatbox.removeChild(typingDiv);
        }
    }

    function typeMessage(sender, text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        chatbox.appendChild(messageDiv);

        let index = 0;
        function type() {
            if (index < text.length) {
                messageDiv.textContent += text.charAt(index);
                index++;
                setTimeout(type, 20);
            }
        }
        type();
    }

    function speak(text) {
        const speech = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(speech);
    }

    function startNewChat() {
        chatbox.innerHTML = '<div class="message system">Hello! I am Jarvis. How can I assist you today?</div>';
        commandInput.value = '';
        wishMe();
    }

    function toggleSidebar() {
        sidebar.classList.toggle('hidden');
        showSidebarBtn.style.display = sidebar.classList.contains('hidden') ? 'block' : 'none';
    }

    executeBtn.addEventListener('click', () => {
        const query = commandInput.value;
        if (query.toLowerCase() === 's') {
            appendMessage('system', "Stopped. You can enter a new command.");
            commandInput.value = '';
            return;
        }
        executeQuery(query);
        commandInput.value = '';
    });

    commandInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            executeBtn.click();
        }
    });

    newChatBtn.addEventListener('click', startNewChat);

    hideSidebarBtn.addEventListener('click', toggleSidebar);
    showSidebarBtn.addEventListener('click', toggleSidebar);

    wishMe();
});
