const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const StompServer = require('@stomp/stompjs');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// STOMP 서버 설정
const stompServer = new StompServer.Server({
  // STOMP 서버가 WebSocket을 사용하도록 설정
  server: server,
  // STOMP 엔드포인트 설정
  path: '/ws',
});

// STOMP 연결 설정
const stompConfig = StompServer.StompConfig([
  {
    route: '/app/chat',
    callback: (body, headers) => {
      // 메시지 수신 시 처리 로직
      const message = JSON.parse(body);
      console.log('Received STOMP message:', message);
      io.emit('message', message);
    },
  },
]);

// STOMP 서버에 연결
stompServer.configure(stompConfig);
stompServer.start();

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
