import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'
import { styled, Container, TextField, Button, Typography, Grid } from '@mui/material';
import { EmojiEmotions, Send } from '@mui/icons-material';
import userInfoStore from '../store/LoginStore';

// 이모지 관련 import
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

// import io from 'socket.io-client';
// const socket = io('http://localhost:3000/');

import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const ChatContainer = styled(Container)`
  padding: 20px;
`;

const ChatBox = styled("div")`
  padding: 20px;
  border-radius: 15px;
  background-color: whitesmoke;
  height: 440px;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 5px;
    height: 5px;
    border-radius: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: lightgrey;
    opacity: 50%;
    border-radius: 6px;
  }
  margin-bottom: 20px;
`;

const ChatRoomList = styled("div")`
  padding: 20px;
  border-radius: 15px;
  background-color: lightgray;
  height: 440px;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 5px;
    height: 5px;
    border-radius: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: lightgrey;
    opacity: 50%;
    border-radius: 6px;
  }
  margin-bottom: 20px;
`;

const MessageBubble = styled("div")`
  display: flex;
  justify-content: ${({ sender }) => (sender === 'user' ? 'flex-end' : 'flex-start')};
  margin-bottom: 8px;
`;

const StyledPaper = styled("div")`
  padding: 12px;
  max-width: 70%;
  word-wrap: break-word;
  opacity: 90%;
  background: ${({ sender }) => (sender === 'user' ? '#497CFF' : '#E0E0E0')};
  color: ${({ sender }) => (sender === 'user' ? 'white' : 'black')};
  border-radius: 12px;
  border: 1px solid #BDBDBD;
`;

const SendButton = styled(Button)`
  height: 56px; /* 동일한 높이로 조절 */
  background-color: #497cff;
  color: white;
  &:hover {
    background-color: white;
    color: #497cff;
  }
`;

const EmojiPickerContainer = styled('div')`
  position: absolute;
  bottom: 100px;
  opacity: 80%;
  right: 320px;
  z-index: 1;
`;

const EmojiButton = styled(Button)`
  height: 56px;
  background-color: #497cff;
  color: white;
  &:hover {
    background-color: white;
    color: #497cff;
  }
`;

