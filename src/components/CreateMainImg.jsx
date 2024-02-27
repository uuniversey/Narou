// CreateMainImg.jsx

import React, { useState } from 'react';
import { Button, Grid, Card, Typography } from '@mui/material';
import styled from 'styled-components';

const ThumbnailContainer = styled.div`
  white-space: nowrap;
  padding: 20px;
  min-height: 121.2px;
  /* min-height: 79.6px; */
  border: 1px solid lightgray;
`;

const Title = styled.h4`
  margin-block-start: 30px;
  margin-block-end: 10px;
`;

const GridContainer = styled(Grid)`
  display: block;
  overflow-x: auto;
  &::-webkit-scrollbar {
    width: 5px;
    height: 5px;
    border-radius: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #b7cbff;
    /* border: #497CFF 1px solid; */
    border-radius: 6px;
  }
  /* &::-webkit-scrollbar-track {
    background-color: #d4dfff;
  } */
`;

const ThumbnailButton = styled(Button)`
  position: relative;
  border: 1px solid #ccc;
  padding: 4px;
  margin-right: 5px;
  transition: background-color 0.3s;
  &:hover {
    background-color: #f0f0f0;
    .thumbnail-label {
      display: block;
    }
  }

  ${(props) =>
    props.isSelected &&
    `
    box-shadow: 0 0 0 4px #497CFF inset;
    // border: 4px solid #497CFF;
    // background-color: #497CFF;
    .thumbnail-label {
      display: block;
    }
  `}
`;

const ThumbnailImage = styled.img`
  width: 70px;
  height: 70px;
  object-fit: cover;
  cursor: pointer;

  &:hover {
    transform: scale(1.1);
  }
`;

const ThumbnailLabel = styled.span`
  display: ${(props) => (props.isSelected ? 'block' : 'none')};
  position: absolute;
  background-color: #497CFF;
  color: white;
  padding-right: 5px;
  padding-left: 5px;
  font-size: 10px;
  top: 15%;
  left: 35%;
  transform: translate(-50%, -50%);
`;

const CreateMainImg = ({ myPosts, handleMainImageChange }) => {
  const [selectedMainImage, setSelectedMainImage] = useState(null);

  const handleThumbnailClick = (dayIndex, postIndex, mainImagePath) => {
    setSelectedMainImage(`${dayIndex}-${postIndex}`);
    console.log("**********대표사진으로 선택함", selectedMainImage)
    handleMainImageChange(dayIndex, postIndex, mainImagePath);
  };

  return (
    <>
      <Title>라이브러리</Title>
        <ThumbnailContainer>
          <GridContainer container>
            {myPosts.map((dayPosts, dayIndex) => (
              Array.isArray(dayPosts) &&
              dayPosts.map((post, postIndex) => (
                <ThumbnailButton
                  key={`${dayIndex}-${postIndex}`}
                  onClick={() => handleThumbnailClick(dayIndex, postIndex, post.filePath)}
                  isSelected={selectedMainImage === `${dayIndex}-${postIndex}`}
                >
                  <ThumbnailImage src={URL.createObjectURL(post.filePath)} alt={`Thumbnail ${postIndex}`} />
                  <ThumbnailLabel isSelected={selectedMainImage === `${dayIndex}-${postIndex}`}>
                    대표사진
                  </ThumbnailLabel>
                </ThumbnailButton>
              ))
            ))}
          </GridContainer>
        </ThumbnailContainer>
    </>
  );
};

export default CreateMainImg;
