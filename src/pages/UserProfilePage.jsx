
import React, { useState, useEffect } from 'react'

import { useParams } from 'react-router'
import { useNavigate } from 'react-router-dom'

import { Card, Container, Button, Grid, styled, TextField, IconButton } from '@mui/material'
import { Edit, Opacity, Settings } from '@mui/icons-material'

import UserArticleList from '../components/UserArticleList'
import UserScrapList from '../components/UserScrapList'
import ImgUpload from '../components/ImgUpload'
import UserFollowerList from '../components/UserFollowerList'
import UserFollowingList from '../components/UserFollowingList'

import userInfoStore from '../store/LoginStore'
import userProfileStore from '../store/UserProfileStore'
import useCreateStore from '../store/CreateStore'


const ProfileGrid = styled(Grid)`
  display: flex;
  margin-top: 30px;
  text-align: center;
  flex-direction: column;
  align-items: center;
`

const Nickname = styled('p')`
  font-size: 18px;
  font-weight: bold;
  margin: 10px 0;
  display: inline-block;
`

const Bio = styled('p')`
  font-size: 14px;
  margin: 5px 0;
`

const FlexDiv = styled('div')`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  gap: 10px;
  width: 100%;
`

const RowDiv = styled('div')`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
`

const UserCard = styled(Card)`
  background-color: #ecf2ff;
  border-radius: 20px;
  padding: 16px;
`

const EditForm = styled('form')`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`

const EditableTextField = styled(TextField)`
  width: 100%;
  margin-bottom: 15px;
`

const EditButton = styled(IconButton)`
  margin-left: auto;
`

const FoButton = styled(Button)`
  color: black;
  font-size: 12px;
  white-space: pre-wrap;
`

const UserProfileImg = styled('img')`
  display: block;
  width: 230px;
  height: 230px;
  margin-bottom: 10px;
  position: relative;
  background-color: lightgrey;
  border-radius: 50%;

`

