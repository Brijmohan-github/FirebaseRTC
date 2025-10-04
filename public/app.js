// WebSocket signaling
const socket = new WebSocket('ws://localhost:9000');

socket.onopen = () => {
  console.log('Brij - WebSocket connection opened');
};

socket.onerror = (err) => {
  console.error('Brij - WebSocket error:', err);
};

socket.onclose = () => {
  console.log('Brij - WebSocket connection closed');
};

socket.onmessage = async (event) => {
  const data = JSON.parse(event.data);
  if (data.room !== roomId) return;

  if (data.type === 'offer') {
    console.log('Brij - received offer');
    if (!peerConnection) {
      await joinRoomById(data.room);  // ✅ ensure peerConnection is ready
    }
    await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    socket.send(JSON.stringify({ type: 'answer', answer, room: roomId }));
  } 
  else if (data.type === 'answer') {
    console.log('Brij - received answer');
    await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
  } 
  else if (data.type === 'candidate') {
    console.log('Brij - received candidate');
    if (peerConnection) {
      try {
        await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
      } catch (e) {
        console.error("Error adding ice candidate", e);
      }
    }
  }
};

async function createRoom() {
  peerConnection = new RTCPeerConnection(configuration);
  registerPeerConnectionListeners();
  roomId = Math.random().toString(36).substr(2, 9);
  document.querySelector('#currentRoom').innerText = `Current room is ${roomId} - You are the caller!`;

  if (!localStream) {
    await openUserMedia(); // ✅ make sure camera is open
  }

  localStream.getTracks().forEach(track => {
    peerConnection.addTrack(track, localStream);
  });

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      socket.send(JSON.stringify({ type: 'candidate', candidate: event.candidate, room: roomId }));
    }
  };

  peerConnection.ontrack = (event) => {
    document.querySelector('#remoteVideo').srcObject = event.streams[0];
  };

  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);

  socket.send(JSON.stringify({ type: 'offer', offer, room: roomId }));
}

function joinRoom() {
  roomDialog.open();
  document.querySelector('#confirmJoinBtn').addEventListener('click', async () => {
    roomId = document.querySelector('#room-id').value;
    document.querySelector('#currentRoom').innerText = `Current room is ${roomId} - You are the callee!`;
    await joinRoomById(roomId);
  }, { once: true });
}

async function joinRoomById(roomIdInput) {
  peerConnection = new RTCPeerConnection(configuration);
  registerPeerConnectionListeners();

  if (!localStream) {
    await openUserMedia(); // ✅ ensure local stream exists
  }

  localStream.getTracks().forEach(track => {
    peerConnection.addTrack(track, localStream);
  });

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      socket.send(JSON.stringify({ type: 'candidate', candidate: event.candidate, room: roomId }));
    }
  };

  peerConnection.ontrack = (event) => {
    document.querySelector('#remoteVideo').srcObject = event.streams[0];
  };
}
