import React, { useState } from 'react'
import { useNavigate } from 'react-router'

import { Grid, Container, styled, Pagination } from '@mui/material'
import { Card } from '@mui/joy'

import BookmarkIcon from '@mui/icons-material/Bookmark'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'

import userInfoStore from '../store/LoginStore'
import userProfileStore from '../store/UserProfileStore'

// 가장 바깥쪽
const ProfileGrid = styled(Grid)`
  margin-top: 30px;
  padding: 16px;
`

// 컴포넌트 좌우로 나누는 css
const InnerGrid = styled(Grid)`
  display: flex;
  flex-direction: row;
  gap: 20px;
  align-items: center;
`

const ScrapCard = styled(Card)`
  padding: 0;
  height: 140px;
  margin-bottom: 10px;
  display: flex;
  transition: background-color 0.3s ease; /* 추가: 배경 색상에 대한 트랜지션 */
  cursor: pointer;
  &:hover {
    background-color: #f0f0f0; /* 변경: 호버 시 배경 색상 */
  }
`

const PaginationStyle = styled(Pagination)`
  display: flex;
  justify-content: center;
`

function UserScrapList() {
  const { Token } = userInfoStore() 
  const { scrapList, userScrap, userUnScrap } = userProfileStore()

  const [ currentPage, setCurrentPage ] = useState(1);
  const [ isScrap, setIsScrap ] = useState(Array(scrapList.length).fill(false))

  const navigate = useNavigate()

  const handlePageNumber = (event, value) => {
    setCurrentPage(value)
  }

  // scrap 버튼 axios
  const handleIsScrap = (index, articleId) => {
    setIsScrap((prev) => {
      const newStates = [...prev]
      newStates[index] = !newStates[index]
      if (newStates[index]) {
        userScrap(articleId, Token)
      } else {
        userUnScrap(articleId, Token)
      }
      return newStates
    })
  }

  const handleClick = (articleId) => {
    console.log('게시글 디테일로 이동!')
    navigate(`/article/${articleId}`)
  }

  

  return (
    <>
      <ProfileGrid item xs={9}>
        {scrapList.slice(currentPage * 6 - 6, currentPage * 6).map((item, index) => (
          <ScrapCard key={index} onClick={() => handleClick(item.id)}>
              <InnerGrid>
                <Grid item xs={2}>
                  <img src={item.thumbnailPath} alt="" 
                    style={{ 
                      width: "100px",
                      marginTop: "20px",
                      marginLeft: "20px",
                      borderRadius: "5px",
                      border: "1px solid whitesmoke"
                    }} />
                </Grid>
                <Grid item xs={10}>
                  <h4 style={{ margin: 0}}>{item.title}</h4>
                  <p style={{ margin: 0 }}>@{item.nickname}</p>
                </Grid>
                {/* <div onClick={() => handleIsScrap(index, item.id)} >
                  {isScrap[index] ? <FixBookmarkIcon/> : <FixBookmarkBorderIcon/> }
                </div> */}
              </InnerGrid>
          </ScrapCard>
        ))}
        <br />
        <PaginationStyle color="primary" count={Math.floor(scrapList.length / 6) + 1} page={currentPage} onChange={handlePageNumber} />
      </ProfileGrid>
    </>
  )
}

export default UserScrapList