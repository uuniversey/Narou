import React, { useState } from 'react'
import { useNavigate } from 'react-router'

import { Grid, Container, styled, Pagination, ImageList, ImageListItem, ImageListItemBar } from '@mui/material'

import userProfileStore from '../store/UserProfileStore'

const ProfileGrid = styled(Grid)`
  margin-top: 30px;
  padding: 16px;
`

const InnerGrid = styled(Grid)`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  margin-top: 0.5px;
`

const ArticleList = styled(ImageList)`
  width: 100%;
  margin: 0;
  & .MuiImageListItem-root {
    margin: 5px; /* 여백 크기 조절 */
    position: relative; /* 부모에 대한 상대 위치 설정 */
    overflow: hidden; /* ImageListItemBar가 표시되도록 오버플로우 설정 */
    transition: transform 0.3s ease-in-out; /* 호버 트랜지션 설정 */
    &:hover {
      /* transform: scale(1.1) */
      .MuiImageListItemBar-root {
        opacity: 1; /* 호버 시 ImageListItemBar 표시 */
        background-color: rgba(0, 0, 0, 0.2);
      }
    }
  }
  & .MuiImageListItemBar-root {
    opacity: 0;
    transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
  }
  & .MuiImageListItemBar-root {
    opacity: 0;
    transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
    background-color: rgba(0, 0, 0, 0.2)
  }
`

const CustomImageListItem = styled(ImageListItem)`
  &:hover {
    background-color: rgba(255, 255, 255, 0.8); 
    /* transform: scale(1.1);  */
    transition: background-color 0.3s ease-in-out, transform 0.3s ease-in-out;
  }
`

function UserArticleList() {
  const { userArticle } = userProfileStore()

  const navigate = useNavigate()

  const handleClick = (articleId) => {
    console.log('게시글 디테일로 이동!')
    navigate(`/article/${articleId}`)
  }

  return (
    <>
      <ProfileGrid item xs={9}>
          <InnerGrid container spacing={1}>
            <ArticleList cols={4} style={{ width: '100%'}}>
                {userArticle.map((item, index) => (
                  <CustomImageListItem>
                    <img
                      key={index}
                      src={`${item.thumbnailPath}?w=180&h=180&fit=crop&auto=format`}
                      alt={item.title}
                      style={{ 
                        cursor: 'pointer', 
                        border: '1px solid whitesmoke'
                      }}
                      onClick={() => handleClick(item.id)}
                    />
                   <ImageListItemBar
                      title={item.title}
                      subtitle={`@${item.nickname}`}
                    />
                  </CustomImageListItem>
                ))}
            </ArticleList>
          </InnerGrid> 
      </ProfileGrid>
    </>
  )
}

export default UserArticleList