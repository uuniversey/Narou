import React, { useEffect, useState } from 'react'

import { Box, Grid, styled } from '@mui/material'

import marker1 from '../assets/images/mark1.png'
import marker2 from '../assets/images/mark2.png'
import marker3 from '../assets/images/mark3.png'
import marker4 from '../assets/images/mark4.png'
import marker5 from '../assets/images/mark5.png'
import marker6 from '../assets/images/mark6.png'
import marker7 from '../assets/images/mark7.png'

const MapDiv = styled('div')`
  width: 100%;
  height: 600px;
  border: 1px solid lightgrey;
`
// import datas from '../data.json'
const { kakao } = window

function CreateMapAfter({ datas }) {
    
    const [maps, setMaps] = useState([])

    // day에 따른 마커 색상
    var markerColor = marker1
    var lineColor = '#ff0000'
    const markerColorSwitch = (value) => {
      switch (value) {
        case (1):
          markerColor = marker1
          break;
        case (2):
          markerColor = marker2
          break;
        case (3):
          markerColor = marker3
          break;
        case (4):
          markerColor = marker4
          break;
        case (5):
          markerColor = marker5
          break;
        case (6):
          markerColor = marker6
          break;
        case (7):
          markerColor = marker7
          break;
      }

      return markerColor
  }

  // day에 따른 경로 색상
  const lineColorSwitch = (value) => {
    switch (value) {
      case (1):
        lineColor = '#E54848'
        break;
      case (2):
        lineColor = '#E57948'
        break;
      case (3):
        lineColor = '#E5c34B'
        break;
      case (4):
        lineColor = '#008000'
        break;
      case (5):
        lineColor = '#5754FF'
        break;
      case (6):
        lineColor = '#4B0082'
        break;
      case (7):
        lineColor = '#800080'
        break;
    }
    return lineColor
}
    
    const locationsByDay = {}

    useEffect(() => {
    
    const createMaps = () => {

      var marker = null

      var bounds = new kakao.maps.LatLngBounds()

      const newMaps = () => {

      // 지도 컨테이너 만드는 부분
          const mapContainer = document.getElementById("map")

          if (!mapContainer) return;

          // 기존에 생성된 지도가 있다면 삭제
          while (mapContainer.firstChild) {
              mapContainer.removeChild(mapContainer.firstChild);
          }
          
          const mapOption = {
            center: new kakao.maps.LatLng(33.450701, 126.570667),
            level: 3,
          };
          const map = new kakao.maps.Map(mapContainer, mapOption)
    
          // 마커 모양 만드는 부분
          datas.map((data) => {
            markerColorSwitch(data.day)
            var imageSrc = markerColor;
            var imageSize = new kakao.maps.Size(27, 27)
            var imageOption = { offset: new kakao.maps.Point(15, 30) }
            var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);
  
            marker = new kakao.maps.Marker({
              map: map,
              image: markerImage,
              position: new kakao.maps.LatLng(data.lat, data.lng),
              title: data.title,
            })

            const position = new kakao.maps.LatLng(data.lat, data.lng)
            
            // 바운드에 마커 좌표들 추가
            bounds.extend(position)
            return { map, marker };
          })
          // 마커 위치들이 전부 보일 수 있도록 바운드 다시 셋팅
          map.setBounds(bounds)
    
     // day별 데이터 정리하는 부분
     const organizeDataByDay = (datas) => {
          
      datas.forEach((route) => {
        const { day, ...locations } = route
    
        // day별 객체 만들어줌
        if (!locationsByDay[day]) {
            locationsByDay[day] = []
          }
    
          const {  place_name, address_name, position, lat, lng } = locations
          locationsByDay[day].push({ place_name, address_name, lat, lng })
        })
    
      return locationsByDay
    }

    organizeDataByDay(datas)

     // 선을 구성하는 좌표 배열입니다. 이 좌표들을 이어서 선을 표시합니다
     const allLinePaths = []
     const tempLocation = []


     Object.keys(locationsByDay).forEach((day, index) => {
       const locations = locationsByDay[day]

       // day별로 선이 끊기지 않고 이어질 수 있도록
       // 2일차부터 그 전날의 마지막 장소를 해당 day에 추가해줌
       if (index > 0) {
         const previousDay = tempLocation[index - 1];
         if (previousDay) {
           locations.unshift(previousDay[previousDay.length - 1]);
         }
       }
         tempLocation.push(locations)
         // console.log("임시 로케이션 배열", tempLocation)

       const linePath = locations.map((location) => {
         return new kakao.maps.LatLng(location.lat, location.lng);
       });

       allLinePaths[day] = linePath

       // day별 배열들이 allLinePaths에 들어있음.
       // console.log("올라인패스", allLinePaths)
     
   })

     // 지도에 표시할 선을 생성
     
     allLinePaths.map((linePaths, idx) => {
       lineColorSwitch(idx)
     const polyline = new kakao.maps.Polyline({
       path: linePaths, // 선을 구성하는 좌표배열 입니다
       strokeWeight: 2.5, // 선의 두께 입니다
       strokeColor: lineColor, // 선의 색깔입니다
       strokeOpacity: 0.5, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
       strokeStyle: 'solid' // 선의 스타일입니다
     });

     // 지도에 선을 표시합니다 
     polyline.setMap(map);
    })
  }
  
  setMaps(newMaps())

    }

    createMaps()
      // Cleanup function
      return () => {
          const mapContainer = document.getElementById('map');
            // mapContainer.innerHTML = '';
      };
      
    }, [datas])
    
      return (
        <>
          <Grid item xs={12}>
              {/* <Box sx={{ border: 1, borderColor: 'grey.500', height: '100vh', borderRadius: '10px'}}> */}
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center',}}>
                      <MapDiv id={"map"}></MapDiv>
                  </Box>
              {/* </Box> */}
          </Grid>
        </>
      )
}

export default CreateMapAfter