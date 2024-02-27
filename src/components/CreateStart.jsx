import React, { useState, useEffect } from "react"
import useCreateStore from "../store/CreateStore"

import { styled } from '@mui/system';
import { Alert, Chip, Grow, Typography, Button, Slider, Select, FormControl, InputLabel, MenuItem, TextField, Grid, Snackbar } from "@mui/material";
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const DateContainer = styled(DemoContainer)`
  border: 1px solid darkgrey;
  padding-bottom: 20px;
  border-radius: 10px;
`

const CustomSelect = styled(Select)`
  width: 100%;
`

const TopGrid = styled(Grid)`
  width: 100%;
  height: 100%;
`

const GridItem = styled(Grid)`
  width: 100%;
  padding: 0px;
`

const TagsList = styled('div')`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
`;

const TagChip = styled(Chip)`
  margin-right: 5px;
  margin-bottom: 5px;
`;


const marks = [
  { value: 1, label: '당일' },
  { value: 2, label: '2일' },
  { value: 3, label: '3일' },
  { value: 4, label: '4일' },
  { value: 5, label: '5일' },
  { value: 6, label: '6일' },
  { value: 7, label: '일주일' },
]

const myTags = [
  "서울여행", "이태원", "잠실", "강릉", "제주도", "부산", "광안리", "해운대", "전주한옥마을", "남산타워", "명동", "강남", "홍대", "양양", "배낭여행", "로드트립", "우정여행", "호캉스", "등산여행", "국내여행", "해돋이", "영종도", "을왕리", "영도", "대구", "맛집여행", "식도락"
]

// 파스텔 톤 색상 랜덤 생성 함수
const getRandomColor = () => {
  const hue = Math.floor(Math.random() * 360)
  const saturation = Math.floor(Math.random() * 10) + 80 // 채도를 80% ~ 90% 사이로 설정
  const lightness = Math.floor(Math.random() * 20) + 70 // 명도를 70% ~ 90% 사이로 설정
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}

// 폰트 사이즈 랜덤 함수
const getRandomFontSize = () => {
  const fonts = ["medium", "large", "x-large", "xx-large", "smaller", "larger"]
  const randomIndex = Math.floor(Math.random() * fonts.length)
  const myFontSize = fonts[randomIndex]
  return myFontSize;
}


