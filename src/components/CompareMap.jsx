import React, { useEffect, useState } from 'react'

import { styled, Box, Button, Grid, Modal, Typography, IconButton } from '@mui/material'
import { Refresh, Add } from '@mui/icons-material'

import compare from '../assets/images/compare.png'
import marker1 from '../assets/images/mark1.png'
import marker2 from '../assets/images/mark2.png'
import marker3 from '../assets/images/mark3.png'
import marker4 from '../assets/images/mark4.png'
import marker5 from '../assets/images/mark5.png'
import marker6 from '../assets/images/mark6.png'
import marker7 from '../assets/images/mark7.png'
import CompareMapStepper from './CompareMapStepper'
import CompareModal from './CompareModal'
import useMapsStore from '../store/MapStore'

// import datas from '../data.json'
const { kakao } = window


// 모달 관련 스타일
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
};

const BoxContainer = styled(Box)`
  border: 1px solid lightgrey;
  border-radius: 10px;  
  padding: 25px;
`

const BoxItem = styled(Box)`
  display: flex; 
  justify-content: center;
  align-items: center; 
  /* padding-bottom: 10px; */
`

const ArticleBox = styled(Box)`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  align-items: center;
  border: 2px dashed rgba(73, 124, 255, 0.3);
  min-height: 70px;
  margin-bottom: 20px;
`

const TmpArticle = styled(Box)`
  color: lightgray;
`

const AddBox = styled('div')`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 2px dashed rgba(73, 124, 255, 0.3);
  min-height: 350px;
`

const AddButton = styled(IconButton)`
  background-color: #497cff;
  color: white;  
  &:hover {
    background-color: white;
    color: #497cff;
  }
`

const RefreshButton = styled(IconButton)`
  margin-left: auto;
  padding-bottom: 10px;
`

