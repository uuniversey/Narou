import * as React from 'react';
import { useNavigate } from 'react-router-dom'
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import { FixedSizeList } from 'react-window';
import { styled, Box, ListItemButton, Button } from '@mui/material';
import useMapsStore from '../store/MapStore';
import UserProfileStore from '../store/UserProfileStore';
import axios from '../axios.js'
import empty2 from '../assets/images/empty2.png'

const TopListItem = styled(ListItem)`
  display: flex;
  align-items: center;
  justify-content: center;
`

const EmptyDiv = styled('div')`
  text-align: center;
  height: 100%;
  align-items: center;
  color: #555;
  padding: 20px;
  border-radius: 8px;
`

const CustomImg = styled('img')`
  width: 180px;
  opacity: 50%;
  margin-top: 70px;
`

function CompareModal(props) {
  // const { setDummyData, dumDumData, getCompareData, compareData, setCompareData } = useMapsStore()
  const { setDummyData, modalData, getCompareData, compareData, setCompareData } = useMapsStore()
  // 스크랩한 목록 불러오는 스토어
  const { getScrapData, userData } = UserProfileStore()

  const { handleCloseModal, index } = props

  const navigate = useNavigate()

  // console.log('----------', modalData)
  const handleCompareClick =  async (articleId) => {

    // 1. 스크랩 목록을 불러온 거에서 하나의 스크랩 글을 클릭했을 때,
    // id 값으로 불러온다. -> 게시물 하나에 대한 정보()
    // 비교 data 호출
    // getCompareData(articleId1, articleId2) -> 동시에 요청하지 않는 이상 안 쓸 듯..?
    // 하나씩 요청하기 때문에 게시물 디테일 페이지 요청하듯이 하면 되지 않을까
    try {
      const response = await axios.get
      (`article/read/${articleId}`)
      console.log(response.data);
      const data = await response.data.data
      // data 형식 및 저장 방법 확인 필요
      console.log('------------', data);
      setCompareData(({
        [index]: data
    }));
    } catch (error) {
      // 요청이 실패했을 때 처리할 로직
      console.error(error);
      alert(error.message);
    }
    handleCloseModal()
  }


  const goScrap = () => {
    navigate(`/`)
  }

  function renderRow(props, modalData) {
    const { index, style } = props;
  
    // React.useEffect(() => {
    //   console.log('hi', compareData)
    // }, [setCompareData])
    

    // 스크랩한 목록 띄운다.(userScrap)
    if (modalData.length === 0 ) {
      return (
        <EmptyDiv>
          <p>아직 스크랩한 게시물이 없어요!</p>
          <Button
            variant='outlined'
            size='small'
            onClick={goScrap}
          >
            스크랩 하러 가기
          </Button>
          <br/>
          <CustomImg src={empty2} alt="" />
        </EmptyDiv>
      )
    }
    return modalData.map((data, idx) => (
      <TopListItem key={idx} component="div" disablePadding>
        <ListItemButton onClick={() => handleCompareClick(data.id)}>
          <ListItemAvatar>
            <Avatar>
              <img src={data.thumbnailPath} alt={`${data.thumbnailPath}`} style={{
                width: "40px"
              }}/>
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={data.title}
            secondary={`${data.startDate} ~ ${data.endDate}`}
          />
        </ListItemButton>
      </TopListItem>
    ));
  }

  return (
 

    <Box
    sx={{ width: '100%', height: 400, maxWidth: 360, bgcolor: 'background.paper' }}
    >
    <FixedSizeList
      height={400}
      width={360}
      itemSize={70}
      itemCount={1}
      overscanCount={5}
    >
      {(listProps) => renderRow(listProps, modalData)}
    </FixedSizeList>
    </Box>
  )
}
export default CompareModal