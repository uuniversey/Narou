import { create } from 'zustand'
import { useEffect } from 'react'

import axios from '../axios.js'

const SignUpStore = create((set) => ({
  
  // 초기값
  code: '457545754575',
  setCode: (value) => set({ code: value }),
  
  // 인증번호 발송
  codeData: (urls, data) => { 
    console.log(urls)
    return axios.post(urls, data)
    .then((response) => {
      console.log(response.data)
      set({ code: response.data.data.code })
    })
    .catch((error) => {
      console.log(error)
    })
  },

  // 닉네임 중복확인
  dupcheck: false,
  setDupcheck: (value) => set({ code: value }),

  nickNameData: (data, urls) => { 
    console.log(data, urls)
    return axios.post(urls, data)
    .then((response) => {
      console.log(response.data)
      set({ dupcheck: true })
      alert('사용할 수 있는 닉네임 입니다.')
    })
    .catch((error) => {
      console.log(error)
      alert('이미 사용중인 닉네임 입니다.')
    })
  },

  // pw 에러 메세지
  errorMessage: '',
  setErrorMessage: (value) => set({ errorMessage: value }),

  // 회원 가입 완료
  signupData: (urls, data) => { 
    return axios.put(urls, data)
    .then((response) => {
      console.log(response)
    })
    .catch((error) => {
      console.log(error)
    })
  },

}))

export default SignUpStore