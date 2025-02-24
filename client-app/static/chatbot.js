function sendMessage() {
    const userInput = document.getElementById('userInput').value;
    if (userInput.trim() === "") return;

    const messagesDiv = document.getElementById('messages');
    const loadingIndicator = document.getElementById('loadingIndicator');

    // Add user message to the chat window
    const userMessage = document.createElement('li');
    userMessage.classList.add('chat-outgoing', 'chat');
    userMessage.innerHTML = `<p>${userInput}</p>`;
    messagesDiv.appendChild(userMessage);

    // Show loading indicator while waiting for the response
    loadingIndicator.style.display = 'block';  // Make it visible

    // Send the user's input to the backend
    fetch('/ask', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'user_input=' + encodeURIComponent(userInput),
    })
    .then(response => response.json())
    .then(data => {
        const botMessage = document.createElement('li');
        botMessage.classList.add('chat-incoming', 'chat');
        botMessage.innerHTML = `<p>${data.answer}</p>`;
        messagesDiv.appendChild(botMessage);

        // Hide loading indicator after receiving the response
        loadingIndicator.style.display = 'none';  // Hide it again

        // Scroll to the bottom
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    });

    // Clear the input box
    document.getElementById('userInput').value = '';
}



