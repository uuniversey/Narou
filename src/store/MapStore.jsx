import { create } from 'zustand'
import axios from '../axios.js'

const useMapsStore = create((set) => ({
    mapData: null,
    setMapData: (value) => set((state) => ({
      mapData: value === null ? null : (state.mapData === null ? [value] : [...state.mapData, value])
  })),
  
    mapCreateDay: 1,
    setMapCreateDay: (value) => set({ mapCreateDay: value }),

    // 게시물 작성 페이지 - 선택한 마커의 정보를 담는 변수
    selectedMarkerItem: null,
    setSelectedMarkerItem: (value) => set((item) => ({ selectedMarkerItem: value })),
  
    // 비교페이지 - 더미데이터
    dummyData: {
      0: null,
      1: null,
    },
    setDummyData: (newData) => set((state) => ({ dummyData: { ...state.dummyData, ...newData } })),

    // 비교 스크랩 정보 가져올 함수


    // 메인 맵 피드 정보 가져올 함수
    setArticleData: (value) => set({ ArticleData: value }),
    
    async getArticleData(articleId) {
      try {
        const response = await axios.get(`article/read/${articleId}`);
        // 성공적으로 응답 받았을 때 처리할 로직
        console.log(response.data);
        // setArticleData(response.data);
      } catch (error) {
        // 요청이 실패했을 때 처리할 로직
        console.error(error);
        alert(error.message);
      }
    },

    // 비교 맵 가져올 axios 함수
    compareData: {
      0: null,
      1: null,
    },
    setCompareData: (newData) => set((state) => ({ compareData: { ...state.compareData, ...newData } })),
    
    async getCompareData(articleId1, articleId2) {
      try {
        const response = await axios.get(`article/compare?value1=${articleId1}&value2=${articleId2}`);
        // 성공적으로 응답 받았을 때 처리할 로직
        console.log(response.data);
        // 데이터 형식 확인해봐야 할듯 - 배열 안에 각각의 객체로 하나씩 주는지
        // setCompareData(response.data);
      } catch (error) {
        // 요청이 실패했을 때 처리할 로직
        console.error(error);
        alert(error.message);
      }
    },

    modalData: [],
    setModalData: (newData) => set((state) => ({ modalData: newData })),

    // 새로고침 시 map 데이터 및 dummy 데이터 초기화 함수
    resetMaps: (index) =>
    set((state) => {
      const updatedDummyData = { ...state.compareData };
      updatedDummyData[index] = null;

      return {
        compareData: updatedDummyData,
      };
    }),

    dumDumData: [
      {
        "article_id": 1235,
        "user_id": "abcd",
        "title": "triptrip",
        "likes": "10",
        "start_date": "2023-10-12",
        "end_date": "2023-10-21",
        "thumbnail:": "asdfasdfb.jpg",
        "feed": [
          {
            "nthday": 1,
            "order": 1,
            "latitude": 37.50128294245381,
            "longitude": 127.03959618033151,
            "content": "안녕하세요 서울특별시 강남구 멀티캠퍼스입니다.",
            "address": "서울특별시 강남구",
            "location": "멀티캠퍼스",
            "file": "asdfasdfb.jpg"
          },
          {
            "nthday": 1,
            "order": 2,
            "latitude": 37.50846199827949,
            "longitude": 127.10006166758153,
            "content": "안녕하세요 여기는 잠실 롯데월드입니다",
            "address": "서울특별시 송파구",
            "location": "롯데월드",
            "file": "asdfasdfb.jpg"
          },
          {
            "nthday": 3,
            "order": 1,
            "latitude": 37.57863588923095,
            "longitude": 126.97675830599083,
            "content": "안녕하세요 여기는 경복궁 근정전입니다.",
            "address": "서울특별시 종로구",
            "location": "경복궁",
            "file": "asdfasdfb.jpg"
          },
          {
            "nthday": 3,
            "order": 2,
            "latitude": 37.43397138710127,
            "longitude": 127.0182027217354,
            "content": "안녕하세요 여기는 과천 서울랜드입니다",
            "address": "경기도 과천시",
            "location": "서울랜드",
            "file": "asdfasdfb.jpg"
          }
        ],
        "tags": [
          {
          "tag_id":"0001",
          "tag_name":"여수밤바다",
          },
          {
          "tag_id":"0002",
          "tag_name":"탐험가금현",
          }
        ]
      },
      {
        "article_id": 1236,
        "user_id": "abcd",
        "title": "Gangneung Trip",
        "likes": "10",
        "start_date": "2023-10-12",
        "end_date": "2023-10-21",
        "thumbnail:": "asdfasdfb.jpg",
        "feed": [
          {
            "nthday": 1,
            "order": 1,
            "latitude": 37.754070,
            "longitude": 128.872074,
            "content": "안녕하세요 강원도 강릉 해돋이 공원입니다.",
            "address": "강원도 강릉시 중앙로 56",
            "location": "해돋이 공원",
            "file": "gangneung_1.jpg"
          },
          {
            "nthday": 1,
            "order": 2,
            "latitude": 37.767270,
            "longitude": 128.921847,
            "content": "안녕하세요 강릉 오죽헌입니다.",
            "address": "강원도 강릉시 교동 194-1",
            "location": "오죽헌",
            "file": "gangneung_2.jpg"
          },
          {
            "nthday": 2,
            "order": 1,
            "latitude": 37.784185,
            "longitude": 128.898320,
            "content": "안녕하세요 강릉 경포대입니다.",
            "address": "강원도 강릉시 경포로 365",
            "location": "경포대",
            "file": "gangneung_3.jpg"
          },
          {
            "nthday": 2,
            "order": 2,
            "latitude": 37.751396,
            "longitude": 128.877986,
            "content": "안녕하세요 강릉 강문해변입니다.",
            "address": "강원도 강릉시 강문동",
            "location": "강문해변",
            "file": "gangneung_4.jpg"
          },
          {
            "nthday": 3,
            "order": 1,
            "latitude": 37.804456,
            "longitude": 128.664824,
            "content": "안녕하세요 강릉 정동진 해변입니다.",
            "address": "강원도 강릉시 강동면 정동역길 39",
            "location": "정동진 해변",
            "file": "gangneung_5.jpg"
          }
        ],
        "tags": [
          {
          "tag_id":"0001",
          "tag_name":"여수밤바다",
          },
          {
          "tag_id":"0002",
          "tag_name":"탐험가금현",
          }
        ]
      },
    ]
  }))

export default useMapsStore