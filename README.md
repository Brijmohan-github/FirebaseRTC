
# FirebaseRTC

A simple WebRTC video chat application using Firebase for signaling.

## Prerequisites

- Node.js and npm installed (for local development, if needed)
- A Firebase project (Firestore enabled)
- Firebase SDK included in your project
- Modern web browser (Chrome, Firefox, Edge, Safari)
- Camera and microphone access enabled in browser
- Internet connection

## How It Works

1. **User opens the app** and clicks "Open camera & microphone" to grant access and see their local video.
2. **Caller** clicks "Create room" to start a new video chat room. The app creates a Firestore room and stores the SDP offer and ICE candidates.
3. **Callee** clicks "Join room" and enters the room ID. The app retrieves the offer, sets up the peer connection, creates an SDP answer, and exchanges ICE candidates.
4. **Both users** see each other's video once the WebRTC connection is established and media streams are exchanged.
5. **Hangup** closes the connection and deletes the room from Firestore.

## File Overview

- `public/index.html`: Main HTML file, UI for video chat and room controls.
- `public/app.js`: Main JavaScript logic for WebRTC, Firebase signaling, and UI event handling.
- `public/main.css`: Basic styles for the app.
- `firebase.json`: Firebase project configuration.
- `database.rules.json`: Firestore security rules.
- `firebase-debug.log`: Firebase debug log (if present).

## Setup

1. Clone the repository.
2. Set up your Firebase project and update the Firebase config in your HTML/JS files.
3. Make sure Firestore is enabled and security rules allow signaling.
4. Open `index.html` in your browser, or serve with a local server (e.g., MAMP, http-server).

## Usage

- Open the app in two browser windows/devices.
- Click "Open camera & microphone" in both.
- One user clicks "Create room" and shares the room ID.
- The other user clicks "Join room" and enters the room ID.
- Both users should see each other's video.


## Migrating to WebSocket Signaling (Remove Firebase Dependency)

To convert this project to use WebSockets for signaling instead of Firebase:

### 1. Set Up a WebSocket Server
- Use Node.js with the `ws` library or any backend that supports WebSockets.
- The server should accept connections and relay signaling messages (SDP offers/answers, ICE candidates) between peers in the same room.

### 2. Remove Firebase Code
- Delete all Firebase imports and Firestore logic from your JavaScript.
- Remove Firestore room creation, candidate storage, and snapshot listeners.

### 3. Add WebSocket Client Code
- In your frontend (`app.js`), connect to the WebSocket server:
	```js
	const socket = new WebSocket('ws://YOUR_SERVER_ADDRESS');
	```
- Listen for messages:
	```js
	socket.onmessage = (event) => {
		const data = JSON.parse(event.data);
		// Handle offer, answer, ICE candidate
	};
	```
- Send signaling data:
	```js
	socket.send(JSON.stringify({ type: 'offer', offer: offer, room: roomId }));
	socket.send(JSON.stringify({ type: 'answer', answer: answer, room: roomId }));
	socket.send(JSON.stringify({ type: 'candidate', candidate: candidate, room: roomId }));
	```

### 4. Update Signaling Logic
- When creating/joining a room, use the WebSocket to send/receive offers, answers, and ICE candidates.
- The server should forward these messages to the correct peer(s) in the room.

### 5. Update UI and Room Management
- Implement simple room management on the server (e.g., keep a map of room IDs to connected clients).
- On the client, keep the room ID and use it in all signaling messages.

### 6. Test the Application
- Run the WebSocket server.
- Open the app in two browser windows/devices.
- Connect both clients to the same room via WebSocket.
- Verify video/audio connection works as before.

---

For questions or improvements, feel free to open an issue or pull request.
