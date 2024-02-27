import React, { useEffect, useState } from 'react'

import styled from 'styled-components'

import { TextField, IconButton } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

import useMapsStore from '../store/MapStore'
import './ModalMap.css'

const { kakao } = window


const CreateContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 482px;
  position: relative;
`

const SearchIconBtn = styled(IconButton)`
  position: absolute;
  top: 3.8%;
  left: 33%;
  z-index: 1001;
`

const SearchField = styled(TextField)`
  width: 230px;
  position: absolute;
  opacity: 90%;
  top: 10px;
  left: 22%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 1000;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.25);
  border-radius: 100px;
  input {
      text-align: left;
      padding-left: 20px;
    }
  & input::placeholder {
    font-size: 14px; /* 원하는 크기로 조절하세요. */
  }
`

const MapContainer = styled.div`
  width: 100%;
  flex: 1;
  /* display: flex; */
`

// 마커 모양 관련 코드
var MARKER_WIDTH = 33, // 기본, 클릭 마커의 너비
    MARKER_HEIGHT = 37, // 기본, 클릭 마커의 높이
    OFFSET_X = 12, // 기본, 클릭 마커의 기준 X좌표
    OFFSET_Y = MARKER_HEIGHT, // 기본, 클릭 마커의 기준 Y좌표
    OVER_MARKER_WIDTH = 39, // 오버 마커의 너비
    OVER_MARKER_HEIGHT = 41, // 오버 마커의 높이
    OVER_OFFSET_X = 13, // 오버 마커의 기준 X좌표
    OVER_OFFSET_Y = OVER_MARKER_HEIGHT, // 오버 마커의 기준 Y좌표
    SPRITE_MARKER_URL = 'https://t1.daumcdn.net/localimg/localimages/07/2012/img/marker_normal.png', // 스프라이트 마커 이미지 URL
    SPRITE_WIDTH = 398, // 스프라이트 이미지 너비
    SPRITE_HEIGHT = 630, // 스프라이트 이미지 높이
    SPRITE_GAP = 10; // 스프라이트 이미지에서 마커간 간격

var markerSize = new kakao.maps.Size(MARKER_WIDTH, MARKER_HEIGHT), // 기본, 클릭 마커의 크기
    markerOffset = new kakao.maps.Point(OFFSET_X, OFFSET_Y), // 기본, 클릭 마커의 기준좌표
    overMarkerSize = new kakao.maps.Size(OVER_MARKER_WIDTH, OVER_MARKER_HEIGHT), // 오버 마커의 크기
    overMarkerOffset = new kakao.maps.Point(OVER_OFFSET_X, OVER_OFFSET_Y), // 오버 마커의 기준 좌표
    spriteImageSize = new kakao.maps.Size(SPRITE_WIDTH, SPRITE_HEIGHT); // 스프라이트 이미지의 크기

// 글쓰기 day
var day = 1

function ModalMap(props) {
  // const { handleMapTemp } = props

  // 검색결과 배열에 담아줌
  const [Places, setPlaces] = useState([])
  const { setSelectedMarkerItem, mapCreateDay, mapData, setMapData  } = useMapsStore()

  const [InputText, setInputText] = useState('')
  const [Place, setPlace] = useState('')
  const [keyword, setKeyword] = useState('역삼역 멀티캠퍼스')

  const onChange = (event) => {
    setInputText(event.target.value)
  }

  const handleSearch = (event) => {
    // event.preventDefault();
    // console.log(mapCreateDay)
    setPlace(InputText);
    setKeyword(InputText);
    // console.log(selectedMarkerInfo)
  };

  // 선택한 장소 정보 전달해줄 변수
  var selectedMarkerInfo ={
    day: 0,
    place_name: '',
    address_name: '',
    position: null,
    lat: 0,
    lng: 0
  }
  
  const DelieverMarkerInfo = () => {
    props.handleMapTempData(selectedMarkerInfo);
  };


  useEffect(() => {
    var selectedMarker = null
    var infowindow = new kakao.maps.InfoWindow({ zIndex: 1 })
    var markers = []
    const container = document.getElementById('myMap')

    if (!container) return;

          // 기존에 생성된 지도가 있다면 삭제
          while (container.firstChild) {
            container.removeChild(container.firstChild);
          }

    const options = {
      center: new kakao.maps.LatLng(36.6384, 127.6961),
      level: 13,
    }
    const map = new kakao.maps.Map(container, options)

    const ps = new kakao.maps.services.Places()

     // 키워드가 공백이 아닐 경우 키워드로 검색 실행
     if (keyword.trim() !== "") {
      ps.keywordSearch(keyword, placesSearchCB);
    } 

    // MakrerImage 객체를 생성하여 반환하는 함수입니다(마커에 이미지 넣어서 반환)
    function createMarkerImage(markerSize, offset, spriteOrigin) {
      var markerImage = new kakao.maps.MarkerImage(
          SPRITE_MARKER_URL, // 스프라이트 마커 이미지 URL
          markerSize, // 마커의 크기
          {
              offset: offset, // 마커 이미지에서의 기준 좌표
              spriteOrigin: spriteOrigin, // 스트라이프 이미지 중 사용할 영역의 좌상단 좌표
              spriteSize: spriteImageSize // 스프라이트 이미지의 크기
          }
      );
      
      return markerImage;
    }

   

    // 키워드로 검색하는 함수
    function placesSearchCB(data, status, pagination) {
      if (status === kakao.maps.services.Status.OK) {
        let bounds = new kakao.maps.LatLngBounds()

        // 정상적으로 검색이 완료됐으면
        // 검색 목록과 마커를 표출합니다
        displayPlaces(data)

        for (let i = 0; i < data.length; i++) {

          // 지도에 띄워줄 마커 생성
          displayMarker(data[i], i)
          bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x))

          // 결과로 반환할 ul 요소 생성
          var itemEl = getListItem(i, data[i])
        }

        map.setBounds(bounds)
        // 페이지 목록 보여주는 displayPagination() 추가
        displayPagination(pagination)
        setPlaces(data)
      } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
        alert('검색 결과가 존재하지 않습니다.');
        return;

      } else if (status === kakao.maps.services.Status.ERROR) {
        alert('검색 결과 중 오류가 발생했습니다.');
        return;
        
      }
    }

    // 검색 결과 목록 만들어주는 함수
    function displayPlaces(places) {

      var listEl = document.getElementById('placesList'), 
      menuEl = document.getElementById('menu_wrap'),
      fragment = document.createDocumentFragment(), 
      bounds = new kakao.maps.LatLngBounds(), 
      listStr = '';
      
      // 검색 결과 목록에 추가된 항목들을 제거합니다
      removeAllChildNods(listEl);
  
      // 지도에 표시되고 있는 마커를 제거합니다
      removeMarker();
      
      for ( var i=0; i<places.length; i++ ) {
  
          // 마커를 생성하고 지도에 표시합니다
          var placePosition = new kakao.maps.LatLng(places[i].y, places[i].x),
          itemEl = getListItem(i, places[i]); // 검색 결과 항목 Element를 생성합니다
          fragment.appendChild(itemEl);
          bounds.extend(placePosition);
      }
  
      // 검색결과 항목들을 검색결과 목록 Element에 추가합니다
      listEl.appendChild(fragment);
      menuEl.scrollTop = 0;
  
      // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
      map.setBounds(bounds);
    }


    // 검색결과 항목을 Element로 반환하는 함수입니다
    function getListItem(index, places) {

      var el = document.createElement('li'),
      itemStr = '<span class="markerbg marker_' + (index+1) + '"></span>' +
                  '<div class="info">' +
                  '   <h5>' + places.place_name + '</h5>';

      if (places.road_address_name) {
          itemStr += '    <span>' + places.road_address_name + '</span>' +
                      '   <span class="jibun gray">' +  places.address_name  + '</span>';
      } else {
          itemStr += '    <span>' +  places.address_name  + '</span>'; 
      }
                  
        itemStr += '  <span class="tel">' + places.phone  + '</span>' +
                  '</div>';           

      el.innerHTML = itemStr;
      el.className = 'item';

      el.addEventListener('click', function () {
        handleListItemClick(index);
      });
    
      return el;
    }
    
    // 결과 목록 클릭시 해당 마커 클릭 마커로 변경해주는 함수
    function handleListItemClick(index) {
  
      var clickedMarker = markers[index];
      var gapX = (MARKER_WIDTH + SPRITE_GAP), // 스프라이트 이미지에서 마커로 사용할 이미지 X좌표 간격 값
        originY = (20.6 + SPRITE_GAP) * index, // 스프라이트 이미지에서 기본, 클릭 마커로 사용할 Y좌표 값
        clickOrigin = new kakao.maps.Point(gapX * 1.8+1, originY) // 스프라이트 이미지에서 마우스오버 마커로 사용할 영역의 좌상단 좌표
    
      // 마커를 클릭했을 때
      if (clickedMarker) {
        // 클릭 마커 이미지로 변경
        clickedMarker.setImage(createMarkerImage(markerSize, markerOffset, clickOrigin));
    
        // 이미 클릭된 마커가 있을 경우 본래 이미지 유지
        if (selectedMarker && selectedMarker !== clickedMarker) {
          selectedMarker.setImage(selectedMarker.normalImage);
        }
    
        // 이미 클릭된 이미지에 클릭 마커 이미지 삽입
        selectedMarker = clickedMarker;
    
        // 인포윈도우 열어줌
        infowindow.setContent('<div style="padding:5px;font-size:12px;">' + clickedMarker.getTitle() + '</div>');
        infowindow.open(map, clickedMarker);
    
        // 선택된 마커 정보 업데이트
        selectedMarkerInfo = {
          day: mapCreateDay,
          place_name: clickedMarker.getTitle(),
          address_name: clickedMarker.address_name,
          position: clickedMarker.getPosition(),
          lat: clickedMarker.getPosition().getLat(),
          lng: clickedMarker.getPosition().getLng(),
        }
        setSelectedMarkerItem(selectedMarkerInfo)
        DelieverMarkerInfo()
      }
    }

    // 지도 위에 표시되고 있는 마커를 모두 제거합니다
    function removeMarker() {
      for ( var i = 0; i < markers.length; i++ ) {
          markers[i].setMap(null);
      }   
      markers = [];
    }

    function removeAllChildNods(el) {   
      while (el.hasChildNodes()) {
          el.removeChild (el.lastChild);
      }
    }

    // 검색결과 목록 하단에 페이지 번호 표시
    function displayPagination(pagination) {
      var paginationEl = document.getElementById('pagination'),
        fragment = document.createDocumentFragment(),
        i

      // 기존에 추가된 페이지 번호 삭제
      while (paginationEl.hasChildNodes()) {
        paginationEl.removeChild(paginationEl.lastChild)
      }

      for (i = 1; i <= pagination.last; i++) {
        var el = document.createElement('a')
        el.href = '#'
        el.innerHTML = i

        if (i === pagination.current) {
          el.className = 'on'
        } else {
          el.onclick = (function (i) {
            return function () {
              pagination.gotoPage(i)
            }
          })(i)
        }

        fragment.appendChild(el)
        
      }
      paginationEl.appendChild(fragment)
    }

    // 지도에 마커 표시해줌
    function displayMarker(place, i) {

      var gapX = (MARKER_WIDTH + SPRITE_GAP), // 스프라이트 이미지에서 마커로 사용할 이미지 X좌표 간격 값
        originY = (20.6 + SPRITE_GAP) * i, // 스프라이트 이미지에서 기본, 클릭 마커로 사용할 Y좌표 값
        overOriginY = (24.6 + SPRITE_GAP) * i, // 스프라이트 이미지에서 오버 마커로 사용할 Y좌표 값
        normalOrigin = new kakao.maps.Point(26, originY), // 스프라이트 이미지에서 기본 마커로 사용할 영역의 좌상단 좌표
        clickOrigin = new kakao.maps.Point(gapX * 1.8+1, originY), // 스프라이트 이미지에서 마우스오버 마커로 사용할 영역의 좌상단 좌표
        overOrigin = new kakao.maps.Point(gapX * 4.38, overOriginY); // 스프라이트 이미지에서 클릭 마커로 사용할 영역의 좌상단 좌표
        
        // 마커를 생성하고 지도위에 표시합니다
        addMarker(new kakao.maps.LatLng(place.y, place.x), normalOrigin, overOrigin, clickOrigin);

        // 마커를 생성하고 지도 위에 표시하고, 마커에 mouseover, mouseout, click 이벤트를 등록하는 함수입니다
        function addMarker(position, normalOrigin, overOrigin, clickOrigin) {
        
          // 기본 마커이미지, 오버 마커이미지, 클릭 마커이미지를 생성합니다
          var normalImage = createMarkerImage(markerSize, markerOffset, normalOrigin),
          overImage = createMarkerImage(overMarkerSize, overMarkerOffset, overOrigin),
          clickImage = createMarkerImage(markerSize, markerOffset, clickOrigin);

          let marker = new kakao.maps.Marker({
          map: map,
          position: new kakao.maps.LatLng(place.y, place.x),
          image: normalImage,
          title: place.place_name
        })

        marker.address_name = place.address_name;
        // 마커 객체에 마커아이디와 마커의 기본 이미지를 추가합니다
        marker.normalImage = normalImage;
        markers.push(marker);  // 배열에 생성된 마커를 추가합니다
        // 마커에 mouseover 이벤트를 등록합니다
        kakao.maps.event.addListener(marker, 'mouseover', function() {

          // 클릭된 마커가 없고, mouseover된 마커가 클릭된 마커가 아니면
          // 마커의 이미지를 오버 이미지로 변경합니다
          if (!selectedMarker || selectedMarker !== marker) {
              marker.setImage(overImage);
          }
        });

        // 마커에 mouseout 이벤트를 등록합니다
        kakao.maps.event.addListener(marker, 'mouseout', function() {

            // 클릭된 마커가 없고, mouseout된 마커가 클릭된 마커가 아니면
            // 마커의 이미지를 기본 이미지로 변경합니다
            if (!selectedMarker || selectedMarker !== marker) {
                marker.setImage(normalImage);
            }
        });

        // 마커에 click 이벤트를 등록합니다
        kakao.maps.event.addListener(marker, 'click', function() {

            // 클릭된 마커가 없고, click 마커가 클릭된 마커가 아니면
            // 마커의 이미지를 클릭 이미지로 변경합니다
            if (!selectedMarker || selectedMarker !== marker) {

                // 클릭된 마커 객체가 null이 아니면
                // 클릭된 마커의 이미지를 기본 이미지로 변경하고
                !!selectedMarker && selectedMarker.setImage(selectedMarker.normalImage);

                // 현재 클릭된 마커의 이미지는 클릭 이미지로 변경합니다
                marker.setImage(clickImage);
                // 클릭된 마커를 현재 클릭된 마커 객체로 설정합니다
                selectedMarker = marker
                  // 마커를 클릭했을 때 InfoWindow를 열어줍니다
                  infowindow.setContent('<div style="padding:5px;font-size:12px;">' + place.place_name + '</div>')
                  infowindow.open(map, marker);

              } else {
                  // 클릭된 마커가 현재 클릭된 마커이면 이미지를 기본 이미지로 변경합니다
                  marker.setImage(normalImage);

                  // 클릭된 마커를 해제하고 null로 설정합니다
                  selectedMarker = null;

                  // 마커를 클릭했을 때 InfoWindow를 닫아줍니다
                  infowindow.close();
              }
            
              selectedMarkerInfo = {
                day:  selectedMarker && mapCreateDay,
                place_name: selectedMarker && selectedMarker.getTitle(),
                address_name: selectedMarker && selectedMarker.address_name,
                position: selectedMarker && selectedMarker.getPosition(),
                lat: selectedMarker && selectedMarker.getPosition().getLat(),
                lng: selectedMarker && selectedMarker.getPosition().getLng(),
              };
              setSelectedMarkerItem(selectedMarkerInfo)
              DelieverMarkerInfo()
      })

      return marker
    }

  }

    return () => {
      // Remove all markers
      removeMarker();
      
      const mapContainer = document.getElementById("myMap")
      if (mapContainer) {
        // mapContainer.innerHTML = ''
      }
    
  }
  }, [keyword, setMapData])

  return (
    <div>
       <CreateContainer>

        {/* <form className="inputForm" onSubmit={handleSubmit}> */}
          <SearchField id="outlined-basic"
          placeholder="장소를 선택해 주세요..." 
          onChange={onChange} 
          value={InputText} 
          InputProps={{ sx: { borderRadius: 10, backgroundColor: 'white'}}}
          />
          <SearchIconBtn>
            <SearchIcon onClick={handleSearch}/>
          </SearchIconBtn>
        {/* </form> */}

      <MapContainer>
          { keyword && 
          (<div id="menu_wrap" className="bg_white">
          <div className="option"></div>
            <ul id="placesList"></ul>
          <div id="pagination"></div>
        </div>)}
          <div id="myMap" style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}></div>
      </MapContainer>

          {/* <button onClick={handleClose}>발행</button> */}
        </CreateContainer>
    </div>
  )
}

export default ModalMap