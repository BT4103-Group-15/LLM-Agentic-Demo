
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
let inQueryMode = false;
let currentIndex = 0;  // Track question index

async function fetchQuestion(index = 0, answer = null, query = false) {
    let response = await fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ index: index, answer: answer , in_query_mode: query})
    });

    let data = await response.json();
        displayQuestion(data);
    }

function displayQuestion(data) {
    let openInputContainer = document.getElementById("open-input");
    let multiChoiceContainer = document.getElementById("multi-choice-container");
    let radioChoiceContainer = document.getElementById("multi-choice-single-container");

    currentIndex = data.index; // Update question index
    const messagesDiv = document.getElementById('messages');
    if (data.terminate) {
        const botMessage = document.createElement('li');
        botMessage.classList.add('chat-incoming', 'chat');
        botMessage.innerHTML = `<p>${data.message}</p>`;
        messagesDiv.appendChild(botMessage);
        document.getElementById("open-input").classList.add('hidden');
        inQueryMode = false;
        return;
    }

    if (data.query_prompt) {
        inQueryMode = true;
    }

    // show appropriate input
    if (inQueryMode || data.query_prompt) {
        document.getElementById("open-input").classList.remove('hidden');
    }

    if (data.responses) {
        // Chat is finished
        // questionElement.innerText = data.message;
        // optionsContainer.innerHTML = "<p>Thank you for your responses!</p>";
        // Show list of responses
        const botMessage = document.createElement('li');
        botMessage.classList.add('chat-incoming', 'chat');
        botMessage.innerHTML = `<p>${data.message}</p>`;
        messagesDiv.appendChild(botMessage);
        openInputContainer.classList.add('hidden');
        multiChoiceContainer.classList.add('hidden');
        radioChoiceContainer.classList.add('hidden');
    } else {
        // Show new question
        const botMessage = document.createElement('li');
        botMessage.classList.add('chat-incoming', 'chat');
        botMessage.innerHTML = `<p>${data.message}</p>`;
        messagesDiv.appendChild(botMessage);
        // Append options to this

        // Scroll to the bottom
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
        openInputContainer.classList.add('hidden');
        multiChoiceContainer.classList.add('hidden');
        radioChoiceContainer.classList.add('hidden');

        if (data.type === "mcq") {
            // Display single-choice buttons
            data.options.forEach(option => {
                    const label = document.createElement("label");
                    const radio = document.createElement("input");
                    
                    radio.type = "radio";
                    radio.value = option;
                    radio.name = "mcq-options"; // Same name to allow single selection
                    
                    label.appendChild(radio);
                    label.appendChild(document.createTextNode(" " + option));

                    const optionMessage = document.createElement('li');
                    optionMessage.classList.add('chat-incoming', 'chat');
                    optionMessage.appendChild(label);
                    messagesDiv.appendChild(optionMessage);
            });
            radioChoiceContainer.style.display = "block";
        } else if (data.type === "mcq_multi") {
            // Display multiple-choice checkboxes
            data.options.forEach((option, index) => {
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
                //let o_index = data.options.indexOf(option);
                textSpan.textContent = " " + data.text[index] || option;
                label.appendChild(textSpan); // Append the span inside label

                const optionMessage = document.createElement('li');
                optionMessage.classList.add('chat-incoming', 'chat');
                optionMessage.appendChild(label);
                messagesDiv.appendChild(optionMessage);
            });

            multiChoiceContainer.classList.remove('hidden'); // Show Submit button
        } else {
            // Show text input for open-ended questions
            openInputContainer.classList.remove('hidden');
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
        fetchQuestion(currentIndex, customAnswer, inQueryMode);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
        document.getElementById('custom-answer').value = '';
        openInputContainer.classList.remove('hidden');
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
    // Add user message to the chat window
    const userMessage = document.createElement('li');
    userMessage.classList.add('chat-outgoing', 'chat');
    userMessage.innerHTML = `<p>${selectedOptions}</p>`;
    messagesDiv.appendChild(userMessage);
    document.querySelectorAll("input[type='checkbox']").forEach(checkbox => {
        checkbox.checked = false;
    });
    if (selectedOptions.length > 0) {
        fetchQuestion(currentIndex, selectedOptions); // Send selected options as a list
    }
    
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function getSelectedRadioOption() {
    let selected = document.querySelector('input[name="mcq-options"]:checked');
    if (selected) {
        const messagesDiv = document.getElementById('messages');
        const userMessage = document.createElement('li');
        userMessage.classList.add('chat-outgoing', 'chat');
        userMessage.innerHTML = `<p>${selected.value}</p>`;
        messagesDiv.appendChild(userMessage);
        fetchQuestion(currentIndex, selected.value);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
    
    document.querySelectorAll('input[name="mcq-options"]:checked').forEach(radio =>{
        radio.checked = false;
    });
}


// Start the chat
fetchQuestion();