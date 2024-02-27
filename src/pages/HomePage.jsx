import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import userInfoStore from '../store/LoginStore'
import userProfileStore from '../store/UserProfileStore'
import FilterStore from '../store/FilterStore'

import HomePhotoList from '../components/HomePhotoList'
import HomePathList from '../components/HomePathList'
import HomePhotoPopularList from '../components/HomePhotoPopularList'
import HomePathPopularList from '../components/HomePathPopularList'

import { InputBase, styled, IconButton, Typography, Switch, Button, MenuItem, Select, FormControl } from '@mui/material'
import { Search, Loyalty } from '@mui/icons-material'


const Narou = styled(Typography)`
  display: flex;
  justify-content: center;
  align-items: center;
  color: #497cff;
  font-weight: bolder;
  text-align: center;
  padding-top: 20px;
  padding-bottom: 20px;
`

const SearchForm = styled('form')`
  width: 70%;
  height: 60px;
  padding-bottom: 5px;
  border: 2px solid lightgray;
  border-radius: 30px;
  margin: auto; /* Center the form horizontally */
  text-align: center;
  position: relative;
`

const SearchInput = styled(InputBase)`
  width: 595px;
  height: 55px;
  left: 135px; /* 원하는 위치로 조절 (예: 150px) */
  position: absolute;
  font-size: large;
  margin: 0 auto;
  ::placeholder {
    font-size: large;
    opacity: 80%;
    /* transform: translateY(10px); */
  }
  :focus {
    outline: none;
    box-shadow: 5px 5px 5px lightgray;
  }
`

const FilterBar = styled(FormControl)`
  position: absolute;
  top: 25%;
  left: 4%;
`

const FilterBarSelect = styled(Select)`
  font-size: 14px;
`

const FilterBarMenuItem = styled(MenuItem)`
  font-size: 14px;
`

const SerachButton = styled(IconButton)`
  position: absolute;
  top: 3px;
  right: 3px;
`

const JustifyDiv = styled('div')`
  display: flex;
  justify-content: space-between;
  margin: 10px 30px 0px 30px;
`

const InnerJustifyDiv = styled('div')`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`

// 최신순 & 인기순 선택 시 css
const LatestButton = styled('span')`
  font-weight: ${(props) => props.status==='최신순' ? "bold" : "normal"};
  color: ${(props) => props.status==='최신순' ? "#497cff" : "black"};
  cursor: pointer;
  margin-right: 10px;
`

const PopularityButton = styled('span')`
  font-weight: ${(props) => props.status==='인기순' ? "bold" : "normal"};
  color: ${(props) => props.status==='인기순' ? "#497cff" : "black"};
  cursor: pointer;
`

function Home() {
  
  const { isLogined, setIsLogined, Token, userInfo } = userInfoStore()
  const { sendSearchData, searchData, setIsSelected } = FilterStore()
  const { userData, getUserData } = userProfileStore()
  
  const navigate = useNavigate()

  // 실험용
  const handleTestwj = async () => {
    await getUserData(4, Token)
    console.log(userData, '실험용에서 하는거')
    navigate('/profile/4')
  }
  // 나중에 지워
  
  // 토글 ( 사진 <--> 지도) 
  const [ isToggled, setIsToggled ] = useState('0')

  const handleIsToggle = () => {
    if (isToggled === 0) {
      setIsToggled(1)
    } else {
      setIsToggled(0)
    }
  }

  // 검색 창
  const [ keyword, setKeyword ] = useState('')
  const [ ignoreSlash, setIgnoreSlash ] = useState('')

  const handleKeyword = (event) => {
    setIgnoreSlash(event.target.value.replace(/[\/\\]/g, ''))
    setKeyword(event.target.value)
  }

  // 필터 바(제목 / 닉네임)
  const [ isFilterBar, setIsFilterBar ] = useState(true)

  const handleIsFilterBar = () => {
    setIsFilterBar((prevState) => !prevState)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    // 빈 칸 들어올 시 아무 행동도 안함
    if (ignoreSlash === '') {
      return
    }

    // 제목 & 닉네임 정보 store에 저장
    setIsSelected(isFilterBar)

    const data = {
      page: 0,
      title: isFilterBar ? ignoreSlash : '',
      nickname: isFilterBar ? '' : ignoreSlash,
      tripDay: '',
      peopleNumber: '',
      location: '',
      orderby: false
    }

    // 검색어 back에 요청
    sendSearchData(
      `article/search?page=${data.page}&title=${data.title}&nickname=${data.nickname}&tripDay=${data.tripDay}&peopleNumber=${data.peopleNumber}&location=${data.location}&orderBy=${data.orderby}`
    )

    navigate(`/search/${ignoreSlash}`)
  }

  // 최신순 & 인기순
  const [ option, setOption ] = useState('최신순')

  const handleOption = (event) => {
    if (event.target.innerText === option) {
      return
    } else {
      setOption(event.target.innerText)
    }
  }


  // 로그인 상태 변경
  useEffect (() => {
    console.log('로그인 상태 변경 체크')
    if (Token) {
      setIsLogined(true)
    }
  }, [])

  // 로그인 순간 유저 데이터를 받아 놓는다.
  useEffect(() => {
    getUserData(userInfo.userId, Token)
  }, [isLogined])


  return (
    <> 
      <Narou variant="h4">NA<Loyalty fontSize="large" style={{ top: "1px "}}/>ROU</Narou>

      {/* 실험용 */}
      {/* <button onClick={handleTestwj}>4번의 프로필로 들어가기</button> */}
      {/* 나중에 지워 */}

      <SearchForm onSubmit={handleSubmit}>

        <FilterBar variant="standard" sx={{ minWidth: 80 }}>
          <FilterBarSelect
            id="filterbar"
            defaultValue={10}
            onChange={handleIsFilterBar}
          >
            <FilterBarMenuItem value={10}>제목</FilterBarMenuItem>
            <FilterBarMenuItem value={20}>작성자</FilterBarMenuItem>
          </FilterBarSelect>
        </FilterBar>

        {/* <Loyalty /> */}
        <SearchInput
          onChange={handleKeyword}
          value={keyword}
          type='text'
          placeholder='나만의 루트를 찾아 보세요!'      
        />
    
        <SerachButton type='submit'>
          <Search fontSize="large" sx={{ color: "black"}} />
        </SerachButton>
      </SearchForm>

      <JustifyDiv>
        <Switch onClick={handleIsToggle}/>
        <InnerJustifyDiv>
          <LatestButton onClick={handleOption} status={option}>최신순</LatestButton>
          <PopularityButton onClick={handleOption} status={option}>인기순</PopularityButton>
        </InnerJustifyDiv>
      </JustifyDiv>

      {/* <Button onClick={handleTest} >아티클 테스트 페이지로 이동 ^^</Button> */}
      
      <div>
        {option === '최신순' ? isToggled ? <HomePhotoList /> : <HomePathList/> : isToggled ? <HomePhotoPopularList /> : <HomePathPopularList/>}
      </div>
    </>
    
  )
}

export default Home