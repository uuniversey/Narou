import React from "react";
import styled from "@emotion/styled";
import CreateListItem from "./CreateListItem";
import { Typography } from "@mui/material";
import empty from "../assets/images/empty.png"

const ListContainer = styled.div`
  display: inline-flex;
  flex-direction: column;
  margin: 10px;
  padding: 10px;
  justify-content: center;
`

const EmptyDiv = styled.div`
  padding: 20px;
  text-align: center;
`

const CreateList = ({ myPosts, handleOpenModal, currentTab, handleMainImageChange }) => {
  const posts = myPosts[currentTab];

  return (
    <ListContainer>
      {posts.length > 0 ? (
        // 게시물이 하나 이상 있는 경우
        posts.map((post, index) => (
          <CreateListItem
            key={index}
            post={post}
            handleOpenModal={handleOpenModal}
            onSetMainImage={() => handleMainImageChange(index)}
          />
        ))
      ) : (
        // 게시물이 하나도 없는 경우
        <EmptyDiv>
          <img src={empty} alt="" style={{ width: "30%"}}/>
          <br />
          <Typography>
            등록된 포스트가 없습니다
          </Typography>
        </EmptyDiv>
      )}
    </ListContainer>
  );
};

export default CreateList;