function UserProfile() {
  const { targetId } = useParams()
  const navigate = useNavigate()

  const { userInfo, Token } = userInfoStore()
  const { 
    userData,
    userArticle,
    userFollowing,
    userUnFollow,
    followList,
    followerList,
    scrapList,
    getUserData,
    getUserArticle,
    getScrapData,
    getFollowList,
    getFollowerList,
    userIntroEdit,
    tempFile
  } = userProfileStore()

  const [ isScrap, setIsScrap ] = useState(0)
  const [ imgData, setImgData ] = useState(0)
  const [ profileImg, setProfileImg ] = useState(userData.profileImage)
  const [ isFollow, setIsFollow ] = useState(userData.isFollowing)
  const [ render, setRender ] = useState(null)
  const [ isEditingProfile, setIsEditingProfile ] = useState(false)
  const [ editedNickname, setEditedNickname ] = useState(userData.nickname)
  const [ editedBio, setEditedBio ] = useState(userData.introduction)
  const [ followers, setFollowers ] = useState(userData.followers)
  const [ followings, setFollowings ] = useState(userData.followings)
  const { profileCropImage } = useCreateStore()

  useEffect(() => {
    getUserData(targetId, Token)

  }, [targetId])

  // useEffect(() => {
  //   getUserData(targetId, Token)
  //     .then(() => {
        
  //       // userArticle 받기
  //       getUserArticle(userData.nickname)
        
  //       // 팔로우 정보 받아놓기
  //       getFollowList(userData.userId)
        
  //       // 팔로워 정보 받아놓기
  //       getFollowerList(userData.userId)
        
  //       // 스크랩 데이터 받아놓기
  //       getScrapData(userData.userId)

  //       setProfileImg(userData.profileImage)
  //       setIsFollow(userData.isFollowing)
  //       setEditedNickname(userData.nickname)
  //       setEditedBio(userData.introduction)
  //       setFollowers(userData.followers) 
  //       setFollowings(userData.followings) 
  //     })
  // }, [targetId])
  
  useEffect(() => {
    // userArticle 받기
    getUserArticle(userData.nickname)
    
    // 팔로우 정보 받아놓기
    getFollowList(userData.userId)
    
    // 팔로워 정보 받아놓기
    getFollowerList(userData.userId)
    
    // 스크랩 데이터 받아놓기
    getScrapData(userData.userId)

    setProfileImg(userData.profileImage)
    setIsFollow(userData.isFollowing)
    setEditedNickname(userData.nickname)
    setEditedBio(userData.introduction)
    setFollowers(userData.followers) 
    setFollowings(userData.followings) 
  }, [userData])
  
  // useEffect(() => {
  //   console.log('ㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ')
  //   setProfileImg(userData.profileImage)
  //   setIsFollow(userData.isFollowing)
  //   setEditedNickname(userData.nickname)
  //   setEditedBio(userData.introduction)
  // }, [userData])


  const handleIsScrap = () => {
    setIsScrap((prevState) => !prevState)
    setRender(null)
  }

  const handleImgData = (imgData) => {
    setImgData(imgData)
  }

  const moveMessage = () => {
    navigate('/chat')
  }

  const handleIsFollow = () => {

    // 자기 자신이라면 클릭해도 효과 없음
    if (userInfo.userId == targetId) {
      return
    }

    setIsFollow((prevState) => !prevState)

    if (isFollow) {
      userUnFollow(targetId, Token)
      .then(() => {
        setFollowers((prevFollowers) => prevFollowers - 1)
      })

    } else {
      userFollowing(targetId, Token)
      .then(() => {
        setFollowers((prevFollowers) => prevFollowers + 1)
      })
    }
  }

  // 수정 상태로 들어감
  const handleProfileEditToggle = () => {
    setIsEditingProfile((prevState) => !prevState)
  }

  const handleNicknameChange = (event) => {
    setEditedNickname(event.target.value)
  }

  const handleBioChange = (event) => {
    setEditedBio(event.target.value)
  }

  const handleSaveChanges = () => {
    setIsEditingProfile(false)

    // const profile_image = new FormData()
    //   profileCropImage.forEach((value, key) => {
    //     profile_image.append(key, value);
    //     });
    //   profile_image.append('user_id', 9)
    //   profile_image.append('nickname', editedNickname)
    //   // console.log(profileCropImage)
    //   profile_image.append('introduction', editedBio)
    //   // profile_image.append('profile_image', tempFile)
    
    const profile_data = {
      user_id: userInfo.userId,
      nickname: editedNickname,
      introduction: editedBio,
    }

    let temp_data = JSON.stringify(profile_data)

    // const datablob = new Blob([temp_data], { type: "application/json"})

    const formData = new FormData();
  //        URL.revokeObjectURL(profileCropImage);
  //       formData.append("profile_image", blob, imgName);

    const profile_image = new FormData()
    profile_image.append('profile_data', JSON.stringify(profile_data))
    profile_image.append('profile_image', profileCropImage, 'profile.png')
    // profileCropImage.forEach((value, key) => {
    //   profile_image.append(key, value);
    //   });

    console.log('토큰 정체', Token)
    console.log(...profile_image)
    setProfileImg(URL.createObjectURL(profileCropImage))
    userIntroEdit(profile_image, Token)
  }

  const handleRender = (state) => {
    setRender(state)
  }

  return (
    <>
      <Container>
        <Grid container spacing={8}>
          <ProfileGrid item xs={3}>
            <UserCard color="primary" variant="soft">
              {console.log('렌더링 중')}
              {/* 수정 상태 */}
              {isEditingProfile ? (
                <>
                  <ImgUpload handleImg={handleImgData} 
                    profileStyle={{ 
                      borderRadius: '50%', 
                      width: '230px', 
                      height: '230px', 
                      marginBottom: '10px',
                      opacity: '70%',
                    }}/>
                  <EditForm>
                    <EditableTextField
                      label="닉네임"
                      value={editedNickname}
                      onChange={handleNicknameChange}
                    />
                    <EditableTextField
                      label="소개"
                      value={editedBio}
                      onChange={handleBioChange}
                      multiline
                    />                       
                    <EditButton onClick={handleSaveChanges}>
                      <Edit sx={{ fontSize: 15 }} color="disabled" />
                    </EditButton>
                  </EditForm>
                </>
              ) : (
                // 일반 상태
                <>
                  <UserProfileImg src={profileImg}/>
                  <EditForm>
                    <Nickname>{editedNickname}</Nickname>
                    <Bio>{editedBio}</Bio>
                    <EditButton style={{ display: String(targetId) !== String(userInfo.userId) ? 'none' : 'block' }} onClick={handleProfileEditToggle}>
                      <Edit sx={{ fontSize: 15 }} color="disabled"/>
                    </EditButton>
                  </EditForm>
                </>
              )}
            </UserCard>
            <FlexDiv>
              <RowDiv>
                <FoButton onClick={() => handleRender(null)}>게시글<br/>{userArticle.length}</FoButton>
                <FoButton onClick={() => handleRender('Follower')}>팔로워<br/>{followers}</FoButton>
                <FoButton onClick={() => handleRender('Following')}>팔로우<br/>{followings}</FoButton>
              </RowDiv>
              <Button onClick={handleIsFollow} variant="outlined">
                {isFollow ? '언팔로우' : '팔로우'}
              </Button>
              <Button onClick={moveMessage} variant="outlined">
                메세지 보내기
              </Button>
              <Button onClick={handleIsScrap} variant="outlined">
                {isScrap ? '홈으로' : '스크랩'}
              </Button>
              <IconButton style={{ marginRight: "auto" }}>
                <Settings sx={{ fontSize: 15 }} color="disabled" />
              </IconButton>
            </FlexDiv>
          </ProfileGrid>
          {render === 'Follower' ? <UserFollowerList /> : '' }
          {render === 'Following' ? <UserFollowingList /> : '' }
          {render === null ? isScrap ? <UserScrapList /> : <UserArticleList /> : ''}
          


        </Grid>
      </Container>
    </>
  )
}

export default UserProfile

