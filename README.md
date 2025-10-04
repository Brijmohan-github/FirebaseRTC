
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

## Troubleshooting

- Ensure camera/microphone permissions are granted.
- Check browser console for errors.
- Verify Firebase configuration and Firestore rules.
- Use a TURN server for NAT/firewall traversal if needed.

---

For questions or improvements, feel free to open an issue or pull request.
