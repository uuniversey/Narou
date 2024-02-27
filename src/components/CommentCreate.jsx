import React, { useState } from "react";

import { useParams, useNavigate } from 'react-router-dom'
import { Alert, styled, Box, InputBase, IconButton, Button, Snackbar } from "@mui/material";

import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

import userInfoStore from '../store/LoginStore'
import useCommentStore from "../store/CommentStore";

import { Send, EmojiEmotions } from "@mui/icons-material";

const CreateCommentBox = styled(Box)`
  display: flex;
  align-items: center;
  margin: 0;
  padding: 10px 0px 0px 0px;
`;

const InputComment = styled(InputBase)`
  flex: 1;
`;

const SendButton = styled(IconButton)`
  margin-left: 10px;
`;

const EmojiPickerContainer = styled('div')`
  position: fixed;
  opacity: 80%;
  left: 60; /* 수정된 부분: 60px로 변경 */
  bottom: 20px;
  z-index: 1;
`;

function CommentCreate() {
  const [newComment, setNewComment] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false); // 스낵바 온오프
  const navigate = useNavigate()
  const { articleId } = useParams()

  const { Token, isLogined } = userInfoStore()
  const { postComment, getComments } = useCommentStore()

  const handleSendClick = async () => {
    try {
      if (!isLogined) {
        setSnackbarOpen(true)
        return
      }

      console.log(`Token: ${Token}`);
      await postComment({
        articleId: articleId,
        content: newComment,
      }, Token);
      setNewComment('');
      // 댓글 작성 후 댓글 목록을 다시 불러와서 업데이트
      await getComments(articleId);
      console.log("댓글 목록 다시 불러오기 성공");
      // navigate(`/article/${articleId}`);
    } catch (error) {
      console.error("댓글 작성 및 목록 불러오기 에러:", error);
    }
  };


  const handleEmojiClick = (emoji) => {
    console.log("이모지 추가^^");
    // 이모지를 텍스트 필드에 추가
    setNewComment((prevComment) => prevComment + emoji.native);
    // 이모지 선택 모달 닫기
    setShowEmojiPicker(false);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };


  return (
    <CreateCommentBox>
      <IconButton onClick={() => setShowEmojiPicker((prev) => !prev)}>
        <EmojiEmotions size="large" />
      </IconButton>
      <InputComment
        placeholder="댓글을 입력해 주세요..."
        inputProps={{ 'aria-label': '댓글창' }}
        label="메시지 입력"
        value={newComment}
        onChange={(event) => setNewComment(event.target.value)}
      />
      <SendButton onClick={handleSendClick} aria-label="전송">
        <Send />
      </SendButton>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert severity="warning" onClose={handleSnackbarClose}>
          로그인을 먼저 해 주세요
        </Alert>
      </Snackbar>

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
      </EmojiPickerContainer>)}
    </CreateCommentBox>

    
  );
}

export default CommentCreate;
