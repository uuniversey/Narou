import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { styled, Button, Menu, MenuItem, ListItemIcon, Avatar } from "@mui/material";
import { Delete, AccountCircle, Send } from "@mui/icons-material";

import CommentUpdate from "./CommentUpdate";

import userInfoStore from "../store/LoginStore";
import useCommentStore from "../store/CommentStore";

const Comment = styled('p')`
  margin: 10px 0px 10px 0px;
`;

const InfoContainer = styled('div')`
  margin: 0px 0px 5px 0px;
  display: flex;
  align-items: center;
  font-weight: bold;
`;

const ProfileButton = styled('p')`
  margin: 0px;
  cursor: pointer;
  margin-left: 5px;
  margin-right: auto;
`;

const CustomButton = styled(Button)`
  min-width: 40px;
  color: lightgrey;
  padding: 0px;
`;

const StyledMenu = styled(Menu)`
  border-radius: 5px;
  box-shadow: none !important;
  border: 1px solid lightgray;
  /* width: 300px; */
`;

const StyledMenuItem = styled(MenuItem)`
  font-size: small;
  margin: 0;
  /* border-radius: 4px; */

  &:hover {
    background-color: #f0f0f0;
  }
`;

const Content = styled('p')`
  margin: 0;
  /* font-size: small; */
`;

const CommentListItem = ({ comment, articleId }) => {
  const navigate = useNavigate();
  const { Token, userInfo } = userInfoStore()
  const { deleteComment } = useCommentStore();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false)

  // 삭제 관련 동작
  const handleDelete = () => {
    console.log('삭제 동작 시작!');
    console.log(Token);
    deleteComment({
      commentId: comment.commentId,
    }, Token);
    navigate(`/article/${articleId}/`);
  };


  // 수정 관련 동작
  const handleUpdate = () => {
    // 댓글 수정을 위한 상태 변경
    setIsUpdating(true);
  };

  const handleCancelUpdate = () => {
    // 댓글 수정 취소 시 상태 변경
    setIsUpdating(false);
  };


  // 유저 프로필 관련 동작
  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuChat = () => {
    const encodedUserId = encodeURIComponent(`${userInfo.userId}|${comment.userId}`);
    navigate(`/Chat/${encodedUserId}`);
    handleMenuClose();
  }

  const handleMenuProfile = () => {
    navigate(`/profile/${comment.userId}`);
    handleMenuClose();
  };

  
  if (comment.deleted === 0) {
    return (
      <Comment>
        {isUpdating ? (
          <>
            <hr style={{ border: "1px solid #cad9ff" }}/>
            <CommentUpdate
              comment={comment}
              articleId={articleId}
              onCancelUpdate={handleCancelUpdate}
            />
          </>
        ) : (
          <>
            <hr style={{ border: "1px solid #cad9ff" }}/>
            <InfoContainer>
              {/* 프사 */}
              <Avatar src={comment.profileImage} alt="User Avatar"/>
              {/* 닉네임 */}
              <ProfileButton onClick={handleProfileClick}>{comment.nickname}</ProfileButton>
              <StyledMenu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "center" }}
                getContentAnchorEl={null}
                style={{ opacity: "95%" }}
              >
                <StyledMenuItem onClick={handleMenuProfile}>
                  <ListItemIcon>
                    <AccountCircle fontSize="small" />
                  </ListItemIcon>
                  프로필로 이동
                </StyledMenuItem>
                <StyledMenuItem onClick={handleMenuChat}>
                  <ListItemIcon>
                    <Send fontSize="small" />
                  </ListItemIcon>
                  메시지 보내기            
                </StyledMenuItem>
              </StyledMenu>
              <CustomButton onClick={handleUpdate} size="small">수정</CustomButton>
              <CustomButton onClick={handleDelete} size="small">삭제</CustomButton>
            </InfoContainer>
            {/* 댓글 내용 */}
            <Content>{comment.content}</Content>
          </>
        )}
      </Comment>
    );
  } else {
    // comments.deleted 값이 0이 아니면 null 또는 다른 처리를 할 수 있음
    return null;
  }
};

export default CommentListItem;