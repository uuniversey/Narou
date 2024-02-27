import React, { useEffect, useRef, useState } from 'react'

import HomeStore from '../store/HomeStore'

import marker1 from '../assets/images/mark1.png'
import marker2 from '../assets/images/mark2.png'
import marker3 from '../assets/images/mark3.png'
import marker4 from '../assets/images/mark4.png'
import marker5 from '../assets/images/mark5.png'
import marker6 from '../assets/images/mark6.png'
import marker7 from '../assets/images/mark7.png'

import useMapsStore from '../store/MapStore'
import { Box, Card, Grid, styled } from '@mui/material'
import { useNavigate } from 'react-router'

import axios from '../axios.js'

const { kakao } = window

const MapDiv = styled('div')`
  width: 100%;
  height: 300px;
  border: 1px solid lightgrey;
`

const JustifyDiv = styled('div')`
  display: flex;
  cursor: pointer;
  justify-content: space-between;
  margin: 0px 15px 0px 15px;
`

const PeriodH = styled('h5')`
  margin: 10px 20px 0px 10px;
  color: silver;
`

const TagDiv = styled('div')`
  margin: 10px 0px 0px 10px;
  font-size: 12px;
`

function MainMap({type}) {

  const { pathData } = HomeStore()

  const pageEnd = useRef()
  const mapRefs = useRef({})

  const [pins, setPins] = useState([])
  const [page, setPage] = useState(0) //스크롤이 닿았을 때 새롭게 데이터 페이지를 바꿀 state
  const [loading, setLoading] = useState(false) //로딩 성공, 실패를 담을 state
  const [hasMore, setHasMore] = useState(true)

  const navigate = useNavigate();
  
  const { dumDumData } = useMapsStore() 

  // 맵 클릭 시 디테일 article로 이동
  const handleGoArticle = (articleId) => {
    navigate(`/article/${articleId}`);
  };

  // 스크롤이 닿았을 대 새롭게 데이터 페이지를 바꾸는
  // state인 page를 만들어준다.
  // useEffect로 page의 넘버가 바뀔 때마다 fetchPins 함수를 호출시킨다.

  
  const fetchPins = async page => {

    let url = `article/search?page=${page}`
  
    if (type === 'popular') {
      url += '&orderBy=true'
    }

    try {
      const response = await axios.get
      (url)
      console.log(response.data.data);
      const data = await response.data.data.content
      setPins(prev => [...prev, ...data]) 
      setLoading(true)
      if (data.length < 15) {
      setHasMore(false)
      }
    } 
    catch (error) {
      // 요청이 실패했을 때 처리할 로직
      console.error(error);
      alert(error.message);
    }
      }

  const loadMore = () => {
		setPage(prev => prev + 1);
	}
  
  // const fetchPins = async () => {
  //   setLoading(true);
  //   const firstTenItems = dumDumData.slice((page - 1) * 10, page * 10)
  //   setPins(prev => [...prev, ...firstTenItems]);
  //   console.log("자자~~~~~~~~~~` 그 다음 10개 호출하겠습니다", firstTenItems.length, dumDumData.length)
  //   // setPins(firstTenItems);
  //   if (firstTenItems.length < 10) {
  //     setHasMore(false)
  //     setLoading(false)
  //   }
  // };

  // fetchPins를 실행시켜 데이터를 불러오고
  // page를 1씩 증가시켜서 그 다음 데이터를 불러오도록 함
  // 새롭게 불러와진 데이터는 fetchPins를 통해서
  // 기존에 있던 데이터에 더해지게 된다.
  // 무한 스크롤은 마지막 엘리먼트에 닿았을 때, 데이터를 자동으로 불러온다.
  // 이 페이지의 마지막 요소에 ref를 지정해놓고 탐색 타겟으로 설정한다.

  useEffect(() => {
    fetchPins(page);
  }, [page])

  useEffect(() => {
    console.log(hasMore, loading)
    if (loading && hasMore ) {
      //로딩되었을 때만 실행
      const observer = new IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting) {
            loadMore();
          }
        },
        { threshold: 1 }
      );
      //옵져버 탐색 시작
      observer.observe(pageEnd.current)
      return () => {
        observer.disconnect()
      }
    }
  }, [loading, hasMore]);

    // const [maps, setMaps] = useState([])
    // console.log('맵 오브젝트 페이지', dumDumData)

    var markerColor = marker1
    var lineColor = '#E54848'
    var infoColor = '#E54848'
  
    const markerColorSwitch = (value) => {
        switch (value) {
          case (1):
            markerColor = marker1
            infoColor = '#E54848'
            break;
          case (2):
            markerColor = marker2
            infoColor = '#E57948'
            break;
          case (3):
            markerColor = marker3
            infoColor = '#E5c34B'
            break;
          case (4):
            markerColor = marker4
            infoColor = '#008000'
            break;
          case (5):
            markerColor = marker5
            infoColor = '#5754FF'
            break;
          case (6):
            markerColor = marker6
            infoColor = '#4B0082'
            break;
          case (7):
            markerColor = marker7
            infoColor = '#800080'
            break;
        }
  
        return {markerColor, infoColor}
    }
  
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

  
  const createMap = (index) => {
    // console.log(pin)
    const pin = pins[index];
    // console.log(pin)
    if (!pin || mapRefs.current[index]) return; // 이미 지도가 생성된 경우, 함수 종료

    var bounds = new kakao.maps.LatLngBounds();
    const locationsByDay = {};
    const mapContainer = document.getElementById(`map${index}`);
    
    if (!mapContainer) return;

    // 기존에 생성된 지도가 있다면 삭제
    while (mapContainer.firstChild) {
        mapContainer.removeChild(mapContainer.firstChild);
    }

    // 새로운 지도 생성
    const mapOption = { 
        center: new kakao.maps.LatLng(37.5038623, 127.0428012), // 예시로 설정한 중심 좌표
        level: 3 // 지도의 확대 레벨
    };
    const map = new kakao.maps.Map(mapContainer, mapOption);

    // 생성된 지도를 저장
    mapRefs.current[index] = map;

    // 이후 지도 생성과 관련된 로직 추가

    if (pin) { 

      var selectedMarker = null;
      var customOverlay = null;

      pin.route.map((route) => {
      markerColorSwitch(route.nthDay)
      var imageSrc = markerColor,
      imageSize = new kakao.maps.Size(27, 27), // 마커이미지의 크기입니다
      imageOption = {offset: new kakao.maps.Point(13, 27)}; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.

      var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption)
      
      const marker = new kakao.maps.Marker({
                  map: map, // 마커를 표시할 지도
                  image: markerImage,
                  position: new kakao.maps.LatLng(route.latitude, route.longitude), // 마커를 표시할 위치
                  title : route.location, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
              })

      kakao.maps.event.addListener(marker, 'click', function(mouseEvent) {        

          zoomIn()
          // 지도 레벨은 지도의 확대 수준을 의미합니다
          // 지도 레벨은 1부터 14레벨이 있으며 숫자가 작을수록 지도 확대 수준이 높습니다
          function zoomIn() {        
              // 현재 지도의 레벨을 얻어옵니다
              map.setLevel(3)
          }

          panTo()
          function panTo() {
            // 이동할 위도 경도 위치를 생성합니다 
            var moveLatLon = new kakao.maps.LatLng(route.latitude, route.longitude);
            
            // 지도 중심을 부드럽게 이동시킵니다
            // 만약 이동할 거리가 지도 화면보다 크면 부드러운 효과 없이 이동합니다
            map.panTo(moveLatLon);            
          }

          markerColorSwitch(route.nthDay)
            // 선택된 마커와 동일할 경우
            if (selectedMarker === marker) {
              if (customOverlay) {
                  customOverlay.setMap(null);
              }
              selectedMarker = null;
          } else {
              if (customOverlay) {
                  customOverlay.setMap(null);
              }
              var iwContent = `<div class="customOverlay" style="border: 0; box-shadow: 0px 1px 2px #888; position: relative; bottom: 35px; border-radius: 6px; border: 2px solid ${infoColor}; background: #fff border-bottom: 2px solid #ddd; float: left;">
              <div class="title" style="display: block; text-align: center; background: #fff; padding: 10px 15px; font-size: 14px; font-weight: bold; border-radius: 6px;">
                  ${route.location}
              </div>`;

          customOverlay = new kakao.maps.CustomOverlay({
              map: map,
              position: position,
              content: iwContent,
              yAnchor: 1,
              zIndex: -1
          });
              selectedMarker = marker;
          }
        })
        
              const position = new kakao.maps.LatLng(route.latitude, route.longitude)
              bounds.extend(position)
              return { map, marker }
            })}
            map.setBounds(bounds)


  // day별 데이터 정리 함수
  const organizeDataByDay = (pin) => {
  
    pin.route.forEach((route) => {
      const { nthDay, order, ...locations } = route
  
      if (!locationsByDay[nthDay]) {
          locationsByDay[nthDay] = []
        }
  
        const { latitude, longitude, content, address, location, file } = locations
        locationsByDay[nthDay].push({ location, latitude, longitude, content })
      })
  
    return locationsByDay
  }

  organizeDataByDay(pin)


  // 선을 구성하는 좌표 배열입니다. 이 좌표들을 이어서 선을 표시합니다
  const allLinePaths = []
  const tempLocation = []


  Object.keys(locationsByDay).forEach((day, index) => {
    const locations = locationsByDay[day]


    // Add the last location of the previous day to the current day's locations
    if (index > 0) {
      const previousDay = tempLocation[index - 1];
      // console.log("previousDay", previousDay);
      if (previousDay) {
        locations.unshift(previousDay[previousDay.length - 1]);
      }
    }

      tempLocation.push(locations)
      // console.log("임시 로케이션 배열", tempLocation)

    const linePath = locations.map((location) => {
      return new kakao.maps.LatLng(location.latitude, location.longitude);
    });

    allLinePaths[day] = linePath

    // day별 배열들이 allLinePaths에 들어있음.
    // console.log("올라인패스", allLinePaths)
  
})
  // 지도에 표시할 선을 생성합니다
  
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

};

