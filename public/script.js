// script.js
const socket = io();


// Handle form submission
const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');

// Define restricted words
const restrictedWords = ["bsdk", "tmkc", "loude", "fuck"];

form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (input.value) {
        // Check if the input contains any restricted words
        const containsRestrictedWords = restrictedWords.some(word => 
            input.value.toLowerCase().includes(word)
        );

        if (containsRestrictedWords) {
            alert("These words are restricted on this website!");
            input.value = ''; // Clear input field to prevent sending
            return; // Stop further execution
        }

        socket.emit('chat message', input.value); // Send message to the server
        input.value = ''; // Clear input field 
    }
});

// Listen for incoming messages
socket.on('chat message', function (msg) {
    const li = document.createElement('li');
    li.textContent = msg; // Display the message
    messages.appendChild(li);
    window.scrollTo(0, document.body.scrollHeight); // Scroll to the bottom
});