function CreateStart ({ onComplete }) {
  const { depatureDate, arriveDate, headcount, title, tags, setDepatureDate, setArriveDate, setHeadcount, setTitle, setTags } = useCreateStore()
  const [tag, setTag] = useState("")

  // const [days, setDays] = useState('') // 일정 선택
  // const [headcount, setHeadcount] = useState('') // 인원 선택
  // const [title, setTitle] = useState('') // 제목 입력
  // const [tags, setTags] = useState([]) // 태그 선택

  const [snackbarOpen, setSnackbarOpen] = useState(''); // 스낵바 온오프
  const [warning, setWarning] = useState('') // 글자수 입력 경고창

  // 개발 기간 동안 잠시 막아둠
  const isComplete = depatureDate && arriveDate && headcount && title && tags.length > 0
  useEffect(() => {
    onComplete(isComplete);
  }, [depatureDate, arriveDate, headcount, title, tags]);


  //// 태그 관련

  // 태그 입력
  const handleTagChange = (event) => {
    setTag(event.target.value);
  }

  // Enter 키 입력 시 태그 추가
  const handleEnterKeyPress = (event) => {
    if (event.key === "Enter" && tags.length < 10 && tag.trim() !== "") {
      // Enter 키 입력 감지 및 현재 입력 필드가 비어있지 않을 때 동작
      // setTag 상태를 setTags 배열에 추가하고 setTag 상태를 초기화
      setTags([...tags, tag.trim()]);
      setTag("");
    } else if (tags.length >= 10) {
      setSnackbarOpen(true);
    }
  }
  // 태그 선택
  const handleTagClick = (tag) => {
    // 선택된 태그 목록에 추가
    if (tags.length < 10) {
      setTags([...tags, tag]);
      setTag("")
    } else {
      // 태그가 10개 이상이면 경고창 표시
      setSnackbarOpen(true)
    }
  }
  
  // // 입력 중인 태그 수정하기
  // const handleKeyDown = (event) => {
  //   if (event.key === "Backspace" && tags.length > 0 && !tag) {
  //     // Backspace 키 입력 감지 및 현재 입력 필드가 비어있을 때 동작
  //     event.preventDefault(); // 기본 동작(페이지 뒤로 가기) 방지
  
  //     // 선택된 태그를 제거한 새로운 배열을 생성
  //     const updatedTags = tags.slice(0, -1);
      
  //     // 태그 목록 업데이트
  //     setTags(updatedTags);
  //   }
  // };

  // 태그 지우기
  const handleDelete = (idx) => {
    const clonetags = tags.slice();
    clonetags.splice(idx, 1);
    setTags(clonetags);
  };



  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };


  //// 인원 관련
  const handleChangeHeadcount = (event) => {
    setHeadcount(event.target.value)
  }


  //// 타이틀 관련
  const handleTitleChange = (event) => {
    const inputValue = event.target.value;

    // 30자를 초과하면 더 이상 입력하지 않음
    if (inputValue.length <= 30) {
      setTitle(inputValue);
    }

    // 제목 길이 실시간으로 표시
    if (inputValue.length > 30) {
      setWarning(true)
    }
  }


  return (
    <>
    <Grid container alignItems="center" justifyContent="space-between" style={{ marginTop: "30px"}}>
      {/* <TopGrid item xs={12} style={{ height: "50px", marginTop: "20px"}}>
        <Typography variant="h4" style={{ color: "#497cff" }}>
          당신의 나루를 시작하세요...
        </Typography>
      </TopGrid> */}
      
      {/* 좌측 탭 */}
      <TopGrid
        item
        xs={5.5}
        direction="column"
        justifyContent="space-between"
        alignItems="flex-start"
        spacing={2}
      >

        {/* 여행 기간 */}
        <GridItem item>
          <h3>며칠 일정 인가요?</h3>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateContainer components={['DatePicker', 'DatePicker']}>

                <GridItem label="출발">
                  <DatePicker 
                    calendars={1} 
                    format="YYYY-MM-DD" 
                    onChange={setDepatureDate} 
                  />
                </GridItem>

                <ArrowRightAltIcon style={{ fontSize: '2rem', alignSelf: 'center' }} />

                <GridItem label="도착">
                  <DatePicker 
                    calendars={1} 
                    format="YYYY-MM-DD"
                    minDate={depatureDate} 
                    onChange={setArriveDate}
                  />
                </GridItem>

            </DateContainer>
          </LocalizationProvider>
        </GridItem>
      

        {/* 여행 인원 */}
        <GridItem item>
          <h3>여행 인원을 선택해 주세요</h3>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">인원 수</InputLabel>
            <CustomSelect
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={headcount}
                label="count"
                onChange={handleChangeHeadcount}
                renderValue={(value) => value}
              >
                <MenuItem value={1}>1명</MenuItem>
                <MenuItem value={2}>2명</MenuItem>
                <MenuItem value={3}>3명</MenuItem>
                <MenuItem value={4}>4명</MenuItem>
                <MenuItem value={5}>5명</MenuItem>
                <MenuItem value={6}>6명</MenuItem>
                <MenuItem value={7}>7명</MenuItem>
              </CustomSelect>
          </FormControl>
        </GridItem>


        {/* 게시글 제목 */}
        <GridItem item>
          <h3>제목을 입력해 주세요</h3>
          <TextField
            variant="standard"
            style={{
              width: "100%",
              marginBottom: "10px",
            }}
            value={title}
            onChange={handleTitleChange}
            helperText={`${title.length}/30`}
          />
          {title.length > 29 && (
            <p style={{ color: "red", margin: "5px", fontSize: "small" }}>
              제목은 30자 이하로 입력해주세요.
            </p>
          )}
        </GridItem>

        {/* 태그 입력 */}
        <GridItem item>
          <h3>태그 입력</h3>
          <TextField
            label="태그"
            variant="standard"
            // multiline
            rows={1}
            value={tag}
            onKeyPress={handleEnterKeyPress}
            // onKeyDown={handleKeyDown}
            onChange={(event) => handleTagChange(event)}
            style={{
              width: "100%",
              paddingBottom: "15px"
            }}
          />
          {/* 내가 입력한 태그 짜잔 */}
          {tags.map((event, idx) => (
              <TagsList key={idx}>
                <TagChip 
                  label={event}
                  variant="outlined"
                  onDelete={() => handleDelete(idx)}
                />
                {/* <HashBtn onClick={() => removeTag(i)}>x</HashBtn> */}
              </TagsList>
            ))}
        </GridItem> 

      </TopGrid>


      {/* 우측 탭 */}
      <TopGrid
        item
        xs={5.5}
        style={{
          display: "flex",
          justifyContent: "center"
        }}
      >
        <GridItem item style={{
          height: "500px",
        }}>
          <h3>추천 태그</h3>
          <Grid>
              {myTags.map((tag, index) => {
                return (
                  <Button
                    key={index}
                    variant="contained"
                    // button 스터알 에 랜덤 컬러 함수 적용하려면 styled component 사용 불가
                    style={{
                      backgroundColor: getRandomColor(),
                      margin: "5px",
                      fontSize: getRandomFontSize(),
                      overflow: "hidden",
                      boxShadow: "none",
                      transition: "background-color 0.3s",
                    }}
                    onMouseOver={(event) => {
                      // 호버 시 배경 색상 변경
                      event.target.style.backgroundColor = getRandomColor()
                      event.target.style.color = getRandomColor()
                    }}
                    onMouseOut={(event) => {
                      // 마우스가 벗어날 때 원래 색상으로 변경
                      event.target.style.backgroundColor = getRandomColor()
                      event.target.style.color = "white"
                    }}
                    onClick={() => handleTagClick(tag)}
                  >
                    {tag}
                  </Button>
                );
              })}
          </Grid>
          
        </GridItem>
      </TopGrid>
    </Grid>
    <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert severity="warning" onClose={handleSnackbarClose}>
          태그는 최대 10개까지만 입력 가능합니다
        </Alert>
      </Snackbar>
    </>
  )
}

export default CreateStart