const Chat = () => {
  const { roomId } = useParams()

  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')

  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [roomName, setRoomName] = useState(roomId)
  const { userInfo } = userInfoStore()

  // roomId 받아오기
  useEffect(() => {
    // 최우선으로 roomId를 받아올 수 있는 로직 추가
    if (!roomName && roomId) {
      console.log('roomId를 최우선으로 받아옵니다:', roomId);
      setRoomName(roomId);
    }
  }, [roomName, roomId]);


  // SockJS 생성
  const socket = new SockJS('http://localhost:8080/narou')
  // const socket = new SockJS('https://narou-back.duckdns.org/api/narou')


  // STOMP 클라이언트 생성
  const stompClient = new Client({ webSocketFactory: () => socket })


  // STOMP 클라이언트 활성화
  useEffect(() => {
    stompClient.activate();
    return () => {
      stompClient.deactivate();
    };
  }, [stompClient]);


   // 메시지 전송 함수
   const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      // STOMP 클라이언트가 연결되어 있는지 확인
      if (stompClient.connected) {
        const message = newMessage
        // const message = { 
        //   userId: userInfo.userId, 
        //   chatRoomId: roomName,
        //   messageType: "CHAT",
        //   contentType: "TEXT",
        //   content: newMessage, 
        // };

        // private Long userId;
        // private String chatRoomId;
        // private SimpMessageType messageType;
        // private ContentType contentType;
        // private String content;

        stompClient.publish({ destination: `http://localhost:8080/chat/chat.send/${roomName}`, body: message });
        // stompClient.publish({ destination: '/app/chat', body: JSON.stringify(message) });
        setMessages([...messages, message]);
        console.log(`메시지 보내는 중...🎉 : ${message}`)
        setNewMessage('');
      } else {
        // 연결이 되어 있지 않다면 연결될 때까지 대기
        console.log('STOMP 클라이언트가 연결되지 않았습니다. 연결을 기다립니다...');
        stompClient.onConnect = () => {
          // 연결이 되면 메시지 전송
          handleSendMessage();
        };
      }
    }
  };

  // 이모지 선택 함수
  const handleEmojiClick = (emoji) => {
    console.log("이모지 추가^^")
    setNewMessage((prevMessage) => prevMessage + emoji.native)
    setShowEmojiPicker(false)
  }

  // 메시지 업데이트시 맨 아래로 스크롤 함수
  const scrollToBottom = () => {
    const chatBox = document.getElementById('chat-box')
    if (chatBox) {
      chatBox.scrollTop = chatBox.scrollHeight
    }
  }

  // useEffect: 메시지 업데이트시 맨 아래로 스크롤
  useEffect(() => {
    scrollToBottom()
  }, [messages])


  // useEffect: 컴포넌트 마운트시 STOMP 이벤트 핸들러 등록, 언마운트시 연결 해제
  useEffect(() => {

    // 새로운 메시지를 받아와서 클라이언트에서 표시하고, 화면을 스크롤해서 최신 메시지를 보여주는 등의 역할
    const handleNewMessage = (message) => {
      console.log('새로운 메시지:', message);
      setMessages((prevMessages) => [...prevMessages, message]);
      scrollToBottom();
    };

    // subscribe를 시도합니다^^
    stompClient.onConnect = () => {
      console.log(`/chat.register/${roomName}`)
      // stompClient.subscribe(`http://localhost:8080/chat/chat.register/${roomName}`, handleNewMessage);
      stompClient.subscribe(`http://localhost:8080/chat/chat.register/${roomName}`);
    };

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, [stompClient, roomName]);



  return (
    <ChatContainer>
      <Typography variant="h5" style={{ marginBottom: '10px', color: '#497cff' }}>
        #@$님과의 채팅
      </Typography>

      <Grid container spacing={2}>
        {/* 채팅창 */}
        <Grid item xs={9}>
          <ChatBox id="chat-box">
            {messages.map((message, index) => (
              <MessageBubble key={index} sender={userInfo.userId}>
                <StyledPaper sender={userInfo.userId}>
                  {message.content}
                </StyledPaper>
              </MessageBubble>
            ))}
          </ChatBox>
          {/* 메시지 입력 / 이모지 버튼 / 전송 버튼 */}
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={9}>
              <TextField
                fullWidth
                label="메시지 입력"
                value={newMessage}
                onChange={(event) => setNewMessage(event.target.value)}
                onKeyPress={(event) => {
                  if (event.key === 'Enter') {
                    handleSendMessage();
                  }
                }}
              />
            </Grid>
            <Grid item xs={1}>
              <EmojiButton variant="outlined" onClick={() => setShowEmojiPicker((prev) => !prev)}>
                <EmojiEmotions size="large" />
              </EmojiButton>
            </Grid>
            <Grid item xs={2}>
              <SendButton
                fullWidth
                endIcon={<Send />}
                variant="outlined"
                size="large"
                onClick={handleSendMessage}
              >
                전송
              </SendButton>
            </Grid>

            {/* 이모지 선택 모달 */}
            {showEmojiPicker && (
              <EmojiPickerContainer>
                <Picker
                  native
                  data={data}
                  set="emojione"
                  emoji="point_up"
                  onEmojiSelect={handleEmojiClick}
                  title="이모지를 선택하세요"
                />
              </EmojiPickerContainer>
            )}
          </Grid>
        </Grid>

        {/* 채팅방 목록 */}
        <Grid item xs={3}>
          <ChatRoomList>
            <Typography variant="h" style={{ color: '#497cff', fontWeight: "bold"}}>
              채팅 목록
            </Typography>
            {/* 여기에 채팅방 목록을 표시하는 컴포넌트를 넣으세요 */}
          </ChatRoomList>
        </Grid>
      </Grid>
    </ChatContainer>
  );
};

export default Chat;