import React, { useEffect } from "react"

import { styled } from '@mui/system';

const MapDiv = styled('div')`
  width: 100%;
  height: 600px;
  border: 1px solid lightgrey;
`

const { kakao } = window

function CreateMapBefore () {

  useEffect(() => {
    
    const mapContainer = document.getElementById("map");
      const mapOption = {
        center: new kakao.maps.LatLng(37.5038623, 127.0428012),
        level: 3,
      }
  
      // 맵 생성
      const map = new kakao.maps.Map(mapContainer, mapOption);

    // 정리 함수
    return () => {
      // 맵 요소 생성
      const map = new kakao.maps.Map(mapContainer, mapOption);
    };
  }, []);
    return (
        <MapDiv id="map"></MapDiv>
    )
    
}

export default CreateMapBefore