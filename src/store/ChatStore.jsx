import create from 'zustand';

const useChatStore = create((set) => ({
  roomName: '',
  stompClient: null,
  socket: null,

  // server 연결하기
  connectToServer: () => {
    const newSocket = new SockJS('https://narou-back.duckdns.org/api/narou');
    const newStompClient = new Client({ webSocketFactory: () => newSocket });
    set({ socket: newSocket, stompClient: newStompClient });
    newStompClient.activate();
  },

  // 메시지 보내기 
  sendMessage: async () => {
    const { newMessage, stompClient, messages, roomName } = useStore.getState();
    if (newMessage.trim() !== '') {
      if (stompClient && stompClient.connected) {
        const receiver = 'exampleReceiver';
        const sender = 'exampleSender';
        const generatedRoomName = `${sender}|${receiver}`;
        const message = { sender: 'user', content: newMessage, roomName: generatedRoomName };
        stompClient.publish({ destination: `/chat.send/${generatedRoomName}`, body: JSON.stringify(message) });
        set({ messages: [...messages, message], newMessage: '', roomName: generatedRoomName });
        console.log('메시지 전송 완료 ><');
      } else {
        console.log('STOMP 클라이언트가 연결되지 않았습니다. 연결을 기다립니다...');
        stompClient.onConnect = () => {
          useStore.getState().sendMessage();
        };
      }
    }
  },
}));

export default useChatStore;
