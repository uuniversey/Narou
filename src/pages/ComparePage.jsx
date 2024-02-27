import React, { useEffect, useState } from 'react'
import { Container, Grid, Typography, styled } from '@mui/material'
import CompareMap from '../components/CompareMap'
import useMapsStore from '../store/MapStore'
import userProfileStore from '../store/UserProfileStore'
import axios from '../axios.js'

// const datas = [{ "id": 1,
// "routes": [
//  {   
//      "day": 1,
//      "title": "카카오", 
//      "lat": 33.450705,
//      "lng": 126.570677
//  },
//  {
//      "day": 1,
//      "title": "생태연못", 
//      "lat": 33.450936,
//      "lng": 126.569477
//  },
//  {
//      "day": 2,
//      "title": "텃밭", 
//      "lat": 33.450879,
//      "lng": 126.569940
//  },
//  {
//      "day": 2,
//      "title": "근린공원",
//      "lat": 33.451393, 
//      "lng": 126.570738
//  },
//  {
//      "day": 3,
//      "title": "경복궁",
//      "lat": 37.2656, 
//      "lng": 126.277
//  },
//  {
//      "day": 3,
//      "title": "남산",
//      "lat": 37.3306890, 
//      "lng": 126.5930664
//  },
//  {
//      "day": 3,
//      "title": "미금역",
//      "lat": 37.34698042338, 
//      "lng": 127.10980993945
//  }
// ]
 
// },

// { "id": 2,
//  "routes": [
//  {   
//      "day": 1,
//      "title": "카카오", 
//      "lat": 33.450705,
//      "lng": 126.570677
//  },
//  {
//      "day": 1,
//      "title": "생태연못", 
//      "lat": 33.450936,
//      "lng": 126.569477
//  },
//  {
//      "day": 2,
//      "title": "근린공원",
//      "lat": 33.451393, 
//      "lng": 126.570738
//  }]
// }
// ]



// const style = {
//   position: 'absolute',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   width: 400,
//   bgcolor: 'background.paper',
//   border: '2px solid #000',
//   boxShadow: 24,
//   p: 4,
// }

const CompareContainer = styled(Container)`
  padding: 20px;
`;

const Title = styled(Typography)`
  margin-bottom: 30px;
  color: #497cff;
  text-align: center;
`

function Compare() {

  // const { dummyData, setDummyData } = useMapsStore()
  const { setModalData, compareData, setCompareData } = useMapsStore()
  const { userData } = userProfileStore()

  const getScrap = async (userId) => {

    try {
       const response = await axios.get
       (`article/scrap/list/${userId}`)
      //  (`article/search`)
       console.log(response.data);
       const data = await response.data.data.content
       // data 형식 및 저장 방법 확인 필요
       setModalData(data)
     } catch (error) {
       // 요청이 실패했을 때 처리할 로직
       console.error(error);
       // alert(error.message);
     }
 }
 

  useEffect(() => {
    
    // return () => {
    //   setDummyData({
    //     [0]: null,
    //     [1]: null})
    // }

    getScrap(userData.userId)

    return () => {
      setCompareData({
        [0]: null,
        [1]: null})
    }

  }, [])
  
  return (
    <CompareContainer>
      <Grid container>
        <Grid item xs={12}>
          <Title variant="h4">
            비교하기
          </Title> 
        </Grid>
        <Grid item xs={12}>
          {/* <CompareMap map1={dummyData[0]} map2={dummyData[1]} /> */}
          <CompareMap map1={compareData[0]} map2={compareData[1]} />
        </Grid>
      </Grid>
  </CompareContainer>
  )
}

export default Compare