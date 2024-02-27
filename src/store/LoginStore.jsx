import { create } from 'zustand'
import axios from '../axios.js'

const userInfoStore = create((set) => ({
  
  isLogined: false,
  setIsLogined: (value) => set({ isLogined: value }),

  // 로그인 하면서 받은 유저 정보
  userInfo: '',
  setUserInfo: (value) => set({ userInfo: value }),

  // 일반 로그인 로직
  Token: null,
  setToken: (value) => set({ Token: value }),
  fetchData: (data) => { 
    return axios.post('users/account/login', data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    .then((response) => {
      
      console.log(response, '로그인 했을 때 받은거')
      console.log(response.data, '로그인 했을 때 받은거')

      // 유저 정보 저장하기
      set({ userInfo: response.data.simpleUserProfile })

      // 토큰 세션 스토리지에 저장하기
      sessionStorage.setItem('accesstoken', JSON.stringify(response.data.accessToken))
      sessionStorage.setItem('refreshtoken', JSON.stringify(response.data.refreshToken))

      // 토큰 세션 스토리지에서 꺼내기
      set({ Token: sessionStorage.getItem('accesstoken').slice(1, -1) })

    })
    .catch((error) => {
      alert('아이디 혹은 비밀번호가 잘못되었습니다.')
      console.log(error)
    })
  },


  // 카카오 로그인 로직
  catchCookieK: (urls) => { 

    return axios.get(urls)
    .then((response) => {
      console.log('카카오 로그인', response)
      // 토큰 세션 스토리지에 저장하기
      localStorage.setItem('accesstoken', JSON.stringify(response.data.accessToken))
      localStorage.setItem('refreshtoken', JSON.stringify(response.data.refreshToken))

      // 토큰 세션 스토리지에서 꺼내기
      set({ Token: localStorage.getItem('accesstoken').slice(1, -1) })
    })
    .catch((error) => {
      console.log(error)
    })
  },

  // 네이버 로그인 로직
  catchCookienN: (urls) => { 

    return axios.get(urls)
    .then((response) => {
      console.log('네이버 로그인', response)
      // 토큰 세션 스토리지에 저장하기
      localStorage.setItem('accesstoken', JSON.stringify(response.data.accessToken))
      localStorage.setItem('refreshtoken', JSON.stringify(response.data.refreshToken))

      // 토큰 세션 스토리지에서 꺼내기
      set({ Token: localStorage.getItem('accesstoken').slice(1, -1) })

    })
    .catch((error) => {
      console.log(error)
    })
  },

  // 구글 로그인 로직
  catchCookieG: (urls) => { 

    return axios.get(urls)
    .then((response) => {
      // 토큰 세션 스토리지에 저장하기
      localStorage.setItem('accesstoken', JSON.stringify(response.data.accessToken))
      localStorage.setItem('refreshtoken', JSON.stringify(response.data.refreshToken))

      // 토큰 세션 스토리지에서 꺼내기
      set({ Token: localStorage.getItem('accesstoken').slice(1, -1) })

    })
    .catch((error) => {
      console.log(error)
    })
  },

}))

export default userInfoStore