useEffect(() => {
  // console.log(pins)
  if (pins) {
      pins.forEach((_, index) => {
          createMap(index);
      });
  }
}, [pins]);

      return (
        <>
           {pins?.map((item, index) => (
            <Grid item xs={6} key={index}>
              <Card>
                <MapDiv key={index} id={`map${index}`}>
                {index >= pins.length - 1 && createMap(item, index)}
                  </MapDiv>

                {/* 날짜 형식 변경 되면 수정 할거 */}
                <PeriodH>{item.startDate} ~ {item.endDate}</PeriodH>
                
                {/* <PeriodH>{item.start_date} ~ {item.end_date} ({Number(item.end_date.slice(8))-Number(item.start_date.slice(8))}박 {Number(item.end_date.slice(8))-Number(item.start_date.slice(8))+1}일)</PeriodH> */}
                
                {/* <TagDiv>
                  {
                    item.tags.map((item, index) => (
                    `#${item.tag_name}   `))
                  }
                </TagDiv> */}

                <JustifyDiv onClick={() => handleGoArticle(item.id)}>
                  <h3>{item.title}</h3>
                  <p>{item.nickname}</p>
                </JustifyDiv>
                
              </Card>
            </Grid>
          ))}
          <div ref={pageEnd}></div>
        </>
      )

                }

export default MainMap