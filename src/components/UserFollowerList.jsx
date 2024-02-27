import React, { useState } from 'react'
import { Typography, Grid, Container, styled, Pagination, ImageList, ImageListItem, Button } from '@mui/material'

import userProfileStore from '../store/UserProfileStore'
import userInfoStore from '../store/LoginStore'

import { useNavigate } from 'react-router-dom'

const Title = styled(Typography)`
  margin-bottom: 30px;
  color: #497cff;
  text-align: left;
  margin-top: 2px;
`

const ProfileGrid = styled(Grid)`
  margin-top: 30px;
  padding: 16px;
  /* display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center; */
`

const PaginationStyle = styled(Pagination)`
  display: flex;
  justify-content: center;
`

const JustifyButton = styled(Button)`
  display: flex;
  justify-content: left;
  margin: 0;
  align-items: center;
  gap: 5px;
  color: black;
  width: 95%;
`

function UserFollowerList() {

  const { followerList, getUserData, userData } = userProfileStore()
  const { Token } = userInfoStore()

  const navigate = useNavigate()

  const [currentPage, setCurrentPage] = useState(1)
  const handlePageNumber = (event, value) => {
    setCurrentPage(value)
  }

  // const moveFollow = async (userId) => {
  //   await getUserData(userId, Token)
  //   navigate(`/profile/${userId}`)
  // }

  return (
    <>
      <ProfileGrid item xs={9}>
        <Title variant="h5">
          나를 팔로우하는 사람들
        </Title> 
        <div>
          <ImageList>
            {followerList.slice(currentPage * 8 - 8, currentPage * 8).map((item, index) => (
              <ImageListItem key={index} cols={2}>
                <JustifyButton>
                {/* <JustifyButton onClick={() => moveFollow(item.userId)}> */}
                  <img
                    style={{ borderRadius: '50%', width: '30px', height: '30px' }}
                    src = {item.profileImage} 
                  />
                  <h4>{item.nickname}</h4>
                </JustifyButton>
                <hr style={{ width: "95%", margin: "0", border: "1px solid whitesmoke"}}/>
              </ImageListItem>
            ))}
           
          </ImageList>
        </div>
        <br />
        <PaginationStyle color="primary" count={Math.floor(followerList.length / 8) + 1} page={currentPage} onChange={handlePageNumber} />
        
      </ProfileGrid>
    </>
  )
}

export default UserFollowerList
