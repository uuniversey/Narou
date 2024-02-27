import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import search from '../assets/images/search.png'

import FilterStore from '../store/FilterStore'

import {
  styled,
  Button,
  IconButton,
  Typography,
  Switch,
  Stack,
  Container,
  TextField,
  InputAdornment,
  Grid,
  ImageList,
  ImageListItem,
  Select,
  FormControl,
  MenuItem
} from '@mui/material'

import { Search, Tune, Loyalty } from '@mui/icons-material'

import { useParams } from 'react-router'

import HomeFilter from '../components/HomeFilter'
import BasicInfiScroll from '../components/BasicInfiScroll'
import axios from '../axios.js'

const Title = styled(Typography)`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: #497cff;
  font-weight: bolder;
  text-align: center;
  padding-top: 20px;
  padding-bottom: 20px;
`

const SearchContainer = styled('div')`
  position: sticky;
  top: 50px;
  z-index: 1000;
`

const SearchGrid = styled(Grid)`
  width: 100%;
  padding-bottom: 200px;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  position: sticky;
  /* top: 200px; */
`

const SearchInput = styled(TextField)`
  width: 100%;
  ::placeholder {
    font-size: large;
    opacity: 80%;
    transform: translateY(5%);
  }
  :focus {
    outline: none;
    box-shadow: 5px 5px 5px lightgray;
  }
`

const Result = styled('p')`
  font-size: medium;
  color: grey;
`

const Filterbar = styled("div")`
  width: 100%;
  display: flex;
  justify-content: flex-start;
`

const FilterButton = styled(IconButton)`
  margin-top: 5px;
  border: 1px solid #497cff;
  color: #497cff;
`

const FilterContainer = styled('div')`
  display: flex;
  justify-content: flex-start;
  padding: 0;
  margin: 0;
`

const FilterBar = styled(FormControl)`
  margin-bottom: 20px;
`;

const FilterBarSelect = styled(Select)`
  font-size: 14px;
`

const FilterBarMenuItem = styled(MenuItem)`
  font-size: 14px;
`

