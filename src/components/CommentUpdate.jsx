import React, { useState } from "react";

import { useNavigate } from 'react-router-dom'
import { TextField, styled, Box, IconButton, InputAdornment, InputBase } from "@mui/material"
import { Check, EmojiEmotions } from "@mui/icons-material";

import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

import userInfoStore from '../store/LoginStore'
import useCommentStore from "../store/CommentStore";

const UpdateCommentBox = styled(Box)`
  display: flex;
  align-items: center;
  margin: 0;
  padding: 0;
`;

const UpdateForm = styled(TextField)`
  width: 100%;
  opacity: 90%;
`

const UpdateButton = styled(IconButton)`
  margin: 0;
`

const EmojiPickerContainer = styled('div')`
  position: fixed;
  opacity: 80%;
  left: 60; /* 수정된 부분: 60px로 변경 */
  bottom: 20px;
  z-index: 1;
`;

function CommentUpdate ({comment, articleId}) {
  const [newComment, setNewComment] = useState(comment.content || '')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const navigate = useNavigate()

  const { Token } = userInfoStore()
  const { updateComment, getComments } = useCommentStore()

  const handleUpdateClick = async () => {
    try {
      console.log(`Token: ${Token}`);
      await updateComment({
        commentId: comment.commentId,
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

  return (
    <UpdateCommentBox>
      <UpdateForm
        variant="filled"
        label="댓글 수정 중...."
        multiline
        rows={2}
        value={newComment}
        onChange={(event) => setNewComment(event.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              {/* <IconButton onClick={() => setShowEmojiPicker((prev) => !prev)}>
                <EmojiEmotions size="large" />
              </IconButton> */}
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowEmojiPicker((prev) => !prev)}>
                <EmojiEmotions size="large" />
              </IconButton>
              <UpdateButton onClick={() => handleUpdateClick()}>
                <Check />
              </UpdateButton>
            </InputAdornment>
          )
        }}
      />  
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

    </UpdateCommentBox>
  )
}

export default CommentUpdate