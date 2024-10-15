// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Connect to MongoDB (update your connection string)
mongoose.connect('mongodb+srv://dbuser:ka33k9449@secretspeak.gf3w9.mongodb.net/chating', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Define the message schema within the server file
const messageSchema = new mongoose.Schema({
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

// Create the message model
const Message = mongoose.model('Message', messageSchema);

app.use(express.static('public'));

// Handle socket connections
io.on('connection', (socket) => {
    console.log('A user connected');

    // Load previous messages from the database and send to the new user
    Message.find().sort({ timestamp: 1 }).then((messages) => {
        messages.forEach(message => {
            socket.emit('chat message', message.content); // Send previous messages to the user
        });
    });

    // Listen for incoming chat messages
    socket.on('chat message', (msg) => {
        const message = new Message({ content: msg });
        message.save()
            .then(() => {
                io.emit('chat message', msg); // Broadcast message to all clients
            })
            .catch(err => console.error('Error saving message:', err));
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Set the server to listen on port 3000
server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
