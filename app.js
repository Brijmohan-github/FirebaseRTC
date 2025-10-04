// Simple Node.js WebSocket signaling server for WebRTC

const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 9000 });

// Map of roomId to array of clients
const rooms = {};

wss.on('connection', function connection(ws) {
  console.log('New client connected');
  ws.on('message', function incoming(message) {

    if (Buffer.isBuffer(message)) {
        message = message.toString();
    }


    console.log('Received message:', message);
        let data;
        try {
        data = JSON.parse(message);
        } catch (e) {
        return;
        }
        const { type, room, offer, answer, candidate } = data;
        console.log('Brij - type, room, offer, answer, candidate: ', type, room, offer, answer, candidate);
        ws.room = room;
        console.log('Brij - room', room);
        if (!rooms[room]) rooms[room] = [];
        if (!rooms[room].includes(ws)) rooms[room].push(ws);

        // Relay signaling messages to other clients in the room
       // Only relay offer, answer, candidate
        if (type === 'offer' || type === 'answer' || type === 'candidate') {
        rooms[room].forEach(client => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
        });
    }
});


 
ws.on('close', function() {
    console.log('Brij - close ');
if (ws.room && rooms[ws.room]) {
    rooms[ws.room] = rooms[ws.room].filter(client => client !== ws);
    if (rooms[ws.room].length === 0) delete rooms[ws.room];
}
});
});

console.log('WebSocket signaling server running on ws://localhost:9000');
