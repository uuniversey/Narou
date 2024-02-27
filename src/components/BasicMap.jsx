import React, { useEffect, useState } from 'react'

import marker1 from '../assets/images/mark1.png'
import marker2 from '../assets/images/mark2.png'
import marker3 from '../assets/images/mark3.png'
import marker4 from '../assets/images/mark4.png'
import marker5 from '../assets/images/mark5.png'
import marker6 from '../assets/images/mark6.png'
import marker7 from '../assets/images/mark7.png'

const { kakao } = window

function BasicMap({mapData, style}) {

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


useEffect(() => {
  mapData.forEach((data, index) => {
    // Generate dynamic map ID
    const mapId = `map${index + 1}`;
    // Create map using createMap function
    setMaps((prevMaps) => ({
      ...prevMaps,
      [mapId]: createMap(data, mapId)
    }));
  });
}, [mapData]);


const createMap = (mapData, mapId) => {
  var bounds = new kakao.maps.LatLngBounds();

  const newMap = () => {
      const mapContainer = document.getElementById(mapId)

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

          kakao.maps.event.addListener(marker, 'click', function() {        

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
              })
              
              map.setBounds(bounds)
      

      // day별 데이터 정리 함수
      const organizeDataByDay = (mapData) => {
          const locationsByDay = {};
          mapData.feeds.forEach((route) => {
              // console.log('확입합니다~~~~~~`', route)
              const { nthDay, sequence, ...locations } = route;
              console.log(nthDay)
              if (!locationsByDay[nthDay]) {
                  locationsByDay[nthDay] = [];
              }

              const { latitude, longitude, content, address, location, file } = locations;
              locationsByDay[nthDay].push({ location, latitude, longitude, content });
          });
          // console.log(locationsByDay)
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


  return (
    <>
      {mapData.map((data, index) => (
        <div key={`map${index + 1}`} id={`map${index + 1}`} style={style}></div>
      ))}
    </>
  );
}
export default BasicMap