function SearchPage() {
  const { searchData, sendSearchData, setIsSelected, tempSearchData, setTempSearchData } = FilterStore()

  const navigate = useNavigate()
  const { keyword } = useParams()
  const [ keyword2, setKeyword2 ] = useState(keyword)
  const [ ignoreSlash, setIgnoreSlash ] = useState('')
  const [ isFilter, setIsFilter ] = useState(0)
  const [ isSearching, setIsSearching ] = useState(true)
  const [tempData, setTempData] = useState(null)

  // // 최신순 & 인기순
  // const [ option, setOption ] = useState('')

  // const handleOption = (event) => {
  //   if (event.target.innerText === option) {
  //     setOption('')
  //   } else {
  //     setOption(event.target.innerText)
  //   }
  // }
      
  const handleIsFilter = () => {
    setIsFilter(isFilter === 1 ? 0 : 1)
  }

  const handleKeyword = (event) => {
    setKeyword2(event.target.value)
    setIgnoreSlash(event.target.value.replace(/[\/\\]/g, ''))
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

    // 검색 했을 때 필터 창 닫기
    setIsFilter(0)

    const data = {
      page: 0,
      title: isFilterBar ? ignoreSlash : '',
      nickname: isFilterBar ? '' : ignoreSlash,
      tripDay: '',
      peopleNumber: '',
      location: '',
      orderby: false
    }

    setTempData({
      page: 0,
      title: isFilterBar ? ignoreSlash : '',
      nickname: isFilterBar ? '' : ignoreSlash,
      tripDay: '',
      peopleNumber: '',
      location: '',
      orderby: false
    })

    setTempSearchData({
      page: 0,
      title: isFilterBar ? ignoreSlash : '',
      nickname: isFilterBar ? '' : ignoreSlash,
      tripDay: '',
      peopleNumber: '',
      location: '',
      orderby: false
    })

    // 검색어 back에 요청
    sendSearchData(
      `article/search?page=${data.page}&title=${data.title}&nickname=${data.nickname}&tripDay=${data.tripDay}&peopleNumber=${data.peopleNumber}&location=${data.location}&orderBy=${data.orderby}`
    )

    navigate(`/search/${ignoreSlash}`)
  }

    useEffect(() => {
      if (!isSearching) {
        const searchGrid = document.getElementById('search-grid')
        if (searchGrid) {
          searchGrid.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }, [isSearching])


  // 무한 스크롤 코드
  const [pins, setPins] = useState([])
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  // const [pins, setPins] = useState([searchData])
  // const [page, setPage] = useState(2)

  const pageEnd = useRef()

  // const fetchPins = async page => {
  //   if (page === 0 ) {
  //     setPage((prev) => prev + 1)
  //   }
  //   console.log('fetchpins의 페이지입니다.', page)
  //   // console.log(tempData)
  //   // console.log(tempSearchData)
  // try {
  //       setLoading(true);
  //       const response = await axios.get(
  //         `article/search?page=${page}&title=${tempData.title}&nickname=${tempData.nickname}&tripDay=${tempData.tripDay}&peopleNumber=${tempData.peopleNumber}&location=${tempData.location}&orderBy=${tempData.orderby}`
  //       );
  //       // console.log(page, title, nickname, tripDay, peopleNumber, location, orderby);
  //       console.log(response.data.data);
  //       const responseData = response.data.data;
  //       const data = responseData.content;
  //       setPins(prev => [...prev, ...data]);
  //       if (data.length < 15) {
  //         setHasMore(false);
  //       }
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }

  // const fetchPins = async page => {
  //   console.log("자자~~~~~~~~~~` 그 다음 24개 호출하겠습니다", page)
  //   const firstTenItems = itemData.slice(0, 24) 
  //   // const firstTenItems = photoData
  //   setPins(prev => [...prev, ...firstTenItems])
  // }

  // useEffect(() => {
  //   console.log(page)
  //   // 처음에 홈에서 검색했을 때, 페이지 = 0에 대해서 바로 렌더링하고
  //   // 그 이후부터 무한 스크롤로 값 가져온다.
  //   // searchData가 15 이하일 경우 스크롤 할게 없으니 hasMore 변경해야 함.
  //   if (page === 0 && searchData) {
  //     if (searchData.length < 15) {
  //       setHasMore(false);
  //     }
  //   } else {
  //     fetchPins(page);
  //   }
  //   // axios 연결 함수 호출 - 24개씩 가져온다 - 24개씩 가져온게 searchData에 들어있음
  //   // sendSearchData(
  //   //   `article/search?page=${data.page}&size=24&sort=id&direction=DESC
  //   //   &title=${data.title}
  //   //   &nickname=${data.nickname}
  //   //   &tripDay=${data.tripDay}
  //   //   &peopleNumbe=${data.peopleNumber}
  //   //   &location=${data.location}
  //   //   &orderBy=${data.orderby}`
  //   // )
  //   // setPins(prev => [...prev, ...searchData])

  // }, [page])

  useEffect(() => {
    // if (page === 0 && searchData && searchData.length < 15) {
    //   // setPage((prev) => prev + 1)
    //   setHasMore(false);
    // } else {
    //   fetchPins(page);
    // }
  }, [page]);

  const handleGoArticle = articleId => {
    navigate(`/article/${articleId}`);
  };

  return (
    <Grid container spacing={10}>
      {/* 왼쪽: 검색 폼 */}
      <Grid item xs={4.5} spacing={2}>
        <SearchContainer>
          <SearchGrid id="search-grid">
            {/* <img src={search} alt="" style={{ width: "150px" }}/> */}
            {/* <Title variant='h5'>검색 중...</Title> */}
            <br />
            <form onSubmit={handleSubmit}>
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
              <SearchInput
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Loyalty fontSize="medium" sx={{ color: "#497cff" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton type="submit"><Search fontSize="medium" /></IconButton>
                    </InputAdornment>
                  ),
                }}
                onChange={handleKeyword}
                value={keyword2}
                type="text"
                // placeholder="나만의 루트를 찾아 보세요!"
              />
            </form>
            <Result><b>{keyword}</b>에 대한 검색 결과입니다.</Result>
            <Filterbar>
              <FilterButton variant="outlined" size="small" onClick={handleIsFilter}>
                <Tune />
              </FilterButton>
            </Filterbar>
            <div>{isFilter ? <FilterContainer><HomeFilter /></FilterContainer> : ''}</div>
          </SearchGrid>
        </SearchContainer>
      </Grid>

      {/* 오른쪽: 컨텐츠 */}
      <Grid item xs={7.5} sx={{ overflow: 'hidden' }}>
        <ImageList cols={4}>
          
          {/* 검색어로 검색한 데이터 띄우기 */}
          {/* {searchData.map((item) => (
            <ImageListItem key={item.img}>
              <img
                srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
                alt={item.title}
                loading="lazy"
              />
            </ImageListItem>
          ))} */}

          {/* 더미 데이터 */}
          {/* {itemData.map((item, index) => (
            <ImageListItem key={index}>
              <img
                srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
                alt={item.title}
                loading="lazy"
              />
            </ImageListItem>
          ))} */}

          {/* 무한 스크롤로 변경한 코드 */}
          {page === 0 && searchData ? (
            searchData.map((item, index) => (
              <ImageListItem style={{cursor: 'pointer'}} onClick={() => handleGoArticle(item.id)} key={index}>
                <img
                  srcSet={`${item.thumbnailPath}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                  src={`${item.thumbnailPath}?w=164&h=164&fit=crop&auto=format`}
                  alt={item.title}
                  loading="lazy"
                />
              </ImageListItem>
            ))
          ) : (
            <BasicInfiScroll
              data={pins}
              renderItem={(item, index) => (
                <ImageListItem style={{cursor: 'pointer'}} onClick={() => handleGoArticle(item.id)} key={index}>
                  <img
                    srcSet={`${item.thumbnailPath}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                    src={`${item.thumbnailPath}?w=164&h=164&fit=crop&auto=format`}
                    alt={item.title}
                    loading="lazy"
                  />
                </ImageListItem>
              )}
              setPage={setPage}
              endOfListRef={pageEnd}
              hasMore={hasMore}
              loading={loading}
            />
          )}
        </ImageList>
      </Grid>
    <div ref={pageEnd}></div>
    </Grid>
  )
}

export default SearchPage;
