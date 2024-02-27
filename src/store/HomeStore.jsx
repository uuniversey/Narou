import { create } from 'zustand'
import axios from '../axios.js'

const HomeStore = create((set) => ({
  
  photoData: [],
  pathData: [],

  // 피드 사진 데이터 가져오기
  getPhoto: (urls) => { 

    return axios.get(urls)
    .then((response) => {
      console.log(response)

      // 가져온 검색어 데이터 담기
      set({ photoData: response.data.data.content })
      
    })
    .catch((error) => {
      console.log('피드 사진 데이터 가져오기 실패', error)
    })
  },

  // 경로 데이터 가져오기
  getPath: (urls) => { 

    return axios.get(urls)
    .then((response) => {
      console.log(response)

      // 가져온 검색어 데이터 담기
      set({ pathData: response.data.data.content })

    })
    .catch((error) => {
      console.log('피드 경로 데이터 가져오기 실패', error)
    })
  },

  // 필터링 요청
  sendFilter: (data, urls) => { 
    
    return axios.post(urls, data)
    .then((response) => {
      console.log(response.data)
    })
    .catch((error) => {
      console.log('필터링 요청 실패', error)
    })
  },



}))

export default HomeStore