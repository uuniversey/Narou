import React, { useEffect, useState } from 'react'

import HomeStore from '../store/HomeStore'
import FilterStore from '../store/FilterStore'

import { Typography, styled, Grid, Button } from '@mui/material'
import { Checkbox, List, ListItem } from '@mui/joy'

import { useNavigate, useParams } from 'react-router-dom'

const MyFilter = styled(Grid)`
  position: relative;
  width: 100%;
  border-radius: 10px;
  margin-top: 10px;
  border: 1px solid #497cff;
`

const ListTitle = styled(Typography)`
  margin-block-start: 0;
  color: #4c535b;
  margin-block-end: 0;
  /* font-size: ; */
  font-weight: bold;
  margin-bottom: 8px;
`

const ItemDiv = styled("div")`
  padding: 15px;
`

const ListStyle = styled(List)`
  padding: 0;
  margin: 0;
  display: flex; /* Flexbox 사용 */
  align-items: center; /* 세로 중앙 정렬 */
  justify-content: flex-start;
`

const ListItemStyle = styled(ListItem)`
  min-width: 0;  // ListItem의 최소 너비를 0으로 설정
  min-height: 0;
  margin-right: 8px;
  margin-bottom: 8px;
`

const ApplyButton = styled(Button)`
  position: absolute;
  right: 10px;
  bottom: 10px;
` 

// 필터의 기간
const PeriodList = [
  '당일',
  '1박 2일',
  '2박 3일',
  '3박 4일',
  '4박 5일',
  '5박 6일',
  '6박 7일',
]

// 필터의 인원 수
const MemberList = [
  '1명',
  '2명',
  '3명',
  '4명',
  '5명',
  '6명 이상',
]


// 필터의 지역 (최종적으로는 해쉬 태그 기반으로 백에서 받아온 정보로 해야 할듯?)
const AreaList = [
  '서울',
  '인천',
  '양양',
  '제주',
  '부산',
  '춘천',
  '대전',
  '대구',
  '울산',
  '속초',
  '부여',
  '미금역',
]


const HomeFilter = () => {
  const { sendSearchData, isSelected } = FilterStore()
  const navigate = useNavigate()
  const { keyword } = useParams()

  const [selectedPeriodIndex, setSelectedPeriodIndex] = useState(-1)
  const [selectedMemberIndex, setSelectedMemberIndex] = useState(-1)
  const [selectedAreaIndex, setSelectedAreaIndex] = useState(-1)

  const [selectedPeriod, setSelectedPeriod] = useState('')
  const [selectedMember, setSelectedMember] = useState('')
  const [selectedArea, setSelectedArea] = useState('')

  const handleCheckboxChange = (type, index, label) => {
    switch (type) {
      case 'period':
        setSelectedPeriodIndex(index === selectedPeriodIndex ? -1 : index)
        setSelectedPeriod(index === selectedPeriodIndex ? '' : label)
        break
      case 'member':
        setSelectedMemberIndex(index === selectedMemberIndex ? -1 : index)
        setSelectedMember(index === selectedMemberIndex ? '' : label)
        break
      case 'area':
        setSelectedAreaIndex(index === selectedAreaIndex ? -1 : index)
        setSelectedArea(index === selectedAreaIndex ? '' : label)
        break
      default:
        break
    }
  }

  const data = {
    page: 0,
    title: isSelected ? keyword : '',
    nickname: isSelected ? '' : keyword,
    tripDay: '',
    peopleNumber: '',
    location: '',
    orderby: false
  }

  const filterData = {
    period: selectedPeriodIndex === -1 ? '' : selectedPeriod[0] === '당' ? 0 : selectedPeriod[0],
    member: selectedMemberIndex === -1 ? '' : selectedMember[0],
    area: selectedArea,
  }

  // 데이터 확인 용 나중에 지워
  useEffect (() => {
    console.log(filterData, '데이터 변화 감시')
  }, [filterData])

  const applyFilters = () => {
    console.log('데이터 발송', filterData)

    sendSearchData(
      `article/search?page=${data.page}&title=${data.title}&nickname=${data.nickname}&tripDay=${filterData.period}&peopleNumber=${filterData.member}&location=${filterData.area}&orderBy=${data.orderby}`
    )

    navigate(`/search/${keyword}`)

  }
  
  return (
    // 여행 기간, 인원수, 지역
    <MyFilter container>
      <ItemDiv>
        <ListTitle>여행 기간</ListTitle>
        <ListStyle
          orientation="horizontal"
          wrap
          sx={{
            '--ListItem-radius': '20px',
          }}
        >
          {PeriodList.map((item, index) => (
            <ListItemStyle key={item}>
              <Checkbox
                overlay
                disableIcon
                variant="soft"
                label={item}
                checked={index === selectedPeriodIndex}
                onChange={() => handleCheckboxChange('period', index, item)}
                style={{
                  fontSize: "small"
                }}
              />
            </ListItemStyle>
          ))}
        </ListStyle>
      </ItemDiv>

      <ItemDiv>
        <ListTitle>인원 수</ListTitle>
        <ListStyle
          orientation="horizontal"
          wrap
          sx={{
            '--ListItem-radius': '20px',
          }}
        >
          {MemberList.map((item, index) => (
            <ListItemStyle key={item}>
              <Checkbox
                overlay
                disableIcon
                variant="soft"
                label={item}
                checked={index === selectedMemberIndex}
                onChange={() => handleCheckboxChange('member', index, item)}
                style={{
                  fontSize: "small"
                }}
              />
            </ListItemStyle>
          ))}
        </ListStyle>
      </ItemDiv>

      <ItemDiv>
        <ListTitle>지역</ListTitle>
        <ListStyle
          orientation="horizontal"
          wrap
          sx={{
            '--ListItem-radius': '20px',
          }}
        >
          {AreaList.map((item, index) => (
            <ListItemStyle key={item}>
              <Checkbox
                overlay
                disableIcon
                variant="soft"
                label={item}
                checked={index === selectedAreaIndex}
                onChange={() => handleCheckboxChange('area', index, item)}
                style={{
                  fontSize: "small"
                }}
              />
            </ListItemStyle>
          ))}
        </ListStyle>
      </ItemDiv>

      <ApplyButton onClick={applyFilters} >적용</ApplyButton>
    </MyFilter>
  )
}

export default HomeFilter