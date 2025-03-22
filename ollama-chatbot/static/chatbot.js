
function sendMessage() {
    const userInput = document.getElementById('userInput').value;
    if (userInput.trim() === "") return;

    const messagesDiv = document.getElementById('messages');

    // Add user message to the chat window
    const userMessage = document.createElement('li');
    userMessage.classList.add('chat-outgoing', 'chat');
    userMessage.innerHTML = `<p>${userInput}</p>`;
    messagesDiv.appendChild(userMessage);

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

        // Scroll to the bottom
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    });

    // Clear the input box
    document.getElementById('userInput').value = '';

    
}

// Start scoping
let currentIndex = 0;  // Track question index

async function fetchQuestion(index = 0, answer = null) {
    let response = await fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ index: index, answer: answer })
    });

    let data = await response.json();
        displayQuestion(data);
    }

function displayQuestion(data) {
    let openInputContainer = document.getElementById("open-input");
    let multiChoiceContainer = document.getElementById("multi-choice-container");

    currentIndex = data.index; // Update question index
    const messagesDiv = document.getElementById('messages');
    if (data.responses) {
        // Chat is finished
        // questionElement.innerText = data.message;
        // optionsContainer.innerHTML = "<p>Thank you for your responses!</p>";
        // Show list of responses
        const botMessage = document.createElement('li');
        botMessage.classList.add('chat-incoming', 'chat');
        botMessage.innerHTML = `<p>${data.message}</p>`;
        messagesDiv.appendChild(botMessage);
        openInputContainer.style.display = "none";
        multiChoiceContainer.style.display = "none";
    } else {
        // Show new question
        const botMessage = document.createElement('li');
        botMessage.classList.add('chat-incoming', 'chat');
        botMessage.innerHTML = `<p>${data.message}</p>`;
        messagesDiv.appendChild(botMessage);
        // Append options to this

        // Scroll to the bottom
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
        openInputContainer.style.display = "none";
        multiChoiceContainer.style.display = "none";

        if (data.type === "mcq") {
            // Display single-choice buttons
            data.options.forEach(option => {
                let btn = document.createElement("button");
                btn.innerText = option;
                btn.onclick = () => handleAnswer(option);
            });
        } else if (data.type === "mcq_multi") {
            // Display multiple-choice checkboxes
            data.options.forEach(option => {
                let label = document.createElement("label");
                label.classList.add("checkbox-label");
        
                let checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.value = option;
                checkbox.name = "multi-choice";
                label.appendChild(checkbox);
                
                // Add text with spacing
                 // Add text directly as a separate span
                let textSpan = document.createElement("span");
                textSpan.textContent = " " + option;
                label.appendChild(textSpan); // Append the span inside label

                const optionMessage = document.createElement('li');
                optionMessage.classList.add('chat-incoming', 'chat');
                optionMessage.appendChild(label);
                messagesDiv.appendChild(optionMessage);
            });

            multiChoiceContainer.style.display = "block"; // Show Submit button
        } else {
            // Show text input for open-ended questions
            openInputContainer.style.display = "block";
        }
    }
}

function handleAnswer(answer) {
    fetchQuestion(currentIndex, answer);
}

function submitOpenAnswer() {
    let customAnswer = document.getElementById("custom-answer").value.trim();
    if (customAnswer !== "") {
        const messagesDiv = document.getElementById('messages');

        // Add user message to the chat window
        const userMessage = document.createElement('li');
        userMessage.classList.add('chat-outgoing', 'chat');
        userMessage.innerHTML = `<p>${customAnswer}</p>`;
        messagesDiv.appendChild(userMessage);
        fetchQuestion(currentIndex, customAnswer);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
        document.getElementById('custom-answer').value = '';
    }
}

function submitMultiChoiceAnswer() {
    let selectedOptions = [];
    let checkboxes = document.getElementsByName("multi-choice");
    const messagesDiv = document.getElementById('messages');
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            selectedOptions.push(checkbox.value);
        }
    });

    if (selectedOptions.length > 0) {
        fetchQuestion(currentIndex, selectedOptions); // Send selected options as a list
    }
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Start the chat
fetchQuestion();