function CompareMap(props) {

  // 모달 관련 변수 및 함수
  const [open1, setOpen1] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const { setDummyData, resetMaps } = useMapsStore() 

  // 새로 고침 변수
  const [refresh, setRefresh] = useState(false);

  const handleOpen1 = () => setOpen1(true);
  const handleOpen2 = () => setOpen2(true);
  
  const handleClose = () => {
    setOpen1(false);
    setOpen2(false);
  }

  // 새로 고침 버튼 클릭 처리 함수
  const handleRefresh1 = () => {
    // store에 저장된 map 데이터 초기화
    resetMaps(0);
    // Refresh 상태 변경
    setRefresh(true)
  };

  // 새로 고침 버튼 클릭 처리 함수
  const handleRefresh2 = () => {
    // store에 저장된 map 데이터 초기화
    resetMaps(1);
    // Refresh 상태 변경
    setRefresh(true)
  };

    const { map1, map2 } = props

    const [maps, setMaps] = useState([])

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

  
  const createMap = (mapData, mapId) => {
    var bounds = new kakao.maps.LatLngBounds();

    const newMap = () => {
        const mapContainer = document.getElementById(mapId);

        if (!mapContainer) return;

        // 기존에 생성된 지도가 있다면 삭제
        while (mapContainer.firstChild) {
            mapContainer.removeChild(mapContainer.firstChild);
        }
        
        const mapOption = {
            center: new kakao.maps.LatLng(37.5038623, 127.0428012), // 지도의 중심좌표
            level: 3 // 지도의 확대 레벨
        };
        const map = new kakao.maps.Map(mapContainer, mapOption);

        // 지도 확대 축소를 제어할 수 있는 줌 컨트롤을 생성합니다
        var zoomControl = new kakao.maps.ZoomControl();
        map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

        // 지도가 확대 또는 축소되면 마지막 파라미터로 넘어온 함수를 호출하도록 이벤트를 등록합니다
        kakao.maps.event.addListener(map, 'zoom_changed', function() {
            // 지도의 현재 레벨을 얻어옵니다
            var level = map.getLevel();
        });

        var selectedMarker = null;
        var customOverlay = null;

        mapData.feeds.map((route) => {
            markerColorSwitch(route.nthDay);
            var imageSrc = markerColor,
                imageSize = new kakao.maps.Size(27, 27), // 마커이미지의 크기입니다
                imageOption = { offset: new kakao.maps.Point(15, 30) }; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.

            var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

            const marker = new kakao.maps.Marker({
                map: map, // 마커를 표시할 지도
                image: markerImage,
                position: new kakao.maps.LatLng(route.latitude, route.longitude), // 마커를 표시할 위치
                title: route.location, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
            });

            kakao.maps.event.addListener(marker, 'click', function(mouseEvent) {

                zoomIn();

                function zoomIn() {
                    // 현재 지도의 레벨을 얻어옵니다
                    map.setLevel(3);
                }

                panTo();

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

            const position = new kakao.maps.LatLng(route.latitude, route.longitude);
            bounds.extend(position);
            return { map, marker };
        });
        map.setBounds(bounds);

        // day별 데이터 정리 함수
        const organizeDataByDay = (mapData) => {
            const locationsByDay = {};
            mapData.feeds.forEach((route) => {
                const { nthDay, order, ...locations } = route;

                if (!locationsByDay[nthDay]) {
                    locationsByDay[nthDay] = [];
                }

                const { latitude, longitude, content, address, location, file } = locations;
                locationsByDay[nthDay].push({ location, latitude, longitude, content });
            });

            return locationsByDay;
        };

        const locationsByDay = organizeDataByDay(mapData);

        // 선을 구성하는 좌표 배열입니다. 이 좌표들을 이어서 선을 표시합니다
        const allLinePaths = [];
        const tempLocation = [];

        Object.keys(locationsByDay).forEach((day, index) => {
            const locations = locationsByDay[day];

            // Add the last location of the previous day to the current day's locations
            if (index > 0) {
                const previousDay = tempLocation[index - 1];
                if (previousDay) {
                    locations.unshift(previousDay[previousDay.length - 1]);
                }
            }
            tempLocation.push(locations);

            const linePath = locations.map((location) => {
                return new kakao.maps.LatLng(location.latitude, location.longitude);
            });

            allLinePaths[day] = linePath;
        });

        // 지도에 표시할 선을 생성합니다
        allLinePaths.forEach((linePaths, idx) => {
            lineColorSwitch(idx);
            const polyline = new kakao.maps.Polyline({
                path: linePaths, // 선을 구성하는 좌표배열 입니다
                strokeWeight: 2.5, // 선의 두께 입니다
                strokeColor: lineColor, // 선의 색깔입니다
                strokeOpacity: 0.5, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
                strokeStyle: 'solid' // 선의 스타일입니다
            });
            // 지도에 선을 표시합니다 
            polyline.setMap(map);
        });
    };

    return newMap();
};


useEffect(() => {
  if (map1) {
      setMaps(createMap(map1, 'map1'));
  }
  if (map2) {
      setMaps(createMap(map2, 'map2'));
  }

  return () => {
      setRefresh(false);
  };
}, [map1, map2, refresh]);

    
      return (
        <>
          <Grid container spacing={3}>
            <Grid item xs={6}>
                <BoxContainer>
                    <BoxItem>
                      <ArticleBox>
                        { map1 ? ( <>{map1.title} (by {map1.member.nickname})</> 
                        ) : (
                          <TmpArticle>
                            제목 (by 작성자)
                          </TmpArticle>
                        )}
                      </ArticleBox>                      
                    </BoxItem>
                    <BoxItem>
                      <AddBox>
                        { map1 ? (
                          <div id={'map1'} style={{width:'90%', height:'300px'}}></div>
                        ) : (
                          <>
                            <AddButton onClick={handleOpen1}><Add /></AddButton>
                            <br />
                            <img src={compare} alt="비교" style={{ width: "100px", opacity: "50%"}}/>
                            
                            <Modal
                              open={open1}
                              onClose={() => {
                                handleClose()
                                setRefresh(true) // 모달이 닫힐 때 refresh 상태를 true로 설정
                              }}
                              aria-labelledby="modal-modal-title"
                              aria-describedby="modal-modal-description"
                            >
                              <Box sx={style}>
                                <CompareModal handleCloseModal={handleClose} index={0}/>
                              </Box>
                            </Modal>
                          </>
                        )}
                        </AddBox>
                    </BoxItem>
                    <BoxItem>
                      {map1 && <CompareMapStepper data={map1} />}
                    </BoxItem>
                    <BoxItem>
                      {map1 && (
                        <RefreshButton onClick={handleRefresh1} color="primary">
                          <Refresh />
                        </RefreshButton>
                      )}
                    </BoxItem>
                </BoxContainer>
            </Grid>

            <Grid item xs={6}>
                <BoxContainer>
                    <BoxItem>
                      <ArticleBox>
                        { map2 ? ( <>{map2.title} (by {map2.member.nickname})</> 
                        ) : (
                          <TmpArticle>
                            제목 (by 작성자)
                          </TmpArticle>
                        )}
                      </ArticleBox>                      
                    </BoxItem>
                    <BoxItem>
                      <AddBox>
                      { map2 ? ( <div id={'map2'} style={{width:'90%', height:'300px'}}></div>
                      ) : (
                        <>
                          <AddButton onClick={handleOpen2}><Add /></AddButton>
                          <br />
                          <img src={compare} alt="비교" style={{ width: "100px", opacity: "50%"}}/>
                          {/* 모달창 */}
                          <Modal
                            open={open2}
                            onClose={() => {
                              handleClose()
                              setRefresh(true) // 모달이 닫힐 때 refresh 상태를 true로 설정
                            }}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                          >
                            <Box sx={style}>
                                <CompareModal handleCloseModal={handleClose} index={1}/>
                            </Box>
                          </Modal>
                        </>
                      )}
                      </AddBox>
                    </BoxItem>
                    {/* 스텝퍼 - map2가 있을 때만 렌더링 됨*/}
                    <BoxItem>
                      {map2 && <CompareMapStepper data={map2} />}
                    </BoxItem>
                    <BoxItem>
                      {map2 && (
                        <RefreshButton onClick={handleRefresh2} color="primary">
                          <Refresh />
                        </RefreshButton>
                      )}
                    </BoxItem>
                </BoxContainer>
            </Grid>

          </Grid>
        </>
      )
}

export default CompareMap